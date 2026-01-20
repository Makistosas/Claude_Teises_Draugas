"""
============================================================
SASKAITA.LT - API Tests
============================================================
Testavimo scenarijai sistemai patikrinti
============================================================
"""

import pytest
from httpx import AsyncClient
from app.main import app


@pytest.fixture
def anyio_backend():
    return 'asyncio'


@pytest.mark.anyio
async def test_health_check():
    """Test 1: Sveikatos patikrinimas"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.anyio
async def test_root_endpoint():
    """Test 2: Šakninis endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api")
    assert response.status_code == 200
    assert "Saskaita.lt" in response.json()["message"]


@pytest.mark.anyio
async def test_register_user():
    """Test 3: Vartotojo registracija"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/auth/register", json={
            "email": "test@test.lt",
            "password": "testpassword123",
            "full_name": "Test User"
        })
    # May fail if user exists, that's ok
    assert response.status_code in [200, 400]


@pytest.mark.anyio
async def test_login_invalid_credentials():
    """Test 4: Prisijungimas su neteisingais duomenimis"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/auth/login", data={
            "username": "nonexistent@test.lt",
            "password": "wrongpassword"
        })
    assert response.status_code == 401


@pytest.mark.anyio
async def test_protected_endpoint_without_token():
    """Test 5: Apsaugotas endpoint be tokeno"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/users/me")
    assert response.status_code == 401


@pytest.mark.anyio
async def test_companies_without_auth():
    """Test 6: Įmonių sąrašas be autentifikacijos"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/companies")
    assert response.status_code == 401


@pytest.mark.anyio
async def test_invoices_without_auth():
    """Test 7: Sąskaitų sąrašas be autentifikacijos"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/invoices?company_id=1")
    assert response.status_code == 401


@pytest.mark.anyio
async def test_subscriptions_plans():
    """Test 8: Prenumeratos planai (public)"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/subscriptions/plans")
    assert response.status_code == 200
    plans = response.json()
    assert len(plans) == 4  # free, starter, pro, business


@pytest.mark.anyio
async def test_register_short_password():
    """Test 9: Registracija su per trumpu slaptažodžiu"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/auth/register", json={
            "email": "short@test.lt",
            "password": "short",
            "full_name": "Short Pass"
        })
    assert response.status_code == 422  # Validation error


@pytest.mark.anyio
async def test_register_invalid_email():
    """Test 10: Registracija su netinkamu el. paštu"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/auth/register", json={
            "email": "notanemail",
            "password": "validpassword123",
            "full_name": "Invalid Email"
        })
    assert response.status_code == 422  # Validation error


# ============================================================
# PAPILDOMI TESTAI (INTEGRACINIAI)
# ============================================================
# Šie testai reikalauja veikiančios duomenų bazės

"""
Rankiniai testavimo scenarijai:

1. Registracija -> Tikėtina: Patvirtinimo laiškas
2. Prisijungimas -> Tikėtina: JWT token
3. Įmonės kūrimas -> Tikėtina: Įmonė sukurta su ID
4. Kliento pridėjimas -> Tikėtina: Klientas matomas sąraše
5. Sąskaitos kūrimas su 2 eilutėmis -> Tikėtina: PVM paskaičiuotas teisingai
6. PDF generavimas -> Tikėtina: Profesionalus PDF failas
7. Siuntimas el. paštu -> Tikėtina: Klientas gauna laišką
8. Pažymėjimas apmokėta -> Tikėtina: Statusas pasikeičia
9. Prenumeratos pirkimas -> Tikėtina: Paysera mokėjimas veikia
10. Ataskaita -> Tikėtina: PDF su visomis sąskaitomis
"""
