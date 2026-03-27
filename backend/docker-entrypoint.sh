#!/bin/bash
set -e

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Create superuser if not exists
echo "Creating superuser if not exists..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='ddgolf24@ddgolf.kr').exists():
    admin = User.objects.create_superuser(
        email='ddgolf24@ddgolf.kr',
        username='관리자',
        password='dodan1004~'
    )
    admin.role = 'admin'
    admin.is_approved = True
    admin.is_email_verified = True
    admin.save()
    print('Admin user created')
else:
    print('Admin user already exists')
"

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start server
echo "Starting server..."
exec daphne -b 0.0.0.0 -p 8000 config.asgi:application
