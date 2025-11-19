# Backend Quick Start Guide

**Virtual Environment Location**: `backend/venv/`  
**Django Version**: 4.2.7  
**Status**: ✅ Ready to Use

---

## ⚡ Quick Commands

### Activate Virtual Environment
```bash
# Always run this first when working on the backend
.\venv\Scripts\Activate.ps1
```

### Start Django Server
```bash
# Method 1: Using startup script
.\start-server.ps1

# Method 2: Manual start
python manage.py runserver
```

### Common Django Commands
```bash
# Check for issues
python manage.py check

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Django shell
python manage.py shell

# Collect static files
python manage.py collectstatic
```

---

## 🌐 Access Points

Once the server is running:

- **API Root**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Endpoints**: http://localhost:8000/api/

---

## 📦 Installed Packages

### Core Django Stack
- Django 4.2.7
- Django REST Framework 3.14.0
- SimpleJWT 5.3.0 (JWT Authentication)
- Django CORS Headers 4.3.0
- Django Filter 23.3
- Whitenoise 6.11.0 (Static files)
- Setuptools 80.9.0

### Development Tools
- IPython 8.17.2 (Enhanced Python shell)
- Django Debug Toolbar 4.2.0

### Testing
- pytest 7.4.3
- pytest-django 4.7.0

---

## 🚀 First Time Setup

### 1. Activate Virtual Environment
```bash
.\venv\Scripts\Activate.ps1
```

You should see `(venv)` in your terminal prompt.

### 2. Run Migrations (if needed)
```bash
python manage.py migrate
```

### 3. Create Superuser
```bash
python manage.py createsuperuser
```

Follow the prompts to:
- Enter email address
- Enter password
- Confirm password

### 4. Start the Server
```bash
python manage.py runserver
```

Or use the startup script:
```bash
.\start-server.ps1
```

### 5. Access Admin Panel
- Open browser: http://localhost:8000/admin
- Login with your superuser credentials

---

## 📁 Project Structure

```
backend/
├── venv/                   # Virtual environment ✅
├── apps/
│   ├── account/           # User authentication
│   ├── election/          # Election management
│   ├── electors/          # Elector management
│   ├── guarantees/        # Guarantee system
│   ├── attendance/        # Attendance tracking
│   ├── voting/            # Voting system
│   ├── reports/           # Reports & analytics
│   └── utils/             # Shared utilities
├── core/
│   ├── settings.py       # Django settings
│   ├── urls.py           # URL configuration
│   └── wsgi.py           # WSGI application
├── db.sqlite3            # SQLite database
├── manage.py             # Django management
├── requirements-minimal.txt  # Dependencies
└── start-server.ps1      # Startup script
```

---

## 🔧 Configuration

### Database
- **Type**: SQLite (file-based)
- **Location**: `backend/db.sqlite3`
- **No server required**: ✅

### Cache
- **Type**: In-memory
- **No Redis required**: ✅

### Static Files
- **Handler**: Whitenoise
- **No web server required**: ✅

---

## 🎓 Tips

### Always Activate venv
Before running any Python/Django command:
```bash
.\venv\Scripts\Activate.ps1
```

### Check if venv is Active
Your terminal should show `(venv)` in the prompt:
```
(venv) PS D:\React\election\backend>
```

### Deactivate When Done
```bash
deactivate
```

### Update pip (Optional)
```bash
python -m pip install --upgrade pip
```

### Install Additional Packages
```bash
pip install package-name
```

### List Installed Packages
```bash
pip list
```

### Export Requirements
```bash
pip freeze > requirements-current.txt
```

---

## 🐛 Troubleshooting

### Issue: "Python was not found"
**Solution**: Activate the virtual environment first
```bash
.\venv\Scripts\Activate.ps1
```

### Issue: "Module not found"
**Solution**: Make sure venv is activated and packages are installed
```bash
.\venv\Scripts\Activate.ps1
pip install -r requirements-minimal.txt
```

### Issue: "Port 8000 already in use"
**Solution**: Use a different port
```bash
python manage.py runserver 8080
```

### Issue: "Database is locked"
**Solution**: Close all other Django processes and restart

### Issue: Migration errors
**Solution**: Check migrations and reapply
```bash
python manage.py showmigrations
python manage.py migrate
```

---

## 📖 API Testing

### Using Browser
- Visit: http://localhost:8000/api/
- Django REST Framework provides a browsable API interface

### Using curl
```bash
# Login example
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Using Postman
1. Import API endpoints
2. Set Authorization header with JWT token
3. Test endpoints

---

## 🎯 Next Steps

1. ✅ **Virtual environment created and activated**
2. ✅ **All packages installed**
3. ✅ **Django verified working**
4. ⏳ **Create superuser** (if not done)
5. ⏳ **Start development server**
6. ⏳ **Test API endpoints**
7. ⏳ **Integrate with frontend**

---

## 📝 Quick Reference

### Workflow
```bash
# 1. Activate venv
.\venv\Scripts\Activate.ps1

# 2. Start server
python manage.py runserver

# 3. In another terminal (keep server running)
.\venv\Scripts\Activate.ps1

# 4. Create superuser (first time only)
python manage.py createsuperuser

# 5. Access admin
# http://localhost:8000/admin
```

---

**Your Django backend is ready! 🚀**

For detailed documentation, see **[SETUP-COMPLETE.md](../SETUP-COMPLETE.md)**

