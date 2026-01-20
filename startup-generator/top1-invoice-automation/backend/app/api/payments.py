"""
============================================================
SASKAITA.LT - Payments API (Paysera Integration)
============================================================
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
import hashlib
import base64
import urllib.parse
import uuid

from app.database import get_db
from app.models import User, Payment, PaymentStatus, SubscriptionPlan
from app.schemas import PaymentCreate, PaymentResponse, PayseraCheckout
from app.api.auth import get_current_user
from app.config import settings

router = APIRouter()


def get_plan_price(plan: SubscriptionPlan, months: int = 1) -> int:
    """Get price for subscription plan in cents"""
    prices = {
        SubscriptionPlan.STARTER: settings.price_starter,
        SubscriptionPlan.PRO: settings.price_pro,
        SubscriptionPlan.BUSINESS: settings.price_business
    }

    base_price = prices.get(plan, 0)

    # Yearly discount (2 months free)
    if months == 12:
        return base_price * 10

    return base_price * months


def create_paysera_request(payment: Payment, user: User) -> str:
    """Create Paysera payment request URL"""

    # Paysera parameters
    data = {
        "projectid": settings.paysera_project_id,
        "orderid": payment.paysera_order_id,
        "accepturl": f"https://{settings.domain}/payment/success",
        "cancelurl": f"https://{settings.domain}/payment/cancel",
        "callbackurl": f"https://{settings.domain}/api/payments/callback",
        "amount": payment.amount,
        "currency": "EUR",
        "country": "LT",
        "test": "1" if settings.paysera_test_mode else "0",
        "p_email": user.email,
        "lang": "LIT"
    }

    # Encode data
    data_str = urllib.parse.urlencode(data)
    data_encoded = base64.b64encode(data_str.encode()).decode()

    # Create sign
    sign_str = data_encoded + settings.paysera_sign_password
    sign = hashlib.md5(sign_str.encode()).hexdigest()

    # Build URL
    if settings.paysera_test_mode:
        base_url = "https://sandbox.paysera.com/pay/"
    else:
        base_url = "https://www.paysera.lt/pay/"

    return f"{base_url}?data={data_encoded}&sign={sign}"


def verify_paysera_callback(data: str, ss1: str, ss2: str) -> bool:
    """Verify Paysera callback signature"""

    # Verify ss1
    sign_str = data + settings.paysera_sign_password
    expected_ss1 = hashlib.md5(sign_str.encode()).hexdigest()

    return ss1 == expected_ss1


@router.post("/checkout", response_model=PayseraCheckout)
async def create_checkout(
    payment_data: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Sukurti mokėjimo sesiją"""

    if payment_data.plan == SubscriptionPlan.FREE:
        raise HTTPException(
            status_code=400,
            detail="Negalima pirkti nemokamo plano"
        )

    # Calculate amount
    amount = get_plan_price(payment_data.plan, payment_data.period_months)

    # Create payment record
    order_id = f"SASK-{uuid.uuid4().hex[:8].upper()}"

    payment = Payment(
        user_id=current_user.id,
        amount=amount,
        currency="EUR",
        status=PaymentStatus.PENDING,
        plan=payment_data.plan,
        period_months=payment_data.period_months,
        paysera_order_id=order_id
    )

    db.add(payment)
    await db.commit()
    await db.refresh(payment)

    # Create Paysera URL
    payment_url = create_paysera_request(payment, current_user)

    return PayseraCheckout(
        payment_url=payment_url,
        order_id=order_id
    )


@router.post("/callback")
async def paysera_callback(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Paysera callback handler"""

    # Get parameters
    form = await request.form()
    data = form.get("data", "")
    ss1 = form.get("ss1", "")
    ss2 = form.get("ss2", "")

    # Verify signature
    if not verify_paysera_callback(data, ss1, ss2):
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Decode data
    try:
        decoded = base64.b64decode(data).decode()
        params = dict(urllib.parse.parse_qsl(decoded))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid data")

    order_id = params.get("orderid")
    status = params.get("status")

    # Find payment
    result = await db.execute(
        select(Payment).where(Payment.paysera_order_id == order_id)
    )
    payment = result.scalar_one_or_none()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    # Update payment status
    if status == "1":  # Successful
        payment.status = PaymentStatus.COMPLETED
        payment.completed_at = datetime.utcnow()
        payment.paysera_transaction_id = params.get("requestid")

        # Update user subscription
        result = await db.execute(
            select(User).where(User.id == payment.user_id)
        )
        user = result.scalar_one()

        user.subscription_plan = payment.plan

        # Set expiration
        if user.subscription_expires and user.subscription_expires > datetime.utcnow():
            # Extend existing subscription
            user.subscription_expires += timedelta(days=30 * payment.period_months)
        else:
            user.subscription_expires = datetime.utcnow() + timedelta(days=30 * payment.period_months)

        await db.commit()

    elif status == "0":  # Pending - do nothing
        pass
    else:  # Failed
        payment.status = PaymentStatus.FAILED
        await db.commit()

    return "OK"


@router.get("/history", response_model=list[PaymentResponse])
async def get_payment_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Gauti mokėjimų istoriją"""

    result = await db.execute(
        select(Payment)
        .where(Payment.user_id == current_user.id)
        .order_by(Payment.created_at.desc())
    )

    return result.scalars().all()


@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Gauti mokėjimo informaciją"""

    result = await db.execute(
        select(Payment).where(
            Payment.id == payment_id,
            Payment.user_id == current_user.id
        )
    )
    payment = result.scalar_one_or_none()

    if not payment:
        raise HTTPException(status_code=404, detail="Mokėjimas nerastas")

    return payment
