#!/bin/sh
set -e

echo "Making migrations..."
python manage.py makemigrations --noinput

echo "Running migrations..."
python manage.py migrate --noinput

echo "Seeding fields..."
python manage.py seed_fields

echo "Starting server..."
python manage.py runserver 0.0.0.0:8000