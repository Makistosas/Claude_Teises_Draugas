"""
============================================================
SASKAITA.LT - Database Models
============================================================
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from app.database import Base


class SubscriptionPlan(str, enum.Enum):
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    BUSINESS = "business"


class InvoiceStatus(str, enum.Enum):
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


# ============================================================
# USER MODEL
# ============================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)

    # Subscription
    subscription_plan = Column(Enum(SubscriptionPlan), default=SubscriptionPlan.FREE)
    subscription_expires = Column(DateTime, nullable=True)

    # Limits
    invoices_this_month = Column(Integer, default=0)
    invoices_reset_date = Column(DateTime, default=func.now())

    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    companies = relationship("Company", back_populates="owner", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="user", cascade="all, delete-orphan")


# ============================================================
# COMPANY MODEL
# ============================================================

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Company details
    name = Column(String(255), nullable=False)
    code = Column(String(50))  # Įmonės kodas
    vat_code = Column(String(50))  # PVM mokėtojo kodas
    address = Column(String(500))
    city = Column(String(100))
    postal_code = Column(String(20))
    country = Column(String(100), default="Lietuva")

    # Contact
    email = Column(String(255))
    phone = Column(String(50))
    website = Column(String(255))

    # Bank details
    bank_name = Column(String(255))
    bank_account = Column(String(50))  # IBAN
    bank_swift = Column(String(20))

    # Branding
    logo_url = Column(String(500))

    # Invoice settings
    invoice_prefix = Column(String(20), default="SF")
    next_invoice_number = Column(Integer, default=1)

    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    owner = relationship("User", back_populates="companies")
    clients = relationship("Client", back_populates="company", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="company", cascade="all, delete-orphan")


# ============================================================
# CLIENT MODEL
# ============================================================

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    # Client details
    name = Column(String(255), nullable=False)
    code = Column(String(50))  # Įmonės kodas
    vat_code = Column(String(50))  # PVM mokėtojo kodas
    address = Column(String(500))
    city = Column(String(100))
    postal_code = Column(String(20))
    country = Column(String(100), default="Lietuva")

    # Contact
    email = Column(String(255))
    phone = Column(String(50))
    contact_person = Column(String(255))

    # Notes
    notes = Column(Text)

    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    company = relationship("Company", back_populates="clients")
    invoices = relationship("Invoice", back_populates="client")


# ============================================================
# INVOICE MODEL
# ============================================================

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)

    # Invoice details
    invoice_number = Column(String(50), nullable=False)
    issue_date = Column(DateTime, default=func.now())
    due_date = Column(DateTime)
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.DRAFT)

    # Amounts (in cents to avoid floating point issues)
    subtotal = Column(Integer, default=0)  # Be PVM
    vat_rate = Column(Float, default=21.0)  # PVM tarifas %
    vat_amount = Column(Integer, default=0)  # PVM suma
    total = Column(Integer, default=0)  # Galutinė suma

    # Currency
    currency = Column(String(3), default="EUR")

    # Notes
    notes = Column(Text)
    payment_terms = Column(Text)

    # PDF
    pdf_url = Column(String(500))

    # Email tracking
    sent_at = Column(DateTime, nullable=True)
    viewed_at = Column(DateTime, nullable=True)

    # Payment tracking
    paid_at = Column(DateTime, nullable=True)
    paid_amount = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    company = relationship("Company", back_populates="invoices")
    client = relationship("Client", back_populates="invoices")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")


# ============================================================
# INVOICE ITEM MODEL
# ============================================================

class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)

    # Item details
    description = Column(String(500), nullable=False)
    quantity = Column(Float, default=1)
    unit = Column(String(50), default="vnt.")  # vnt., val., kg., m²...
    unit_price = Column(Integer, default=0)  # Vieneto kaina (centais)
    total = Column(Integer, default=0)  # Suma (centais)

    # Order
    position = Column(Integer, default=0)

    # Relationships
    invoice = relationship("Invoice", back_populates="items")


# ============================================================
# PAYMENT MODEL
# ============================================================

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Payment details
    amount = Column(Integer, nullable=False)  # Centais
    currency = Column(String(3), default="EUR")
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)

    # Subscription
    plan = Column(Enum(SubscriptionPlan))
    period_months = Column(Integer, default=1)

    # Paysera
    paysera_order_id = Column(String(100), unique=True)
    paysera_transaction_id = Column(String(100))

    # Timestamps
    created_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="payments")


# ============================================================
# EMAIL LOG MODEL
# ============================================================

class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, index=True)

    # Email details
    to_email = Column(String(255), nullable=False)
    subject = Column(String(500))
    template = Column(String(100))

    # Status
    sent = Column(Boolean, default=False)
    error = Column(Text, nullable=True)

    # Related
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=func.now())
    sent_at = Column(DateTime, nullable=True)
