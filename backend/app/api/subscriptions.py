from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_user
from app.models import Plan, Subscription, SubscriptionStatus, User
from app.schemas import SubscribeRequest, SubscriptionOut

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.get("/my", response_model=list[SubscriptionOut])
def my_subscriptions(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    return db.scalars(
        select(Subscription)
        .where(Subscription.user_id == user.id)
        .order_by(Subscription.created_at.desc())
    ).all()


@router.post("/subscribe", response_model=SubscriptionOut, status_code=201)
def create_pending_subscription(
    body: SubscribeRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Step 1 of checkout: create a pending subscription.

    The client then creates a Razorpay order (POST /payments/razorpay/order)
    and the subscription is activated by the payment webhook.
    """
    plan = db.get(Plan, body.plan_id)
    if not plan or not plan.is_active:
        raise HTTPException(status_code=404, detail="Plan not found")

    existing = db.scalar(
        select(Subscription).where(
            Subscription.user_id == user.id,
            Subscription.plan_id == plan.id,
            Subscription.status == SubscriptionStatus.active,
        )
    )
    if existing:
        raise HTTPException(
            status_code=400, detail="You already have an active subscription to this plan"
        )

    sub = Subscription(user_id=user.id, plan_id=plan.id)
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub
