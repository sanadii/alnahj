# Backend Documentation Hub

**Election Management System - Django REST Framework Backend**

---

## 📌 About This Documentation

**Purpose**: This directory contains all backend development documentation, code standards, architecture guides, and best practices.

**Looking for quick start?** → Go back to [`../README.md`](../README.md) for setup and deployment instructions.

**This directory is for**: Understanding the codebase, following standards, learning patterns, and maintaining quality.

---

## 🎯 Quick Navigation

### For New Developers
1. **[Backend Standardization Guide](./BACKEND-STANDARDIZATION-GUIDE.md)** ⭐ **START HERE**
   - Complete guide to code standards, patterns, and best practices
   - API response format, ViewSet patterns, URL structure
   - Serializer patterns, permissions, error handling
   
2. **[App Structure](./APP-STRUCTURE.md)**
   - Overview of all Django apps and their purposes
   - App dependencies and relationships
   - Naming conventions and migration history

3. **[Quick Reference](./QUICK-REFERENCE.md)**
   - Code templates and common patterns
   - Quick copy-paste examples
   - Cheat sheet for common operations

### For Code Review & Audit
4. **[Standardization Audit Report](./STANDARDIZATION-AUDIT-REPORT.md)** 🔍 **NEW**
   - Comprehensive standardization audit (October 2025)
   - **Score: 10/10** ✅ Fully Standardized
   - Detailed compliance analysis per module
   - ViewSets, serializers, URLs, models verification

5. **[Review Summary](./REVIEW-SUMMARY.md)**
   - Code quality assessment
   - Areas of excellence and improvement
   - Compliance checklist

---

## 📋 Recent Changes (October 2025)

### App Pluralization & Restructuring

**What Changed**:
- ✅ `apps.election` → `apps.elections` (plural)
- ✅ `apps.attendance` → `apps.attendees` (plural)
- ✅ Created `apps.candidates` (separated from voting)
- ✅ Updated all API endpoints, imports, and references
- ✅ Zero data loss, backward-compatible database changes

**Documentation**:
- [Apps Pluralization Summary](../APPS-PLURALIZATION-SUMMARY.md) - Complete overview
- [Elections App Rename](../ELECTIONS-APP-RENAME-COMPLETE.md) - Elections details
- [Attendees App Rename](../ATTENDEES-APP-RENAME-COMPLETE.md) - Attendees details
- [Candidates Module](../CANDIDATES-MODULE-CREATED.md) - Candidates separation

---

## 📚 All Documentation Files

### Core Guides
- **BACKEND-STANDARDIZATION-GUIDE.md** - Main standardization guide (886 lines)
- **STANDARDIZATION-AUDIT-REPORT.md** - Comprehensive audit report (10/10 score)
- **APP-STRUCTURE.md** - App architecture and organization
- **QUICK-REFERENCE.md** - Templates and patterns
- **REVIEW-SUMMARY.md** - Code quality assessment

### Reference Documents
- **API-ENDPOINTS-REFERENCE.md** - All API endpoints (if exists)
- **DATABASE-SCHEMA.md** - Database structure (if exists)
- **TESTING-GUIDE.md** - Testing patterns (if exists)

---

## 🏗️ Backend Architecture

### Tech Stack
- **Python**: 3.11+
- **Framework**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL 15+ (SQLite for development)
- **Authentication**: JWT (djangorestframework-simplejwt)
- **API Documentation**: DRF Spectacular

### Django Apps Structure

```
apps/
├── account/       - User authentication & authorization
├── elections/     - Election configuration & committees
├── electors/      - Voter database management
├── candidates/    - Candidates & political parties
├── guarantees/    - Guarantee collection & verification
├── attendees/     - Attendance tracking
├── voting/        - Vote counting & results
├── reports/       - Analytics & reporting
└── utils/         - Shared utilities & mixins
```

### Key Architectural Patterns

1. **Standardized API Responses** - All endpoints use `APIResponse` class
2. **ViewSet Mixins** - `StandardResponseMixin` for consistent CRUD
3. **Permission System** - Role-based access control (Admin, Supervisor, Staff, Observer)
4. **Audit Trail** - User tracking for all create/update operations
5. **Soft Deletes** - Optional soft delete support

---

## 🚀 Quick Start

### Development Setup
```bash
# 1. Create virtual environment
python -m venv venv

# 2. Activate venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py migrate

# 5. Create superuser
python manage.py createsuperuser

# 6. Run server
python manage.py runserver
```

