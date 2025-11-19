# Backend Setup Instructions - Phase 1 Complete ✅

## What Has Been Created

Phase 1 (Foundation & User Authentication) is now complete with the following:

### ✅ Project Structure
- Django project configured with proper settings
- All app directories created (account, election, electors, guarantees, voting, reports, utils)
- Environment configuration ready

### ✅ User Management & Authentication
- **CustomUser Model** with 4 roles (Super Admin, Admin, Supervisor, User)
- **JWT Authentication** setup (access + refresh tokens)
- **Complete User API** with all CRUD operations
- **Permission System** (5 custom permission classes)
- **Password Management** (change password, validation)
- **Supervisor Hierarchy** (users can be assigned to supervisors)
- **Team & Committee Assignment** (for organizing users)

### ✅ Files Created (30+ files)
1. **Core Configuration**
   - `core/settings.py` - Complete Django configuration
   - `core/urls.py` - URL routing
   - `core/wsgi.py` & `core/asgi.py` - Server configuration

2. **Account App** (User Management)
   - `models.py` - CustomUser model (500+ lines)
   - `serializers.py` - 8 serializers for all operations
   - `views.py` - Complete ViewSet with authentication
   - `urls.py` - Authentication routes
   - `urls_users.py` - User management routes
   - `admin.py` - Django admin configuration
   - `tests.py` - Initial test suite

3. **Utils App** (Shared)
   - `permissions.py` - 5 custom permission classes
   - `exceptions.py` - Standardized error responses

4. **Configuration Files**
   - `requirements.txt` - All dependencies
   - `.env.example` - Environment variables template
   - `.gitignore` - Git ignore rules
   - `pytest.ini` - Test configuration
   - `README.md` - Setup & usage documentation

5. **Stub Apps** (Ready for Phase 2-6)
   - election, electors, guarantees, voting, reports

---

## 🚀 Setup Steps

### 1. Create & Activate Virtual Environment

```bash
# Windows PowerShell:
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1

# Or Linux/Mac:
python -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note**: This will install Django, DRF, PostgreSQL driver, JWT, and all other dependencies.

### 3. Configure Environment

```bash
# Copy the example env file
copy .env.example .env   # Windows
# or
cp .env.example .env     # Linux/Mac
```

**Edit `.env` file** and set at minimum:
```env
SECRET_KEY=<generated-key-from-terminal-output>
DB_NAME=election_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

**Generate a secure SECRET_KEY**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### 4. Create PostgreSQL Database

```bash
# Option A: Using psql
psql -U postgres
CREATE DATABASE election_db;
\q

# Option B: Using createdb command
createdb election_db
```

### 5. Run Migrations

```bash
python manage.py migrate
```

This will create all database tables including the users table.

### 6. Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin account:
- Email: admin@example.com
- Password: (choose a secure password)
- First name: Admin
- Last name: User

### 7. Start Development Server

```bash
python manage.py runserver
```

Server will start at: **http://localhost:8000**

---

## 🧪 Test the Setup

### 1. Django Admin
Navigate to: **http://localhost:8000/admin**
- Login with superuser credentials
- Verify you can see "Users" in the admin panel

### 2. API Testing

**A. Login (Get JWT Token)**
```bash
POST http://localhost:8000/api/auth/login/
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "your_password"
}
```

Response will include:
```json
{
    "access": "eyJ0eXAiOiJKV1Q...",
    "refresh": "eyJ0eXAiOiJKV1Q...",
    "user": {
        "id": 1,
        "email": "admin@example.com",
        "full_name": "Admin User",
        "role": "SUPER_ADMIN"
    }
}
```

**B. Get Current User Profile**
```bash
GET http://localhost:8000/api/users/me/
Authorization: Bearer <access_token>
```

**C. List All Users (Admin only)**
```bash
GET http://localhost:8000/api/users/
Authorization: Bearer <access_token>
```

### 3. Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=apps --cov-report=html

# Run only account app tests
pytest apps/account/tests.py
```

---

## 📚 Available API Endpoints

### Authentication
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/auth/logout/` - Logout (blacklist refresh token)
- `POST /api/auth/refresh/` - Refresh access token

### User Management
- `GET /api/users/` - List all users (admin only)
- `POST /api/users/` - Create new user (admin only)
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user (admin only)
- `GET /api/users/me/` - Get current user profile
- `GET /api/users/supervised/` - Get supervised users (supervisor+)
- `PATCH /api/users/{id}/assign-supervisor/` - Assign supervisor (admin only)
- `PATCH /api/users/{id}/assign-teams/` - Assign teams (admin only)
- `PATCH /api/users/{id}/assign-committees/` - Assign committees (admin only)
- `POST /api/users/change-password/` - Change password

### Admin Panel
- `GET /admin/` - Django admin interface

---

## 🎯 What's Working Now

### ✅ User Roles
- **SUPER_ADMIN**: Full system access
- **ADMIN**: Operational management
- **SUPERVISOR**: Can supervise other users
- **USER**: Regular user (guarantee collector)

### ✅ Features
- JWT-based authentication (1 hour access, 7 days refresh)
- Role-based permissions
- Supervisor hierarchy (users can be assigned to supervisors)
- Team assignments (users can belong to multiple teams)
- Committee assignments (for voting day)
- Password change with validation
- Full CRUD operations on users (admin only)
- Personal profile access for all users

### ✅ Security
- Password hashing (Django default)
- JWT token blacklisting on logout
- Permission-based access control
- Role-based endpoint restrictions

---

## 🔧 Common Issues & Solutions

### Issue: Module not found
**Solution**: Ensure virtual environment is activated
```bash
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Linux/Mac
```

### Issue: Database connection error
**Solution**: 
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists: `psql -U postgres -l`

### Issue: ImportError for django_redis
**Solution**: Install missing package
```bash
pip install django-redis
```

### Issue: Migration errors
**Solution**: Reset migrations (development only)
```bash
python manage.py migrate --fake account zero
python manage.py migrate account
```

---

## 📋 Next Steps (Phase 2)

Now that Phase 1 is complete, you can:

1. **Test the authentication system** thoroughly
2. **Create additional users** with different roles
3. **Move to Phase 2**: Election & Elector Management
   - Create Election and Committee models
   - Implement Elector database with CSV import
   - Build advanced search functionality

---

## 🎓 Quick Reference

### User Roles Permissions
| Feature | Super Admin | Admin | Supervisor | User |
|---------|-------------|-------|------------|------|
| Create Users | ✅ | ✅ | ❌ | ❌ |
| View All Users | ✅ | ✅ | 👥 Team | ❌ Self |
| Assign Roles | ✅ | ✅ | ❌ | ❌ |
| Assign Supervisors | ✅ | ✅ | ❌ | ❌ |
| View Supervised Users | ✅ | ✅ | ✅ | ❌ |
| Change Own Password | ✅ | ✅ | ✅ | ✅ |

### Development Commands
```bash
# Start server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
pytest

# Django shell
python manage.py shell
```

---

## ✅ Phase 1 Checklist

- [x] Django project setup
- [x] PostgreSQL configuration
- [x] Custom user model
- [x] JWT authentication
- [x] User CRUD operations
- [x] Permission system
- [x] Admin panel configuration
- [x] Test suite
- [x] Documentation
- [x] Requirements file
- [x] Environment configuration

**Phase 1 Status**: ✅ **COMPLETE**

**Ready for Phase 2**: Election & Elector Management

---

For detailed implementation plan, see: `docs/project/backend-implementation-plan.md`

