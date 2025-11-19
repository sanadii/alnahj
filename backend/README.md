# Election Management System - Backend

Django REST Framework backend for Kuwait Oil Company election management system.

---

## 📖 Documentation Hub

**👉 For complete documentation, code standards, and architecture details:**  
**Go to [`docs/README.md`](./docs/README.md)** - Your comprehensive documentation hub

**This README**: Quick start, setup, and deployment guide  
**docs/README**: Standards, patterns, architecture, and detailed guides

---

## 📚 Quick Links to Key Documentation

- 📘 **[Backend Standardization Guide](./docs/BACKEND-STANDARDIZATION-GUIDE.md)** - Code standards (START HERE for development)
- 🔍 **[Standardization Audit Report](./docs/STANDARDIZATION-AUDIT-REPORT.md)** - 10/10 compliance score
- 🏗️ **[App Structure](./docs/APP-STRUCTURE.md)** - Architecture overview

**Status:** ✅ Fully standardized (Score: 10/10) | See [`docs/README.md`](./docs/README.md) for all documentation

---

## Tech Stack

- **Python**: 3.11+
- **Framework**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL 15+
- **Authentication**: JWT (Simple JWT)
- **Caching**: Redis
- **Task Queue**: Celery

## Quick Start

### 1. Setup Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# At minimum, set:
# - SECRET_KEY (generate a secure key)
# - DB_NAME, DB_USER, DB_PASSWORD
```

### 3. Setup Database

```bash
# Create PostgreSQL database
createdb election_db

# Or using psql:
psql -U postgres
CREATE DATABASE election_db;
\q

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 4. Run Development Server

```bash
# Start Django development server
python manage.py runserver

# Server will be available at: http://localhost:8000
# Admin panel: http://localhost:8000/admin
# API docs: http://localhost:8000/api/
```

## Project Structure

```
backend/
├── core/                    # Django project settings
│   ├── settings.py         # Main settings
│   ├── urls.py             # Root URL configuration
│   └── wsgi.py             # WSGI entry point
│
├── apps/                    # Django applications
│   ├── account/            # User authentication & management
│   ├── elections/          # Election configuration & committees
│   ├── electors/           # Elector database
│   ├── candidates/         # Candidates & parties management
│   ├── guarantees/         # Guarantee collection
│   ├── attendees/          # Attendance tracking
│   ├── voting/             # Voting day operations & results
│   ├── reports/            # Analytics & reporting
│   └── utils/              # Shared utilities
│
├── requirements.txt        # Python dependencies
├── manage.py               # Django management script
└── README.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login (returns JWT tokens)
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT access token

### Users
- `GET /api/users/` - List users (admin only)
- `POST /api/users/` - Create user (admin only)
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `GET /api/users/me/` - Current user profile
- `POST /api/users/change-password/` - Change password

### Elections
- `GET /api/election/elections/` - List elections
- `POST /api/election/elections/` - Create election
- `GET /api/election/committees/` - List committees
- `POST /api/election/committees/` - Create committee

### Electors
- `GET /api/electors/` - List electors (with advanced search)
- `POST /api/electors/` - Create elector
- `POST /api/electors/import_csv/` - Import electors from CSV
- `GET /api/electors/search/` - Advanced multi-field search
- `GET /api/electors/export_csv/` - Export electors to CSV

### Guarantees
- `GET /api/guarantees/` - List guarantees
- `POST /api/guarantees/` - Create guarantee
- `POST /api/guarantees/bulk_update/` - Update multiple guarantees
- `GET /api/guarantees/statistics/` - Guarantee statistics
- `GET /api/guarantees/team_dashboard/` - Team dashboard

### Attendance
- `GET /api/attendance/` - List attendance records
- `POST /api/attendance/mark_attendance/` - Mark elector attendance
- `GET /api/attendance/{id}/` - Get attendance details

### Voting
- `POST /api/voting/votes/enter_votes/` - Enter vote counts
- `POST /api/voting/votes/aggregate_results/` - Aggregate results
- `GET /api/voting/votes/get_final_results/` - Get final results
- `GET /api/voting/results/` - List election results

### Reports
- `GET /api/reports/dashboard/personal/` - Personal dashboard
- `GET /api/reports/dashboard/supervisor/` - Supervisor dashboard
- `GET /api/reports/dashboard/admin/` - Admin dashboard
- `GET /api/reports/coverage/` - Coverage analysis
- `GET /api/reports/accuracy/` - Accuracy analysis
- `GET /api/reports/committee-performance/` - Committee performance

See individual app READMEs for complete API documentation.

## User Roles

1. **SUPER_ADMIN** - Full system access
2. **ADMIN** - Operational management
3. **SUPERVISOR** - Team oversight
4. **USER** - Guarantee collector

## Development Commands

```bash
# Run migrations
python manage.py migrate

