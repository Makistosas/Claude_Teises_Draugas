"""
============================================================
SASKAITA.LT - Clients API
============================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import User, Company, Client
from app.schemas import ClientCreate, ClientUpdate, ClientResponse
from app.api.auth import get_current_user

router = APIRouter()


async def verify_company_access(
    company_id: int,
    current_user: User,
    db: AsyncSession
) -> Company:
    """Patikrinti ar vartotojas turi prieigą prie įmonės"""
    result = await db.execute(
        select(Company).where(
            Company.id == company_id,
            Company.user_id == current_user.id
        )
    )
    company = result.scalar_one_or_none()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Įmonė nerasta arba neturite prieigos"
        )

    return company


@router.post("/", response_model=ClientResponse)
async def create_client(
    client_data: ClientCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Sukurti naują klientą"""

    # Verify company access
    await verify_company_access(client_data.company_id, current_user, db)

    client = Client(**client_data.model_dump())

    db.add(client)
    await db.commit()
    await db.refresh(client)

    return client


@router.get("/", response_model=list[ClientResponse])
async def list_clients(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Gauti visus įmonės klientus"""

    # Verify company access
    await verify_company_access(company_id, current_user, db)

    result = await db.execute(
        select(Client).where(Client.company_id == company_id)
    )
    return result.scalars().all()


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Gauti klientą pagal ID"""
    result = await db.execute(
        select(Client)
        .options(selectinload(Client.company))
        .where(Client.id == client_id)
    )
    client = result.scalar_one_or_none()

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Klientas nerastas"
        )

    # Verify company access
    await verify_company_access(client.company_id, current_user, db)

    return client


@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: int,
    client_data: ClientUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atnaujinti kliento informaciją"""
    result = await db.execute(
        select(Client)
        .options(selectinload(Client.company))
        .where(Client.id == client_id)
    )
    client = result.scalar_one_or_none()

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Klientas nerastas"
        )

    # Verify company access
    await verify_company_access(client.company_id, current_user, db)

    # Update fields
    update_data = client_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)

    await db.commit()
    await db.refresh(client)

    return client


@router.delete("/{client_id}")
async def delete_client(
    client_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Ištrinti klientą"""
    result = await db.execute(
        select(Client)
        .options(selectinload(Client.company))
        .where(Client.id == client_id)
    )
    client = result.scalar_one_or_none()

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Klientas nerastas"
        )

    # Verify company access
    await verify_company_access(client.company_id, current_user, db)

    await db.delete(client)
    await db.commit()

    return {"message": "Klientas ištrintas"}
