"""
============================================================
SASKAITA.LT - Invoices API
============================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, Company, Client, Invoice, InvoiceItem, InvoiceStatus, SubscriptionPlan
from app.schemas import (
    InvoiceCreate, InvoiceUpdate, InvoiceResponse,
    InvoiceSummary, DashboardStats, SendInvoiceEmail
)
from app.api.auth import get_current_user
from app.services.pdf_service import generate_invoice_pdf
from app.services.email_service import send_invoice_email
from app.config import settings

router = APIRouter()


async def verify_company_access(company_id: int, user: User, db: AsyncSession) -> Company:
    """Verify user has access to company"""
    result = await db.execute(
        select(Company).where(Company.id == company_id, Company.user_id == user.id)
    )
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Įmonė nerasta")
    return company


async def check_invoice_limit(user: User, db: AsyncSession) -> bool:
    """Check if user hasn't exceeded invoice limit"""
    # Reset monthly counter if needed
    if user.invoices_reset_date.month != datetime.utcnow().month:
        user.invoices_this_month = 0
        user.invoices_reset_date = datetime.utcnow()
        await db.commit()

    # Get limit based on plan
    limits = {
        SubscriptionPlan.FREE: settings.free_invoice_limit,
        SubscriptionPlan.STARTER: 50,
        SubscriptionPlan.PRO: 999999,
        SubscriptionPlan.BUSINESS: 999999
    }

    limit = limits.get(user.subscription_plan, 5)

    if user.invoices_this_month >= limit:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Pasiektas mėnesio sąskaitų limitas ({limit}). Atnaujinkite planą."
        )

    return True


def generate_invoice_number(company: Company) -> str:
    """Generate next invoice number"""
    year = datetime.utcnow().year
    number = company.next_invoice_number
    return f"{company.invoice_prefix}-{year}-{number:04d}"


@router.post("/", response_model=InvoiceResponse)
async def create_invoice(
    invoice_data: InvoiceCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Sukurti naują sąskaitą faktūrą"""

    # Verify access and limits
    company = await verify_company_access(invoice_data.company_id, current_user, db)
    await check_invoice_limit(current_user, db)

    # Verify client belongs to company
    result = await db.execute(
        select(Client).where(
            Client.id == invoice_data.client_id,
            Client.company_id == company.id
        )
    )
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Klientas nerastas")

    # Generate invoice number
    invoice_number = generate_invoice_number(company)
    company.next_invoice_number += 1

    # Calculate totals
    subtotal = 0
    items = []

    for idx, item_data in enumerate(invoice_data.items):
        item_total = int(item_data.quantity * item_data.unit_price)
        subtotal += item_total

        item = InvoiceItem(
            description=item_data.description,
            quantity=item_data.quantity,
            unit=item_data.unit,
            unit_price=item_data.unit_price,
            total=item_total,
            position=idx
        )
        items.append(item)

    vat_amount = int(subtotal * invoice_data.vat_rate / 100)
    total = subtotal + vat_amount

    # Create invoice
    invoice = Invoice(
        company_id=company.id,
        client_id=client.id,
        invoice_number=invoice_number,
        issue_date=invoice_data.issue_date or datetime.utcnow(),
        due_date=invoice_data.due_date or (datetime.utcnow() + timedelta(days=14)),
        vat_rate=invoice_data.vat_rate,
        subtotal=subtotal,
        vat_amount=vat_amount,
        total=total,
        notes=invoice_data.notes,
        payment_terms=invoice_data.payment_terms,
        status=InvoiceStatus.DRAFT
    )

    # Add items
    for item in items:
        item.invoice = invoice

    db.add(invoice)

    # Update user's invoice count
    current_user.invoices_this_month += 1

    await db.commit()
    await db.refresh(invoice)

    # Generate PDF in background
    background_tasks.add_task(generate_invoice_pdf, invoice.id)

    # Reload with relationships
    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.items))
        .where(Invoice.id == invoice.id)
    )
    invoice = result.scalar_one()

    return invoice


@router.get("/", response_model=list[InvoiceSummary])
async def list_invoices(
    company_id: int,
    status: InvoiceStatus = None,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Gauti sąskaitų sąrašą"""

    await verify_company_access(company_id, current_user, db)

    query = (
        select(Invoice, Client.name.label("client_name"))
        .join(Client)
        .where(Invoice.company_id == company_id)
        .order_by(Invoice.created_at.desc())
        .offset(skip)
        .limit(limit)
    )

    if status:
        query = query.where(Invoice.status == status)

    result = await db.execute(query)
    rows = result.all()

    return [
        InvoiceSummary(
            id=row.Invoice.id,
            invoice_number=row.Invoice.invoice_number,
            client_name=row.client_name,
            total=row.Invoice.total,
            status=row.Invoice.status,
            issue_date=row.Invoice.issue_date,
            due_date=row.Invoice.due_date
        )
        for row in rows
    ]


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Gauti dashboard statistikas"""

    await verify_company_access(company_id, current_user, db)

    # Get all invoices for company
    result = await db.execute(
        select(Invoice).where(Invoice.company_id == company_id)
    )
    invoices = result.scalars().all()

    # Calculate stats
    total_invoices = len(invoices)
    paid_invoices = len([i for i in invoices if i.status == InvoiceStatus.PAID])
    unpaid_invoices = len([i for i in invoices if i.status in [InvoiceStatus.SENT, InvoiceStatus.DRAFT]])
    overdue_invoices = len([i for i in invoices if i.status == InvoiceStatus.OVERDUE])

    total_revenue = sum(i.total for i in invoices if i.status == InvoiceStatus.PAID)
    pending_amount = sum(i.total for i in invoices if i.status in [InvoiceStatus.SENT, InvoiceStatus.OVERDUE])

    # This month
    start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    this_month = [i for i in invoices if i.created_at >= start_of_month]
    this_month_invoices = len(this_month)
    this_month_revenue = sum(i.total for i in this_month if i.status == InvoiceStatus.PAID)

    return DashboardStats(
        total_invoices=total_invoices,
        paid_invoices=paid_invoices,
        unpaid_invoices=unpaid_invoices,
        overdue_invoices=overdue_invoices,
        total_revenue=total_revenue,
        pending_amount=pending_amount,
        this_month_invoices=this_month_invoices,
        this_month_revenue=this_month_revenue
    )


@router.get("/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Gauti sąskaitą pagal ID"""

    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.items), selectinload(Invoice.company))
        .where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()

    if not invoice:
        raise HTTPException(status_code=404, detail="Sąskaita nerasta")

    await verify_company_access(invoice.company_id, current_user, db)

    return invoice


