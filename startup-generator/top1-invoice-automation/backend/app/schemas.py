"""
============================================================
SASKAITA.LT - Pydantic Schemas
============================================================
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from app.models import SubscriptionPlan, InvoiceStatus, PaymentStatus


# ============================================================
# AUTH SCHEMAS
# ============================================================

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: Optional[str] = None


# ============================================================
# USER SCHEMAS
# ============================================================

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    subscription_plan: SubscriptionPlan
    subscription_expires: Optional[datetime]
    invoices_this_month: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# COMPANY SCHEMAS
# ============================================================

class CompanyBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    code: Optional[str] = None
    vat_code: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "Lietuva"
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    bank_swift: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    vat_code: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    bank_swift: Optional[str] = None
    invoice_prefix: Optional[str] = None


class CompanyResponse(CompanyBase):
    id: int
    user_id: int
    logo_url: Optional[str]
    invoice_prefix: str
    next_invoice_number: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# CLIENT SCHEMAS
# ============================================================

class ClientBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    code: Optional[str] = None
    vat_code: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "Lietuva"
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    contact_person: Optional[str] = None
    notes: Optional[str] = None


class ClientCreate(ClientBase):
    company_id: int


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    vat_code: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    contact_person: Optional[str] = None
    notes: Optional[str] = None


class ClientResponse(ClientBase):
    id: int
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# INVOICE ITEM SCHEMAS
# ============================================================

class InvoiceItemBase(BaseModel):
    description: str = Field(min_length=1, max_length=500)
    quantity: float = 1.0
    unit: str = "vnt."
    unit_price: int  # Centais


class InvoiceItemCreate(InvoiceItemBase):
    pass


class InvoiceItemResponse(InvoiceItemBase):
    id: int
    total: int
    position: int

    class Config:
        from_attributes = True


# ============================================================
# INVOICE SCHEMAS
# ============================================================

class InvoiceBase(BaseModel):
    client_id: int
    issue_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    vat_rate: float = 21.0
    notes: Optional[str] = None
    payment_terms: Optional[str] = None


class InvoiceCreate(InvoiceBase):
    company_id: int
    items: List[InvoiceItemCreate]


class InvoiceUpdate(BaseModel):
    client_id: Optional[int] = None
    issue_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    vat_rate: Optional[float] = None
    notes: Optional[str] = None
    payment_terms: Optional[str] = None
    status: Optional[InvoiceStatus] = None


class InvoiceResponse(InvoiceBase):
    id: int
    company_id: int
    invoice_number: str
    status: InvoiceStatus
    subtotal: int
    vat_amount: int
    total: int
    currency: str
    pdf_url: Optional[str]
    sent_at: Optional[datetime]
    paid_at: Optional[datetime]
    created_at: datetime
    items: List[InvoiceItemResponse]

    class Config:
        from_attributes = True


class InvoiceSummary(BaseModel):
    id: int
    invoice_number: str
    client_name: str
    total: int
    status: InvoiceStatus
    issue_date: datetime
    due_date: Optional[datetime]


# ============================================================
# PAYMENT SCHEMAS
# ============================================================

class PaymentCreate(BaseModel):
    plan: SubscriptionPlan
    period_months: int = 1


class PaymentResponse(BaseModel):
    id: int
    amount: int
    currency: str
    status: PaymentStatus
    plan: SubscriptionPlan
    paysera_order_id: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class PayseraCheckout(BaseModel):
    payment_url: str
    order_id: str


# ============================================================
# SUBSCRIPTION SCHEMAS
# ============================================================

class SubscriptionInfo(BaseModel):
    plan: SubscriptionPlan
    expires: Optional[datetime]
    invoices_used: int
    invoices_limit: int
    features: List[str]


class PlanInfo(BaseModel):
    name: str
    code: SubscriptionPlan
    price_monthly: int  # Centais
    price_yearly: int  # Centais
    invoice_limit: int
    features: List[str]


# ============================================================
# STATISTICS SCHEMAS
# ============================================================

class DashboardStats(BaseModel):
    total_invoices: int
    paid_invoices: int
    unpaid_invoices: int
    overdue_invoices: int
    total_revenue: int
    pending_amount: int
    this_month_invoices: int
    this_month_revenue: int


# ============================================================
# EMAIL SCHEMAS
# ============================================================

class SendInvoiceEmail(BaseModel):
    invoice_id: int
    to_email: Optional[EmailStr] = None  # Jei None, naudoja kliento email
    message: Optional[str] = None
