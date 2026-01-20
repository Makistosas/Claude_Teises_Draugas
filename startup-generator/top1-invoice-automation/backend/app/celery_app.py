"""
============================================================
SASKAITA.LT - Celery Configuration
============================================================
"""

from celery import Celery
from celery.schedules import crontab
from app.config import settings

# Create Celery app
celery_app = Celery(
    "saskaita",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=[
        "app.tasks.invoice_tasks",
        "app.tasks.email_tasks",
        "app.tasks.subscription_tasks"
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Europe/Vilnius",
    enable_utc=True,

    # Beat schedule (periodic tasks)
    beat_schedule={
        # Check for overdue invoices every day at 9:00
        "check-overdue-invoices": {
            "task": "app.tasks.invoice_tasks.check_overdue_invoices",
            "schedule": crontab(hour=9, minute=0),
        },
        # Send payment reminders every day at 10:00
        "send-payment-reminders": {
            "task": "app.tasks.email_tasks.send_payment_reminders",
            "schedule": crontab(hour=10, minute=0),
        },
        # Check expired subscriptions every day at 0:00
        "check-expired-subscriptions": {
            "task": "app.tasks.subscription_tasks.check_expired_subscriptions",
            "schedule": crontab(hour=0, minute=0),
        },
        # Reset monthly invoice counters on 1st of each month
        "reset-monthly-counters": {
            "task": "app.tasks.subscription_tasks.reset_monthly_counters",
            "schedule": crontab(day_of_month=1, hour=0, minute=5),
        },
    }
)
