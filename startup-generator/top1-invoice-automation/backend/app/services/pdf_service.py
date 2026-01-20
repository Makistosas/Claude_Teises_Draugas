"""
============================================================
SASKAITA.LT - PDF Generation Service
============================================================
"""

import os
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import logging

from app.database import async_session
from app.models import Invoice
from sqlalchemy import select
from sqlalchemy.orm import selectinload

logger = logging.getLogger(__name__)

# Setup Jinja2
template_dir = os.path.join(os.path.dirname(__file__), "..", "templates")
env = Environment(loader=FileSystemLoader(template_dir))


def format_money(cents: int) -> str:
    """Format cents to EUR string"""
    euros = cents / 100
    return f"{euros:,.2f} €".replace(",", " ")


def format_date(dt: datetime) -> str:
    """Format datetime to Lithuanian date"""
    if not dt:
        return ""
    return dt.strftime("%Y-%m-%d")


# Add filters to Jinja2
env.filters["money"] = format_money
env.filters["date"] = format_date


async def generate_invoice_pdf(invoice_id: int) -> str:
    """
    Generate PDF for invoice

    Returns: path to generated PDF file
    """
    logger.info(f"Generating PDF for invoice {invoice_id}")

    async with async_session() as db:
        # Load invoice with all relations
        result = await db.execute(
            select(Invoice)
            .options(
                selectinload(Invoice.company),
                selectinload(Invoice.client),
                selectinload(Invoice.items)
            )
            .where(Invoice.id == invoice_id)
        )
        invoice = result.scalar_one_or_none()

        if not invoice:
            logger.error(f"Invoice {invoice_id} not found")
            raise ValueError(f"Invoice {invoice_id} not found")

        # Prepare template data
        data = {
            "invoice": invoice,
            "company": invoice.company,
            "client": invoice.client,
            "items": sorted(invoice.items, key=lambda x: x.position),
            "generated_at": datetime.utcnow()
        }

        # Render HTML
        template = env.get_template("invoice.html")
        html_content = template.render(**data)

        # Generate PDF
        pdf_dir = "/app/pdfs"
        os.makedirs(pdf_dir, exist_ok=True)

        pdf_filename = f"{invoice.invoice_number.replace('/', '-')}.pdf"
        pdf_path = os.path.join(pdf_dir, pdf_filename)

        HTML(string=html_content).write_pdf(pdf_path)

        # Update invoice with PDF URL
        invoice.pdf_url = f"/static/pdfs/{pdf_filename}"
        await db.commit()

        logger.info(f"PDF generated: {pdf_path}")

        return pdf_path


# Synchronous version for Celery
def generate_invoice_pdf_sync(invoice_id: int) -> str:
    """Synchronous wrapper for Celery"""
    import asyncio
    return asyncio.run(generate_invoice_pdf(invoice_id))
