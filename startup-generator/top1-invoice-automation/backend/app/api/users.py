"""
============================================================
SASKAITA.LT - Users API
============================================================
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import User
from app.schemas import UserResponse, UserUpdate
from app.api.auth import get_current_user, get_current_admin

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Gauti dabartinio vartotojo informaciją"""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atnaujinti dabartinio vartotojo informaciją"""

    if user_data.full_name is not None:
        current_user.full_name = user_data.full_name

    if user_data.email is not None:
        # Check if email is taken
        result = await db.execute(
            select(User).where(User.email == user_data.email, User.id != current_user.id)
        )
        if result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El. paštas jau užimtas"
            )
        current_user.email = user_data.email

    await db.commit()
    await db.refresh(current_user)

    return current_user


@router.delete("/me")
async def delete_current_user(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Ištrinti savo paskyrą"""
    await db.delete(current_user)
    await db.commit()
    return {"message": "Paskyra ištrinta"}


# ============================================================
# ADMIN ENDPOINTS
# ============================================================

@router.get("/", response_model=list[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Gauti visų vartotojų sąrašą (tik admin)"""
    result = await db.execute(select(User).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Gauti vartotoją pagal ID (tik admin)"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vartotojas nerastas"
        )

    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Ištrinti vartotoją (tik admin)"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vartotojas nerastas"
        )

    await db.delete(user)
    await db.commit()

    return {"message": "Vartotojas ištrintas"}
