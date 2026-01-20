# ============================================================
# SASKAITA.LT - Backend Dockerfile
# ============================================================

FROM python:3.11-slim

# Aplinkos kintamieji
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Darbo katalogas
WORKDIR /app

# Sistemos priklausomybės
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

# Python priklausomybės
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopijuoti kodą
COPY . .

# Ports
EXPOSE 8000

# Paleisti
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
