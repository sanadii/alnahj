# Backend App Structure

**Last Updated:** October 27, 2025  
**Django Apps Following Plural Naming Convention**

---

## Django Apps Overview

### Core Apps (Pluralized)

#### 1. `apps.elections`
**Purpose**: Election configuration and committee management  
**Models**: `Election`, `Committee`  
**API**: `/api/elections/`

**Key Features**:
- Election configuration (voting mode, dates, rules)
- Committee management (gender-segregated voting locations)
- Election status tracking (setup → voting → counting → closed)
- Committee statistics and user assignments

---

#### 2. `apps.electors`
**Purpose**: Voter database management  
**Models**: `Elector`  
**API**: `/api/electors/`

**Key Features**:
- Employee/elector information (7-part name structure)
- Committee assignments
- Work information (designation, department, extension)
- Search functionality (name, KOC ID, mobile)
- Import/export capabilities

---

#### 3. `apps.candidates`
**Purpose**: Candidates and political parties management  
**Models**: `Party`, `Candidate`  
**API**: `/api/candidates/` and `/api/candidates/parties/`

**Key Features**:
- Political party management
- Candidate registration and management
- Party affiliation tracking
- Candidate statistics (vote counts, rankings)

**Note**: Separated from `apps.voting` in October 2025 refactoring

---

#### 4. `apps.attendees`
**Purpose**: Voting day attendance tracking  
**Models**: `Attendance`, `AttendanceStatistics`  
**API**: `/api/attendees/`

**Key Features**:
- Mark elector attendance
- Walk-in voter registration
- Real-time attendance statistics
- Committee-wise attendance tracking
- Hourly attendance breakdown
- Device and IP tracking

**Note**: Renamed from `apps.attendance` in October 2025

---

#### 5. `apps.guarantees`
**Purpose**: Candidate guarantee collection management  
**Models**: `Guarantee`, `GuaranteeGroup`  
**API**: `/api/guarantees/`

**Key Features**:
- Guarantee submission and tracking
- Guarantee group management
- Signature collection workflow
- Verification and approval process
- Guarantee statistics per candidate

---

#### 6. `apps.voting`
**Purpose**: Vote counting and results management  
**Models**: `VoteCount`, `CommitteeVoteEntry`, `ElectionResults`, `VoteCountAudit`  
**API**: `/api/voting/`

**Key Features**:
- Vote count entry and verification
- Committee-level vote aggregation
- Election results generation
- Results publication
- Audit trail for all vote operations

---

#### 7. `apps.reports`
**Purpose**: Analytics, reporting, and business intelligence  
**Models**: `AnalyticsSnapshot`, `SystemLog`  
**API**: `/api/reports/`

**Key Features**:
- Dashboard statistics
- Voter analytics
- Guarantee reports
- Attendance reports
- Committee performance metrics
- Chart data generation
- Historical snapshots

---

### Support Apps

#### 8. `apps.account`
**Purpose**: User authentication and authorization  
**Models**: `CustomUser`  
**API**: `/api/auth/` and `/api/users/`

**Key Features**:
- JWT authentication
- Role-based access control (Admin, Supervisor, Staff, Observer)
- User profile management
- Committee assignments
- Password management

---

#### 9. `apps.utils`
**Purpose**: Shared utilities and common functionality  
**No Models** (utility classes only)  
**No API** (internal use only)

**Key Components**:
- `APIResponse` - Standardized response wrapper
- `StandardResponseMixin` - ViewSet mixin for consistent responses
- Custom permissions (`IsAdminOrAbove`, `IsSupervisorOrAbove`, etc.)
- Custom exception handler
- Common validators

---

## App Dependencies

### Dependency Graph

```
┌─────────────┐
│   account   │ ← Authentication (base dependency)
└─────┬───────┘
      │
      ▼
┌─────────────┐     ┌─────────────┐
│  elections  │────▶│  electors   │
└─────┬───────┘     └─────┬───────┘
      │                   │
      ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ candidates  │     │  attendees  │
└─────┬───────┘     └─────────────┘
      │
      ▼
┌─────────────┐     ┌─────────────┐
│  guarantees │     │   voting    │
└─────────────┘     └─────┬───────┘
                          │
                          ▼
                    ┌─────────────┐
                    │   reports   │
                    └─────────────┘
```

### Key Relationships

- **Elections** → **Electors**: Elections have many electors via committees
- **Elections** → **Candidates**: Elections have many candidates
- **Candidates** → **Parties**: Candidates belong to parties
- **Candidates** → **Electors**: Candidates are electors
- **Electors** → **Committees**: Electors are assigned to committees
- **Attendees** → **Electors**: Attendance records for electors
- **Attendees** → **Committees**: Attendance tracked by committee
- **Voting** → **Candidates**: Vote counts for candidates
- **Voting** → **Committees**: Vote counts reported by committees
- **Guarantees** → **Candidates**: Guarantees collected for candidates
- **Guarantees** → **Electors**: Guarantees signed by electors

---

## Naming Conventions

### Why Plural Names?

Following Django best practices and community standards:

