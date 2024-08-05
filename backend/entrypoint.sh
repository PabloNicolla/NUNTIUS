#!/bin/sh

set -e

# Check if the necessary environment variables are set
if [ -n "$POSTGRES_DB" ] && [ -n "$POSTGRES_USER" ] && [ -n "$POSTGRES_PASSWORD" ] && [ -n "$POSTGRES_HOST" ] && [ -n "$POSTGRES_PORT" ]; then
  echo "Environment variables are set. Running migrations..."
  python manage.py makemigrations
  python manage.py migrate
else
  echo "Environment variables are not set. Skipping migrations..."
fi

# Start Daphne server
exec daphne -b 0.0.0.0 -p 8000 -t 20 core.asgi:application
