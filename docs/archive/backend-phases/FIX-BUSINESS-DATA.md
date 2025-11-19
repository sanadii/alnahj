# Fix Business Data in Profile API

## Problem
The `/api/account/profile/` endpoint is returning old business/location data that no longer exists in the models.

## Root Cause
The SQLite database file (`db.sqlite3`) contains old schema from before we removed business fields. The database needs to be recreated with the clean schema.

## Solution

### Step 1: Stop Django Server
```powershell
# Press Ctrl+C in the terminal running the Django server
# Or close the terminal window
```

### Step 2: Delete Old Database
```powershell
cd D:\React\election\backend
Remove-Item db.sqlite3 -Force
```

### Step 3: Recreate Database
```powershell
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
# Email: your-email@example.com
# Password: your-password

# Create demo election data
python manage.py create_demo_election
```

### Step 4: Start Server
```powershell
python manage.py runserver
```

### Step 5: Clear Frontend Cache
```javascript
// In browser console (F12)
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Alternative: Migration to Remove Business Fields

If you want to keep existing data, create a migration to remove business fields:

```powershell
cd D:\React\election\backend
.\venv\Scripts\Activate.ps1

# Create migration to remove business fields
python manage.py makemigrations account --empty --name remove_business_fields
```

Then edit the migration file to drop the columns:

```python
# In the new migration file:
from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('account', 'PREVIOUS_MIGRATION'),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE account_customuser DROP COLUMN IF EXISTS primary_business_id;",
            reverse_sql="",
        ),
        migrations.RunSQL(
            sql="ALTER TABLE account_customuser DROP COLUMN IF EXISTS primary_location_id;",
            reverse_sql="",
        ),
        # Add more DROP COLUMN statements for other business fields
    ]
```

## Verification

After recreating the database, test the profile endpoint:

```bash
# Should NOT contain business/location fields
curl http://127.0.0.1:8000/api/users/me/ -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response (no business fields):
```json
{
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "phone": "+96512345678",
    "role": "admin",
    "role_display": "Admin",
    "supervisor": null,
    "supervisor_name": null,
    "teams": [],
    "committees": [],
    "is_active": true,
    "date_joined": "2025-10-24T...",
    "last_login": "2025-10-24T...",
    "supervised_users_count": 0
}
```

## Note
The endpoint `/api/account/profile/` you showed doesn't exist in our current URL configuration. The correct endpoints are:
- `/api/users/me/` - Current user profile  
- `/api/auth/login/` - Login
- `/api/auth/logout/` - Logout

Make sure your frontend is using the correct endpoints!

