# Stage 1: Build stage
FROM python:3.10-slim-bullseye AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libc6-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt




# Stage 2: Runtime stage
FROM python:3.10-slim-bullseye

RUN useradd -m myuser

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=core.settings

# Add environment variables
ENV DEBUG=${DEBUG:-False}
ENV SECRET_KEY=${SECRET_KEY}

# Postgres
ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_HOST=${POSTGRES_HOST}
ENV POSTGRES_PORT=${POSTGRES_PORT}

# Redis
ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_PORT=${REDIS_PORT}
ENV REDIS_PASSWORD=${REDIS_PASSWORD}

# Others
ENV ALLOWED_HOSTS=${ALLOWED_HOSTS}
ENV CSRF_TRUSTED_ORIGINS=${CSRF_TRUSTED_ORIGINS}
ENV CORS_ALLOW_ALL_ORIGINS=${CORS_ALLOW_ALL_ORIGINS}
ENV ACCOUNT_EMAIL_VERIFICATION=${ACCOUNT_EMAIL_VERIFICATION}
ENV EMAIL_BACKEND=${EMAIL_BACKEND}

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/wheels /wheels

RUN pip install --no-cache /wheels/*

COPY . .

RUN chown -R myuser:myuser /app

USER myuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health/ || exit 1

# RUN python manage.py makemigrations
# RUN python manage.py migrate

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "core.asgi:application"]