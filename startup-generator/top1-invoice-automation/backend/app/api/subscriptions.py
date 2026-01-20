"""
============================================================
SASKAITA.LT - Subscriptions API
============================================================
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.database import get_db
from app.models import User, SubscriptionPlan
from app.schemas import SubscriptionInfo, PlanInfo
from app.api.auth import get_current_user
from app.config import settings

router = APIRouter()


PLAN_FEATURES = {
    SubscriptionPlan.FREE: [
        "5 sąskaitos per mėnesį",
        "PDF generavimas",
        "Viena įmonė",
        "El. pašto siuntimas"
    ],
    SubscriptionPlan.STARTER: [
        "50 sąskaitų per mėnesį",
        "PDF generavimas",
        "Neribota įmonių",
        "El. pašto siuntimas",
        "Mokėjimo priminimai",
        "Bazinės ataskaitos"
    ],
    SubscriptionPlan.PRO: [
        "Neribota sąskaitų",
        "PDF generavimas",
        "Neribota įmonių",
        "El. pašto siuntimas",
        "Automatiniai priminimai",
        "Pilnos ataskaitos",
        "API prieiga",
        "Prioritetinis palaikymas"
    ],
    SubscriptionPlan.BUSINESS: [
        "Viskas iš PRO",
        "Multi-user (iki 5 vartotojų)",
        "Rolės ir teisės",
        "Banko integracija",
        "Custom branding",
        "Dedikuotas palaikymas"
    ]
}

PLAN_LIMITS = {
    SubscriptionPlan.FREE: 5,
    SubscriptionPlan.STARTER: 50,
    SubscriptionPlan.PRO: 999999,
    SubscriptionPlan.BUSINESS: 999999
}


@router.get("/current", response_model=SubscriptionInfo)
async def get_current_subscription(
    current_user: User = Depends(get_current_user)
):
    """Gauti dabartinės prenumeratos informaciją"""

    plan = current_user.subscription_plan
    limit = PLAN_LIMITS.get(plan, 5)

    return SubscriptionInfo(
        plan=plan,
        expires=current_user.subscription_expires,
        invoices_used=current_user.invoices_this_month,
        invoices_limit=limit,
        features=PLAN_FEATURES.get(plan, [])
    )


@router.get("/plans", response_model=list[PlanInfo])
async def get_available_plans():
    """Gauti visų planų informaciją"""

    plans = [
        PlanInfo(
            name="Nemokamas",
            code=SubscriptionPlan.FREE,
            price_monthly=0,
            price_yearly=0,
            invoice_limit=5,
            features=PLAN_FEATURES[SubscriptionPlan.FREE]
        ),
        PlanInfo(
            name="Starter",
            code=SubscriptionPlan.STARTER,
            price_monthly=settings.price_starter,
            price_yearly=settings.price_starter * 10,  # 2 mėn. nemokamai
            invoice_limit=50,
            features=PLAN_FEATURES[SubscriptionPlan.STARTER]
        ),
        PlanInfo(
            name="Pro",
            code=SubscriptionPlan.PRO,
            price_monthly=settings.price_pro,
            price_yearly=settings.price_pro * 10,
            invoice_limit=999999,
            features=PLAN_FEATURES[SubscriptionPlan.PRO]
        ),
        PlanInfo(
            name="Business",
            code=SubscriptionPlan.BUSINESS,
            price_monthly=settings.price_business,
            price_yearly=settings.price_business * 10,
            invoice_limit=999999,
            features=PLAN_FEATURES[SubscriptionPlan.BUSINESS]
        )
    ]

    return plans


@router.post("/cancel")
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atšaukti prenumeratą (pasibaigus laikui grįš į FREE)"""

    if current_user.subscription_plan == SubscriptionPlan.FREE:
        return {"message": "Neturite aktyvios prenumeratos"}

    # Don't immediately downgrade - let it expire
    # User keeps access until subscription_expires

    return {
        "message": "Prenumerata atšaukta. Prieiga išliks iki " +
                   current_user.subscription_expires.strftime("%Y-%m-%d") if current_user.subscription_expires else "šiandien"
    }
