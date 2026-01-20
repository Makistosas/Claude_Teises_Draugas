"""
============================================================
SASKAITA.LT - Invoice Tasks
============================================================
"""

from datetime import datetime
from sqlalchemy import select
from app.celery_app import celery_app
from app.database import async_session
from app.models import Invoice, InvoiceStatus
import asyncio
import logging

logger = logging.getLogger(__name__)


async def _check_overdue_invoices():
    """Check and mark overdue invoices"""
    async with async_session() as db:
        # Find invoices that are past due date and not paid
        result = await db.execute(
            select(Invoice).where(
                Invoice.status == InvoiceStatus.SENT,
                Invoice.due_date < datetime.utcnow()
            )
        )
        invoices = result.scalars().all()

        count = 0
        for invoice in invoices:
            invoice.status = InvoiceStatus.OVERDUE
            count += 1

        await db.commit()
        logger.info(f"Marked {count} invoices as overdue")
        return count


@celery_app.task(name="app.tasks.invoice_tasks.check_overdue_invoices")
def check_overdue_invoices():
    """Celery task to check overdue invoices"""
    return asyncio.run(_check_overdue_invoices())