# Create migrations after model changes
python manage.py makemigrations

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Run Django shell
python manage.py shell

# Collect static files
python manage.py collectstatic
```

## Testing

```bash
# Install test dependencies (already in requirements.txt)
pip install pytest pytest-django pytest-cov

# Run all tests
pytest

# Run with coverage
pytest --cov=apps --cov-report=html

# Run specific app tests
pytest apps/account/tests/

# View coverage report
open htmlcov/index.html
```

## Database Management

```bash
# Create database backup
pg_dump election_db > backup.sql

# Restore database
psql election_db < backup.sql

# Reset database (WARNING: Deletes all data)
python manage.py flush
```

## Deployment

See `docs/project/backend-implementation-plan.md` for detailed deployment instructions.

### Quick Production Checklist
- [ ] Set `DEBUG=False`
- [ ] Set secure `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use production database
- [ ] Set up HTTPS
- [ ] Configure CORS properly
- [ ] Set up static file serving
- [ ] Configure Sentry for error tracking
- [ ] Set up database backups
- [ ] Configure Redis for caching
- [ ] Set up Celery for background tasks

## Environment Variables

Key environment variables (see `.env.example` for full list):

- `SECRET_KEY` - Django secret key (required)
- `DEBUG` - Debug mode (default: True)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `CORS_ALLOWED_ORIGINS` - Allowed frontend origins

## Common Issues

### Database Connection Error
```
Ensure PostgreSQL is running and credentials are correct in .env
```

### Migration Errors
```bash
# Reset migrations (development only)
python manage.py migrate --fake app_name zero
python manage.py migrate app_name
```

### Import Errors
```
Ensure virtual environment is activated and dependencies are installed
```

## 📚 Full Documentation

**For comprehensive documentation, architecture, and code standards:**
👉 **See [`docs/README.md`](./docs/README.md)** - Complete documentation hub with:
- Code standards and patterns
- Architecture and app structure
- API design guidelines
- Development workflow
- All detailed guides

## 🤝 Contributing

1. Read **[Backend Standardization Guide](./docs/BACKEND-STANDARDIZATION-GUIDE.md)**
2. Follow existing patterns in similar modules
3. Use **[Quick Reference](./docs/QUICK-REFERENCE.md)** for templates
4. Review **[docs/README.md](./docs/README.md)** for all guidelines

## 📞 Support

- **Documentation**: [`docs/`](./docs/) directory
- **API Docs**: http://localhost:8000/api/schema/
- **Admin Panel**: http://localhost:8000/admin/

## License

Proprietary - Kuwait Oil Company

---

## Implementation Status

### ✅ Completed Phases

**Phase 1: Foundation** (Week 1-2)
- Django project setup
- Custom user model with 4 roles
- JWT authentication
- Custom permissions (5 types)
- User CRUD operations

**Phase 2: Elections & Electors** (Week 3-4)
- Election and Committee models
- Elector model with 7-part name parsing
- CSV import with validation
- Advanced multi-field search (13 fields)
- Export functionality (CSV, Excel)

**Phase 3: Guarantee System** (Week 5-6)
- Guarantee management with groups
- Notes and history tracking
- Bulk update operations
- Team dashboard and statistics

**Phase 4: Reports & Analytics** (Week 7-9)
- Multi-level dashboards (3 types)
- Coverage and accuracy reports
- Committee performance analysis
- Analytics snapshots
- Chart data endpoints

**Phase 5: Voting Operations** (Week 10-12)
- Vote count entry system
- Results aggregation
- Final results compilation
- Complete audit trail

### 🎯 Overall Progress: 100% Complete

---

**Current Status**: All Backend Phases Complete ✅  
**Next Phase**: Frontend Development & Integration

For detailed information about each phase, see the phase summary documents listed above.

