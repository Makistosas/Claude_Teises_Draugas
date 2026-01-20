"""
============================================================
SASKAITA.LT - Subscription Tasks
============================================================
"""

from datetime import datetime
from sqlalchemy import select
from app.celery_app import celery_app
from app.database import async_session
from app.models import User, SubscriptionPlan
import asyncio
import logging

logger = logging.getLogger(__name__)


async def _check_expired_subscriptions():
    """Check and downgrade expired subscriptions"""
    async with async_session() as db:
        # Find users with expired subscriptions
        result = await db.execute(
            select(User).where(
                User.subscription_plan != SubscriptionPlan.FREE,
                User.subscription_expires < datetime.utcnow()
            )
        )
        users = result.scalars().all()

        count = 0
        for user in users:
            user.subscription_plan = SubscriptionPlan.FREE
            user.subscription_expires = None
            count += 1

        await db.commit()
        logger.info(f"Downgraded {count} expired subscriptions")
        return count


async def _reset_monthly_counters():
    """Reset monthly invoice counters for all users"""
    async with async_session() as db:
        result = await db.execute(select(User))
        users = result.scalars().all()

        for user in users:
            user.invoices_this_month = 0
            user.invoices_reset_date = datetime.utcnow()

        await db.commit()
        logger.info(f"Reset monthly counters for {len(users)} users")
        return len(users)


@celery_app.task(name="app.tasks.subscription_tasks.check_expired_subscriptions")
def check_expired_subscriptions():
    """Celery task to check expired subscriptions"""
    return asyncio.run(_check_expired_subscriptions())


@celery_app.task(name="app.tasks.subscription_tasks.reset_monthly_counters")
def reset_monthly_counters():
    """Celery task to reset monthly counters"""
    return asyncio.run(_reset_monthly_counters())
