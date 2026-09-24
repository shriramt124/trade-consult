from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models import Subscription, SubscriptionStatus


def activate_subscription(db: Session, subscription: Subscription) -> Subscription:
    """Activate a pending subscription after a successful payment."""
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    subscription.status = SubscriptionStatus.active
    subscription.starts_at = now
    subscription.ends_at = now + timedelta(days=subscription.plan.duration_days)
    db.commit()
    db.refresh(subscription)
    return subscription


def expire_due_subscriptions(db: Session) -> int:
    """Mark active subscriptions whose end date has passed as expired.

    Call this from a scheduled Celery beat task in production.
    """
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    due = (
        db.query(Subscription)
        .filter(
            Subscription.status == SubscriptionStatus.active,
            Subscription.ends_at.isnot(None),
            Subscription.ends_at < now,
        )
        .all()
    )
    for sub in due:
        sub.status = SubscriptionStatus.expired
    db.commit()
    return len(due)