### Testing
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.elections

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Common Commands
```bash
# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Shell
python manage.py shell

# Collect static files
python manage.py collectstatic
```

---

## 📖 Documentation Standards

### Code Documentation
- All ViewSets must have docstrings
- All custom actions must document their endpoints
- All models must have field help_text
- All serializers must document validation rules

### Example:
```python
class MyViewSet(StandardResponseMixin, viewsets.ModelViewSet):
    """
    ViewSet for MyModel management.
    
    Endpoints:
    - GET    /api/my-models/              - List
    - POST   /api/my-models/              - Create
    - GET    /api/my-models/{id}/         - Retrieve
    - PUT    /api/my-models/{id}/         - Update
    - DELETE /api/my-models/{id}/         - Delete
    - GET    /api/my-models/statistics/   - Get statistics
    """
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get model statistics.
        
        GET /api/my-models/statistics/
        
        Returns:
            - total: Total count
            - active: Active count
        """
        # Implementation
```

---

## 🔍 Code Quality Standards

### Linting & Formatting
- **Flake8**: Python linting
- **Black**: Code formatting
- **isort**: Import sorting
- **mypy**: Type checking (optional)

### Code Review Checklist
- [ ] Follows standardization guide
- [ ] Uses `APIResponse` for all responses
- [ ] Uses `StandardResponseMixin` for ViewSets
- [ ] Proper permission classes applied
- [ ] All endpoints documented
- [ ] Error handling implemented
- [ ] Tests written and passing
- [ ] No linting errors

---

## 🛠️ Development Workflow

### 1. Feature Development
1. Read relevant documentation
2. Follow standardization patterns
3. Write code with proper documentation
4. Add tests
5. Run linter and tests
6. Create pull request

### 2. Code Review
1. Check standardization compliance
2. Verify API response format
3. Ensure proper permissions
4. Review error handling
5. Check test coverage
6. Approve or request changes

### 3. Deployment
1. All tests passing
2. Linting clean
3. Migrations applied
4. Documentation updated
5. Code reviewed and approved

---

## 📊 Code Quality Score

**Overall Score**: 9.5/10 ✅

### Breakdown
- **API Response Format**: 10/10 ✅
- **ViewSet Standards**: 10/10 ✅
- **URL Structure**: 10/10 ✅
- **Model Patterns**: 9/10 ✅
- **Serializer Patterns**: 9/10 ✅
- **Permission System**: 10/10 ✅
- **Error Handling**: 10/10 ✅
- **Documentation**: 9/10 ✅

### Areas of Excellence
- ✅ Consistent API response format across all endpoints
- ✅ Well-structured ViewSets with StandardResponseMixin
- ✅ Comprehensive permission system
- ✅ Clean URL structure following REST conventions
- ✅ Excellent error handling with APIResponse

### Minor Improvements
- Some models could use more validation
- A few serializers could benefit from field-level documentation
- Some test coverage gaps in edge cases

---

## 🤝 Contributing

### Adding New Features
1. Read [Backend Standardization Guide](./BACKEND-STANDARDIZATION-GUIDE.md)
2. Follow existing patterns in similar modules
3. Use [Quick Reference](./QUICK-REFERENCE.md) for templates
4. Document all endpoints and logic
5. Add comprehensive tests
6. Submit PR with clear description

### Reporting Issues
- Check existing issues first
- Provide clear reproduction steps
- Include error messages and logs
- Suggest potential solutions if possible

---

## 📞 Support

### Documentation
- **Internal Docs**: `/backend/docs/`
- **API Docs**: `http://localhost:8000/api/schema/`
- **Admin Panel**: `http://localhost:8000/admin/`

### Common Issues
- See [Troubleshooting Guide](../TROUBLESHOOTING.md) (if exists)
- Check GitHub issues
- Ask in team chat

---

## 📝 Version History

### v1.1 (October 27, 2025)
- ✅ Renamed `apps.election` → `apps.elections`
- ✅ Renamed `apps.attendance` → `apps.attendees`
- ✅ Created `apps.candidates` module
- ✅ Updated all documentation
- ✅ Added APP-STRUCTURE.md

### v1.0 (October 25, 2025)
- ✅ Initial standardization complete
- ✅ APIResponse implementation across all endpoints
- ✅ StandardResponseMixin for ViewSets
- ✅ Complete documentation suite

---

**Maintained by**: Development Team  
**Last Updated**: October 27, 2025  
**Status**: ✅ Active Development