@router.put("/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: int,
    invoice_data: InvoiceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atnaujinti sąskaitą"""

    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.items), selectinload(Invoice.company))
        .where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()

    if not invoice:
        raise HTTPException(status_code=404, detail="Sąskaita nerasta")

    await verify_company_access(invoice.company_id, current_user, db)

    # Can only edit draft invoices
    if invoice.status not in [InvoiceStatus.DRAFT] and invoice_data.status is None:
        raise HTTPException(
            status_code=400,
            detail="Galima redaguoti tik juodraščius"
        )

    # Update fields
    update_data = invoice_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(invoice, field, value)

    # Update paid_at if marked as paid
    if invoice_data.status == InvoiceStatus.PAID and not invoice.paid_at:
        invoice.paid_at = datetime.utcnow()

    await db.commit()
    await db.refresh(invoice)

    return invoice


@router.delete("/{invoice_id}")
async def delete_invoice(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Ištrinti sąskaitą"""

    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.company))
        .where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()

    if not invoice:
        raise HTTPException(status_code=404, detail="Sąskaita nerasta")

    await verify_company_access(invoice.company_id, current_user, db)

    # Can only delete draft invoices
    if invoice.status != InvoiceStatus.DRAFT:
        raise HTTPException(
            status_code=400,
            detail="Galima ištrinti tik juodraščius. Pažymėkite kaip atšauktą."
        )

    await db.delete(invoice)
    await db.commit()

    return {"message": "Sąskaita ištrinta"}


@router.get("/{invoice_id}/pdf")
async def download_invoice_pdf(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atsisiųsti sąskaitos PDF"""

    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.company))
        .where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()

    if not invoice:
        raise HTTPException(status_code=404, detail="Sąskaita nerasta")

    await verify_company_access(invoice.company_id, current_user, db)

    # Generate PDF if not exists
    if not invoice.pdf_url:
        pdf_path = await generate_invoice_pdf(invoice_id)
    else:
        pdf_path = f"/app/pdfs/{invoice.pdf_url.split('/')[-1]}"

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"{invoice.invoice_number}.pdf"
    )


@router.post("/{invoice_id}/send")
async def send_invoice(
    invoice_id: int,
    email_data: SendInvoiceEmail,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Išsiųsti sąskaitą el. paštu"""

    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.company), selectinload(Invoice.client))
        .where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()

    if not invoice:
        raise HTTPException(status_code=404, detail="Sąskaita nerasta")

    await verify_company_access(invoice.company_id, current_user, db)

    # Get recipient email
    to_email = email_data.to_email or invoice.client.email
    if not to_email:
        raise HTTPException(
            status_code=400,
            detail="Klientas neturi el. pašto adreso"
        )

    # Send email in background
    background_tasks.add_task(
        send_invoice_email,
        invoice_id=invoice.id,
        to_email=to_email,
        message=email_data.message
    )

    # Update invoice status
    if invoice.status == InvoiceStatus.DRAFT:
        invoice.status = InvoiceStatus.SENT
    invoice.sent_at = datetime.utcnow()

    await db.commit()

    return {"message": f"Sąskaita siunčiama į {to_email}"}


@router.post("/{invoice_id}/mark-paid")
async def mark_invoice_paid(
    invoice_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Pažymėti sąskaitą kaip apmokėtą"""

    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.company))
        .where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()

    if not invoice:
        raise HTTPException(status_code=404, detail="Sąskaita nerasta")

    await verify_company_access(invoice.company_id, current_user, db)

    invoice.status = InvoiceStatus.PAID
    invoice.paid_at = datetime.utcnow()
    invoice.paid_amount = invoice.total

    await db.commit()

    return {"message": "Sąskaita pažymėta kaip apmokėta"}