✅ **Advantages of Plural Naming**:
1. Matches Django conventions (most apps use plural)
2. API endpoints read naturally (`/api/elections/`, `/api/candidates/`)
3. Represents collections of items
4. Consistent with database table names
5. Clear distinction from model names (model: `Election`, app: `elections`)

### App vs Model Naming

| App Name (Plural) | Primary Models (Singular) |
|-------------------|---------------------------|
| `elections` | `Election`, `Committee` |
| `electors` | `Elector` |
| `candidates` | `Candidate`, `Party` |
| `attendees` | `Attendance`, `AttendanceStatistics` |
| `guarantees` | `Guarantee`, `GuaranteeGroup` |
| `voting` | `VoteCount`, `ElectionResults` |
| `reports` | `AnalyticsSnapshot`, `SystemLog` |
| `account` | `CustomUser` (singular is standard) |

---

## Migration History

### October 2025 Refactoring

**Phase 1: Candidates Separation**
- Created `apps.candidates` module
- Moved `Party` and `Candidate` models from `apps.voting`
- Updated all Foreign Key references
- Created new API endpoints at `/api/candidates/`

**Phase 2: Elections Rename**
- Renamed `apps.election` → `apps.elections`
- Updated URL from `/api/election/` → `/api/elections/`
- Updated 25+ files (models, views, serializers, migrations)
- Updated database metadata (django_migrations, django_content_type)

**Phase 3: Attendees Rename**
- Renamed `apps.attendance` → `apps.attendees`
- Updated URL from `/api/attendance/` → `/api/attendees/`
- Updated 8 files (imports, references)
- Updated database metadata

**Result**: 
- ✅ All apps follow plural naming convention
- ✅ Clear, consistent API structure
- ✅ Zero data loss
- ✅ All migrations applied successfully

See [APPS-PLURALIZATION-SUMMARY.md](../APPS-PLURALIZATION-SUMMARY.md) for detailed refactoring information.

---

## File Structure Per App

### Standard App Structure

```
apps/my_app/
├── __init__.py              # App initialization
├── apps.py                  # App configuration
├── models.py                # Data models
├── views.py                 # API views/viewsets
├── serializers.py           # DRF serializers
├── urls.py                  # URL routing
├── admin.py                 # Django admin configuration
├── permissions.py           # Custom permissions (if needed)
├── filters.py               # Custom filters (if needed)
├── tests/                   # Test files
│   ├── test_models.py
│   ├── test_views.py
│   └── test_serializers.py
├── migrations/              # Database migrations
│   ├── 0001_initial.py
│   └── ...
└── management/              # Management commands (if needed)
    └── commands/
        └── my_command.py
```

### Large App Structure (with services)

```
apps/my_app/
├── __init__.py
├── apps.py
├── models.py
├── views.py
├── serializers.py
├── urls.py
├── admin.py
├── services.py              # Business logic
├── tasks.py                 # Celery tasks
├── signals.py               # Django signals
├── validators.py            # Custom validators
├── permissions.py
├── filters.py
├── pagination.py
├── tests/
├── migrations/
└── management/
```

---

## Adding a New App

### Step-by-Step Guide

1. **Create the app**:
```bash
cd backend/apps
mkdir my_new_app
cd my_new_app
touch __init__.py apps.py models.py views.py serializers.py urls.py admin.py
```

2. **Configure apps.py**:
```python
from django.apps import AppConfig

class MyNewAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.my_new_app'  # Use plural name
    verbose_name = 'My New App Management'
```

3. **Update settings.py**:
```python
INSTALLED_APPS = [
    # ...
    'apps.my_new_app',  # Add to INSTALLED_APPS
]
```

4. **Create URLs**:
```python
# apps/my_new_app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MyModelViewSet

router = DefaultRouter()
router.register(r'', MyModelViewSet, basename='my-model')

app_name = 'my_new_app'  # Use plural

urlpatterns = [
    path('', include(router.urls)),
]
```

5. **Register in core/urls.py**:
```python
urlpatterns = [
    # ...
    path('api/my-new-app/', include('apps.my_new_app.urls')),
]
```

6. **Create models, views, serializers** following standardization guide

7. **Run migrations**:
```bash
python manage.py makemigrations my_new_app
python manage.py migrate
```

---

## Best Practices

### DO ✅
- Use plural app names (`elections`, `candidates`, `attendees`)
- Follow the standard app structure
- Keep models in `models.py` (or split into `models/` package if large)
- Use `StandardResponseMixin` for ViewSets
- Document all custom actions
- Write tests for all endpoints
- Register models in admin.py

### DON'T ❌
- Don't use singular app names (except `account`)
- Don't put business logic in views (use services.py)
- Don't skip migrations
- Don't create circular dependencies between apps
- Don't hardcode values (use settings/constants)
- Don't skip docstrings

---

## Documentation References

- **[Backend Standardization Guide](./BACKEND-STANDARDIZATION-GUIDE.md)** - Code standards and patterns
- **[Quick Reference](./QUICK-REFERENCE.md)** - Common code templates
- **[Review Summary](./REVIEW-SUMMARY.md)** - Code quality assessment
- **[Apps Pluralization Summary](../APPS-PLURALIZATION-SUMMARY.md)** - Refactoring details

---

**Maintained by**: Development Team  
**Contact**: [Your Contact Information]

