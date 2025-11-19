# Cursor Rules - Election Management System

**AI Assistant Configuration & Project Rules**

**Last Updated**: October 27, 2025  
**Status**: ✅ Updated to reflect current project state

---

## 📁 Rules Structure

```
.cursor/rules/
├── README.md (this file)                # Rules overview
│
├── Core Rules (Always Applied)
│   ├── documentation-standards.mdc      # Documentation standards
│   ├── project-context.mdc             # Complete project context
│   └── development-workflow.mdc         # Development workflow
│
├── Backend Rules
│   ├── backend-api-patterns.mdc        # API patterns & standards
│   └── testing-security.mdc            # Testing & security
│
├── Frontend Rules
│   └── frontend-state-patterns.mdc     # State management patterns
│
├── _project-specific/                   # Technology-specific rules
│   ├── django-models.mdc
│   ├── django-rest-framework.mdc
│   ├── react-materialui.mdc
│   └── redux-saga.mdc
│
├── _templates/                          # Rule templates
│   └── AGENT-RULE-TEMPLATE.mdc
│
└── _archive/                            # Archived rules
    ├── backend-engineer.mdc.archive
    ├── frontend-engineer.mdc.archive
    ├── backend-patterns.mdc.old
    ├── fullstack-engineer.mdc.old
    └── strategist.mdc.old
```

---

## 🎯 Active Rules

### Always Applied Rules

These rules are applied automatically to all AI interactions:

1. **documentation-standards.mdc** ⭐
   - Documentation placement and structure
   - Single source of truth in `docs/`
   - Mandatory pre-documentation checklist
   - Archive completed work
   - **Updated**: October 27, 2025

2. **project-context.mdc** ⭐
   - Complete project overview
   - Technology stack
   - Backend 10/10 standardization
   - Frontend patterns established
   - Current priorities (API migration)
   - **Updated**: October 27, 2025

3. **development-workflow.mdc**
   - Development best practices
   - Code review standards
   - Quality gates
   - Testing requirements

---

## 🛠️ Technology-Specific Rules

### Backend Rules

#### backend-api-patterns.mdc
- API Response format (APIResponse class)
- ViewSet patterns (StandardResponseMixin)
- URL structure (RESTful, plural)
- Serializers, permissions, error handling
- **Status**: Reflects 10/10 standardization

#### testing-security.mdc
- Testing standards
- Security best practices
- Authentication patterns
- Permission system

### Frontend Rules

#### frontend-state-patterns.mdc
- State management (Context API + hooks)
- Custom hooks patterns
- Form handling
- Error boundaries

### Framework Rules (in `_project-specific/`)

#### django-models.mdc
- Django model patterns
- Database best practices
- Migration strategies

#### django-rest-framework.mdc
- DRF ViewSet patterns
- Serializer design
- Permission classes
- API versioning

#### react-materialui.mdc
- Material-UI component usage
- Theme configuration
- Styling patterns
- Responsive design

#### redux-saga.mdc
- Redux state management (if needed)
- Saga patterns
- Action creators
- Selectors

---

## 📖 Documentation References

All rules now reference the consolidated documentation in `docs/`:

### Primary Documentation

| Rule File | References |
|-----------|------------|
| **documentation-standards.mdc** | `docs/INDEX.md`, `docs/DOCUMENTATION-PLACEMENT-GUIDE.md` |
| **project-context.mdc** | `docs/standards/BACKEND-STANDARDIZATION-GUIDE.md`, `docs/standards/FRONTEND-STANDARDIZATION-GUIDE.md` |
| **backend-api-patterns.mdc** | `docs/standards/BACKEND-STANDARDIZATION-GUIDE.md`, `docs/reference/QUICK-REFERENCE.md` |
| **frontend-state-patterns.mdc** | `docs/standards/FRONTEND-STANDARDIZATION-GUIDE.md`, `docs/reference/COMPONENT-LIBRARY.md` |

---

## 🚨 Important Project Changes (October 2025)

### Rules Updated to Reflect:

1. **Backend Apps Pluralization**
   - `apps.election` → `apps.elections` ✅
   - `apps.attendance` → `apps.attendees` ✅
   - All endpoint references updated

2. **Documentation Consolidation**
   - All docs now in `docs/` (single source of truth)
   - `backend/docs/` archived
   - Complete INDEX.md navigation

