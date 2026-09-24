from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, generate_otp
from app.deps import get_current_user
from app.models import OTP, User
from app.schemas import OTPRequest, OTPResponse, OTPVerify, Token, UserOut, UserUpdate
from app.services.notifications import send_sms

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/otp/request", response_model=OTPResponse)
async def request_otp(
    body: OTPRequest, background: BackgroundTasks, db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    last = db.scalar(
        select(OTP)
        .where(OTP.phone == body.phone)
        .order_by(OTP.created_at.desc())
    )
    if last and (now - last.created_at) < timedelta(seconds=settings.OTP_RESEND_COOLDOWN_SECONDS):
        wait = settings.OTP_RESEND_COOLDOWN_SECONDS - int((now - last.created_at).total_seconds())
        raise HTTPException(
            status_code=429,
            detail=f"Please wait {max(wait, 1)}s before requesting another OTP.",
        )

    code = generate_otp()
    otp = OTP(
        phone=body.phone,
        code=code,
        expires_at=datetime.now(timezone.utc).replace(tzinfo=None)
        + timedelta(minutes=settings.OTP_EXPIRY_MINUTES),
    )
    db.add(otp)
    db.commit()

    background.add_task(send_sms, body.phone, f"Your login OTP is {code}")

    response = OTPResponse(message="OTP sent")
    if settings.DEV_RETURN_OTP:
        response.dev_otp = code
    return response


@router.post("/otp/verify", response_model=Token)
def verify_otp(body: OTPVerify, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    latest = db.scalar(
        select(OTP)
        .where(OTP.phone == body.phone, OTP.consumed.is_(False))
        .order_by(OTP.created_at.desc())
    )
    if latest and latest.attempts >= settings.OTP_MAX_ATTEMPTS:
        raise HTTPException(
            status_code=429, detail="Too many incorrect attempts. Request a new OTP."
        )

    otp = db.scalar(
        select(OTP)
        .where(OTP.phone == body.phone, OTP.code == body.code, OTP.consumed.is_(False))
        .order_by(OTP.created_at.desc())
    )
    if not otp or otp.expires_at < now:
        if latest:
            latest.attempts += 1
            db.commit()
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    otp.consumed = True

    user = db.scalar(select(User).where(User.phone == body.phone))
    if not user:
        user = User(phone=body.phone, name=body.name)
        db.add(user)
        db.flush()
    elif body.name and not user.name:
        user.name = body.name

    db.commit()
    db.refresh(user)

    token = create_access_token(subject=str(user.id), role=user.role.value)
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.patch("/me", response_model=UserOut)
def update_me(
    body: UserUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if body.name is not None:
        user.name = body.name
    if body.email is not None:
        user.email = body.email
    db.commit()
    db.refresh(user)
    return user
