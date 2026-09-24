import hashlib
import hmac
import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.deps import get_current_user
from app.models import Payment, PaymentStatus, Subscription, SubscriptionStatus, User
from app.schemas import OrderOut, SubscribeRequest
from app.services.subscription_service import activate_subscription

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/razorpay/order", response_model=OrderOut, status_code=201)
def create_order(
    body: SubscribeRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Step 2 of checkout: create a Razorpay order for a pending subscription."""
    sub = db.scalar(
        select(Subscription).where(
            Subscription.user_id == user.id,
            Subscription.plan_id == body.plan_id,
            Subscription.status == SubscriptionStatus.pending,
        ).order_by(Subscription.created_at.desc())
    )
    if not sub:
        raise HTTPException(
            status_code=400,
            detail="No pending subscription found. Call /subscriptions/subscribe first.",
        )

    amount = sub.plan.price_paise

    if settings.razorpay_configured:
        import razorpay

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        order = client.order.create(
            {
                "amount": amount,
                "currency": "INR",
                "receipt": f"sub_{sub.id}",
                "notes": {"subscription_id": sub.id, "user_id": user.id},
            }
        )
        order_id = order["id"]
        key_id = settings.RAZORPAY_KEY_ID
    else:
        # Dev mode: mock order so the checkout flow is testable end-to-end
        order_id = f"order_dev_{sub.id}"
        key_id = None
        logger.warning("Razorpay not configured — returning mock order %s", order_id)

    sub.razorpay_order_id = order_id
    payment = Payment(
        user_id=user.id,
        subscription_id=sub.id,
        razorpay_order_id=order_id,
        amount_paise=amount,
    )
    db.add(payment)
    db.commit()

    return OrderOut(
        order_id=order_id,
        amount_paise=amount,
        key_id=key_id,
        subscription_id=sub.id,
    )


@router.post("/razorpay/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    """Razorpay -> us: verifies signature and activates the subscription."""
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    if settings.RAZORPAY_WEBHOOK_SECRET:
        expected = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(), body, hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(expected, signature):
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = await request.json()
    event = payload.get("event")

    if event == "payment.captured":
        entity = payload["payload"]["payment"]["entity"]
        order_id = entity.get("order_id")
        payment_id = entity.get("id")

        payment = db.scalar(
            select(Payment).where(Payment.razorpay_order_id == order_id)
        )
        if payment:
            payment.status = PaymentStatus.captured
            payment.razorpay_payment_id = payment_id
            sub = db.get(Subscription, payment.subscription_id)
            if sub and sub.status == SubscriptionStatus.pending:
                activate_subscription(db, sub)
            db.commit()

    elif event == "payment.failed":
        entity = payload["payload"]["payment"]["entity"]
        payment = db.scalar(
            select(Payment).where(Payment.razorpay_order_id == entity.get("order_id"))
        )
        if payment:
            payment.status = PaymentStatus.failed
            db.commit()

    return {"status": "ok"}


@router.post("/dev/confirm/{order_id}")
def dev_confirm_payment(
    order_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """DEV ONLY: simulate a successful payment when Razorpay keys are absent."""
    if settings.razorpay_configured:
        raise HTTPException(status_code=403, detail="Only available in dev mode")
    payment = db.scalar(
        select(Payment).where(
            Payment.razorpay_order_id == order_id, Payment.user_id == user.id
        )
    )
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    payment.status = PaymentStatus.captured
    payment.razorpay_payment_id = f"pay_dev_{payment.id}"
    sub = db.get(Subscription, payment.subscription_id)
    if sub and sub.status == SubscriptionStatus.pending:
        activate_subscription(db, sub)
    db.commit()
    return {"status": "captured", "subscription_id": payment.subscription_id}
