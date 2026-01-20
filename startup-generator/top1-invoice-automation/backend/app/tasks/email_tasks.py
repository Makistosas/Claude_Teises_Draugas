"""
============================================================
SASKAITA.LT - Email Tasks
============================================================
"""

from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.celery_app import celery_app
from app.database import async_session
from app.models import Invoice, InvoiceStatus
from app.services.email_service import send_payment_reminder
import asyncio
import logging

logger = logging.getLogger(__name__)


async def _send_payment_reminders():
    """Send payment reminders for overdue invoices"""
    async with async_session() as db:
        # Find overdue invoices that haven't been reminded in last 3 days
        three_days_ago = datetime.utcnow() - timedelta(days=3)

        result = await db.execute(
            select(Invoice)
            .options(selectinload(Invoice.client))
            .where(
                Invoice.status == InvoiceStatus.OVERDUE,
                Invoice.client.has()  # Has client with email
            )
        )
        invoices = result.scalars().all()

        sent_count = 0
        for invoice in invoices:
            if invoice.client.email:
                success = await send_payment_reminder(invoice.id)
                if success:
                    sent_count += 1

        logger.info(f"Sent {sent_count} payment reminders")
        return sent_count


@celery_app.task(name="app.tasks.email_tasks.send_payment_reminders")
def send_payment_reminders():
    """Celery task to send payment reminders"""
    return asyncio.run(_send_payment_reminders())


@celery_app.task(name="app.tasks.email_tasks.send_invoice_email_task")
def send_invoice_email_task(invoice_id: int, to_email: str, message: str = None):
    """Celery task to send invoice email"""
    from app.services.email_service import send_invoice_email
    return asyncio.run(send_invoice_email(invoice_id, to_email, message))
