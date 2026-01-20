"""
============================================================
SASKAITA.LT - Email Service
============================================================
"""

import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import logging
import os
from datetime import datetime

from jinja2 import Environment, FileSystemLoader
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import async_session
from app.models import Invoice, EmailLog
from app.config import settings
from app.services.pdf_service import generate_invoice_pdf

logger = logging.getLogger(__name__)

# Setup Jinja2 for email templates
template_dir = os.path.join(os.path.dirname(__file__), "..", "templates")
env = Environment(loader=FileSystemLoader(template_dir))


async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    attachments: list = None
) -> bool:
    """
    Send email via SMTP

    Args:
        to_email: Recipient email
        subject: Email subject
        html_content: HTML body
        attachments: List of (filename, content) tuples

    Returns:
        bool: Success status
    """
    try:
        # Create message
        msg = MIMEMultipart()
        msg["From"] = f"{settings.email_from_name} <{settings.email_from}>"
        msg["To"] = to_email
        msg["Subject"] = subject

        # Add HTML body
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        # Add attachments
        if attachments:
            for filename, content in attachments:
                part = MIMEApplication(content, Name=filename)
                part["Content-Disposition"] = f'attachment; filename="{filename}"'
                msg.attach(part)

        # Send via SMTP
        await aiosmtplib.send(
            msg,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user,
            password=settings.smtp_password,
            start_tls=True
        )

        logger.info(f"Email sent to {to_email}")
        return True

    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False


async def send_invoice_email(
    invoice_id: int,
    to_email: str,
    message: str = None
) -> bool:
    """
    Send invoice email with PDF attachment

    Args:
        invoice_id: Invoice ID
        to_email: Recipient email
        message: Optional custom message

    Returns:
        bool: Success status
    """
    async with async_session() as db:
        # Load invoice
        result = await db.execute(
            select(Invoice)
            .options(
                selectinload(Invoice.company),
                selectinload(Invoice.client)
            )
            .where(Invoice.id == invoice_id)
        )
        invoice = result.scalar_one_or_none()

        if not invoice:
            logger.error(f"Invoice {invoice_id} not found")
            return False

        # Generate PDF if not exists
        pdf_path = f"/app/pdfs/{invoice.invoice_number.replace('/', '-')}.pdf"
        if not os.path.exists(pdf_path):
            pdf_path = await generate_invoice_pdf(invoice_id)

        # Read PDF content
        with open(pdf_path, "rb") as f:
            pdf_content = f.read()

        # Render email template
        template = env.get_template("email_invoice.html")
        html_content = template.render(
            invoice=invoice,
            company=invoice.company,
            client=invoice.client,
            custom_message=message
        )

        # Prepare subject
        subject = f"Sąskaita faktūra {invoice.invoice_number} iš {invoice.company.name}"

        # Send email
        success = await send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            attachments=[(f"{invoice.invoice_number}.pdf", pdf_content)]
        )

        # Log email
        email_log = EmailLog(
            to_email=to_email,
            subject=subject,
            template="invoice",
            sent=success,
            invoice_id=invoice_id,
            sent_at=datetime.utcnow() if success else None
        )
        db.add(email_log)
        await db.commit()

        return success


async def send_payment_reminder(invoice_id: int) -> bool:
    """Send payment reminder for overdue invoice"""
    async with async_session() as db:
        result = await db.execute(
            select(Invoice)
            .options(
                selectinload(Invoice.company),
                selectinload(Invoice.client)
            )
            .where(Invoice.id == invoice_id)
        )
        invoice = result.scalar_one_or_none()

        if not invoice or not invoice.client.email:
            return False

        # Render reminder template
        template = env.get_template("email_reminder.html")
        html_content = template.render(
            invoice=invoice,
            company=invoice.company,
            client=invoice.client
        )

        subject = f"Priminimas: Sąskaita {invoice.invoice_number} laukia apmokėjimo"

        success = await send_email(
            to_email=invoice.client.email,
            subject=subject,
            html_content=html_content
        )

        # Log
        email_log = EmailLog(
            to_email=invoice.client.email,
            subject=subject,
            template="reminder",
            sent=success,
            invoice_id=invoice_id,
            sent_at=datetime.utcnow() if success else None
        )
        db.add(email_log)
        await db.commit()

        return success