3. **Standards Achievement**
   - Backend: 10/10 standardization score
   - Frontend: Standards established
   - Complete API standardization

4. **Frontend Migration Required**
   - Update API endpoints to plural format
   - See: `docs/reference/MIGRATION-CHECKLIST.md`

---

## 🎓 How Rules Are Used

### By AI Assistants

When helping with this project, AI should:

1. ✅ **Reference** documentation in `docs/` only
2. ✅ **Never reference** deprecated `backend/docs/`
3. ✅ **Follow** standardization guides for code patterns
4. ✅ **Use** APIResponse and StandardResponseMixin patterns
5. ✅ **Check** `docs/INDEX.md` before suggesting new docs
6. ✅ **Archive** completed work appropriately
7. ✅ **Update** INDEX.md when creating new docs

### By Developers

Before starting work:

1. ✅ Read relevant rule file
2. ✅ Check referenced documentation
3. ✅ Follow established patterns
4. ✅ Use standardization guides
5. ✅ Update documentation when needed

---

## 📊 Rules Status

| Rule File | Status | Last Updated |
|-----------|--------|--------------|
| **documentation-standards.mdc** | ✅ Current | Oct 27, 2025 |
| **project-context.mdc** | ✅ Current | Oct 27, 2025 |
| **development-workflow.mdc** | ✅ Current | Earlier |
| **backend-api-patterns.mdc** | ✅ Current | Earlier |
| **testing-security.mdc** | ✅ Current | Earlier |
| **frontend-state-patterns.mdc** | ✅ Current | Earlier |

---

## 🔄 Maintenance

### When to Update Rules

Update rules when:
- ✅ Project structure changes
- ✅ Standards are updated
- ✅ New patterns are established
- ✅ Documentation is reorganized
- ✅ Technology stack changes

### How to Update Rules

1. Identify what changed
2. Update relevant rule file
3. Update references to documentation
4. Test with AI assistant
5. Update this README.md
6. Archive old version if major change

---

## 📚 Related Documentation

### Main Documentation
- **[Complete Index](../../docs/INDEX.md)** - All documentation
- **[Documentation Hub](../../docs/README.md)** - Documentation overview

### Standards
- **[Backend Standards](../../docs/standards/BACKEND-STANDARDIZATION-GUIDE.md)** - Backend guide
- **[Frontend Standards](../../docs/standards/FRONTEND-STANDARDIZATION-GUIDE.md)** - Frontend guide
- **[API Integration](../../docs/standards/API-INTEGRATION-GUIDE.md)** - API patterns
- **[Full Stack Integration](../../docs/standards/FRONTEND-BACKEND-INTEGRATION.md)** - Integration guide

### References
- **[Quick Reference](../../docs/reference/QUICK-REFERENCE.md)** - Backend patterns
- **[Component Library](../../docs/reference/COMPONENT-LIBRARY.md)** - Frontend components
- **[Migration Checklist](../../docs/reference/MIGRATION-CHECKLIST.md)** - API migration

---

## ✅ Rules Verification

Before committing changes to rules:

- [ ] Documentation references are correct
- [ ] All paths point to `docs/` (not `backend/docs/`)
- [ ] New standards are included
- [ ] Examples are up to date
- [ ] This README.md is updated
- [ ] Rules tested with AI assistant

---

## 🎯 Current Priorities for AI Assistants

When working on this project:

1. **Follow Documentation**: Use `docs/INDEX.md` as primary reference
2. **Follow Standards**: Backend 10/10 patterns, Frontend established patterns
3. **Use Plural Endpoints**: `/api/elections/`, `/api/attendees/`
4. **Reference Correctly**: Point to `docs/`, not `backend/docs/`
5. **Archive Completed Work**: Move to appropriate archive category

---

## 📞 Questions?

### About Rules
- Check this README.md first
- Review relevant rule file
- Check referenced documentation
- Ask in team chat

### About Documentation
- Start with `docs/INDEX.md`
- Check standardization guides
- Review archive for examples

---

**Last Updated**: October 27, 2025  
**Maintained By**: Development Team  
**Status**: ✅ **Current & Synchronized with Project**

---

**All rules now reflect the current, organized state of the project!**
