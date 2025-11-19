# 📚 Documentation Index - Quick Access

**Last Updated**: October 22, 2025  
**Status**: ✅ All documentation organized and centralized

---

## 🚀 Quick Start

New to the project? Start here:
1. 📖 [Quick Start Guide](00-QUICK-START.md)
2. 📋 [Project Overview](01-PROJECT-OVERVIEW.md)
3. ⚙️ [Installation Guide](02-INSTALLATION.md)
4. 💻 [Common Commands](03-COMMANDS.md)

---

## 🏗️ Architecture Documentation

### Backend
- 📍 **Start Here**: [`architecture/backend/START-HERE.md`](architecture/backend/START-HERE.md)
- 🔗 **API Response Standards**: [`architecture/backend/API-RESPONSE-STANDARDS.md`](architecture/backend/API-RESPONSE-STANDARDS.md)
- 🌐 **URL Conventions**: [`architecture/backend/URL-CONVENTIONS.md`](architecture/backend/URL-CONVENTIONS.md)
- ✅ **Compliance Check**: [`architecture/backend/DOCUMENTATION-COMPLIANCE-CHECK.md`](architecture/backend/DOCUMENTATION-COMPLIANCE-CHECK.md)

### Frontend
- 📍 **Overview**: [`architecture/frontend/README.md`](architecture/frontend/README.md)
- 🔌 **API Integration Guide**: [`architecture/frontend/API-INTEGRATION-GUIDE.md`](architecture/frontend/API-INTEGRATION-GUIDE.md)
- ⚛️ **Component Patterns**: `architecture/frontend/`

---

## 📱 App Documentation

### Core Apps
- **Clients**: [`apps/clients/`](apps/clients/)
  - [`apps/clients/FULLSTACK.md`](apps/clients/FULLSTACK.md) - Complete implementation guide
  - [`apps/clients/API.md`](apps/clients/API.md) - API documentation
  
- **Calendar**: [`apps/calendar/`](apps/calendar/)
  - [`apps/calendar/appointments/FULLSTACK.md`](apps/calendar/appointments/FULLSTACK.md)
  
- **Sales**: [`apps/sales/`](apps/sales/)
  - [`apps/sales/FULLSTACK.md`](apps/sales/FULLSTACK.md)
  - [`apps/sales/FRONTEND-API-GUIDE.md`](apps/sales/FRONTEND-API-GUIDE.md)

### All Apps
Browse all app documentation:
- [`apps/`](apps/) - Module-specific docs
- [`architecture/backend/apps/`](architecture/backend/apps/) - App architecture docs

---

## 📋 Planning & Active Work

### Active Plans
- **Location**: [`active-plans/`](active-plans/)
- **Purpose**: Current work-in-progress
- **Rule**: DELETE when work is complete

### TODO Lists
- **Main TODO**: [`TODO.md`](TODO.md)
- **App TODOs**: `apps/{app}/TODO.md`

---

## 📦 Historical Archives

### Backend Archives
- [`archive/backend/`](archive/backend/) - Backend completion summaries
- [`archive/backend/apps/`](archive/backend/apps/) - App-specific archives

### Frontend Archives
- [`archive/frontend/`](archive/frontend/) - Frontend completion summaries

### Key Summaries
- **Latest Backend Standardization**: [`archive/COMPLETE-BACKEND-STANDARDIZATION-AND-CLEANUP-OCT22.md`](archive/COMPLETE-BACKEND-STANDARDIZATION-AND-CLEANUP-OCT22.md)
- **Documentation Cleanup**: [`archive/DOCUMENTATION-CLEANUP-OCT22-2025.md`](archive/DOCUMENTATION-CLEANUP-OCT22-2025.md)

---

## 🤖 Agent Coordination

### For AI Assistants
- **Checklists**: [`agents/checklists/`](agents/checklists/)
- **Session Management**: [`agents/coordination/`](agents/coordination/)
- **Handover Guides**: [`agents/handovers/`](agents/handovers/)

---

## 📝 Key Rules & Standards

### Documentation Placement
- **Complete Guide**: [`DOCUMENTATION-PLACEMENT-GUIDE.md`](DOCUMENTATION-PLACEMENT-GUIDE.md)
- **Cursor Rule**: `.cursor/rules/documentation-standards.mdc` (v2.0)

### Development Workflow
- **Cursor Rule**: `.cursor/rules/development-workflow.mdc`
- **Backend Patterns**: `.cursor/rules/backend-patterns.mdc`
- **Frontend Patterns**: `.cursor/rules/frontend-patterns.mdc`

---

## 🔍 Find Documentation By Topic

### API Development
- Response Standards: [`architecture/backend/API-RESPONSE-STANDARDS.md`](architecture/backend/API-RESPONSE-STANDARDS.md)
- URL Conventions: [`architecture/backend/URL-CONVENTIONS.md`](architecture/backend/URL-CONVENTIONS.md)
- ViewSet Patterns: `.cursor/rules/backend-api-views.mdc`

### Frontend Integration
- API Integration: [`architecture/frontend/API-INTEGRATION-GUIDE.md`](architecture/frontend/API-INTEGRATION-GUIDE.md)
- Redux Patterns: `architecture/frontend/`
- Component Guidelines: `.cursor/rules/frontend-patterns.mdc`

### Database & Models
- Multi-Tenancy: `architecture/backend/`
- Model Patterns: `.cursor/rules/backend-patterns.mdc`

### Testing
- Testing Strategy: `architecture/backend/`
- Test Examples: `backend/tests/`

---

## 📊 Project Status

### Completed Initiatives
- ✅ Backend API Standardization (Oct 22, 2025) - 100%
- ✅ URL Standardization (Oct 22, 2025) - 100%
- ✅ Documentation Cleanup (Oct 22, 2025) - 100%
- ✅ Legacy Code Removal (Oct 22, 2025) - 100%

### In Progress
- 🔄 Frontend Integration with new API format
- 🔄 Remaining module implementations

See [`TODO.md`](TODO.md) for current tasks.

---

## 🚨 Important Rules

### Documentation Placement (STRICT)
```
✅ ALL docs must be in docs/
❌ NO docs in project root (except README.md, CHANGELOG.md)
❌ NO docs in backend/ or frontend/ (except README.md in apps)
```

### Verification Commands
```powershell
# Check for violations (should be 0)
Get-ChildItem -Path . -Filter "*.md" -File | Where-Object { $_.Name -notmatch "^(README|CHANGELOG)\.md$" }
```

See [`architecture/backend/DOCUMENTATION-COMPLIANCE-CHECK.md`](architecture/backend/DOCUMENTATION-COMPLIANCE-CHECK.md) for details.

---

## 🆘 Need Help?

### Can't Find Something?
1. Check this index first
2. Search `docs/` directory
3. Check `archive/` for historical docs
4. Review `.cursor/rules/` for standards

### Creating New Documentation?
1. Read: [`DOCUMENTATION-PLACEMENT-GUIDE.md`](DOCUMENTATION-PLACEMENT-GUIDE.md)
2. Follow the decision tree
3. Always create in `docs/`
4. Update this index if adding major docs

---

## 📞 Quick Links

| What | Where |
|------|-------|
| API Standards | `docs/architecture/backend/API-RESPONSE-STANDARDS.md` |
| Frontend Integration | `docs/architecture/frontend/API-INTEGRATION-GUIDE.md` |
| URL Conventions | `docs/architecture/backend/URL-CONVENTIONS.md` |
| App Docs | `docs/apps/{app}/` |
| Archives | `docs/archive/` |
| Active Plans | `docs/active-plans/` |
| Rules | `.cursor/rules/` |
| Main TODO | `docs/TODO.md` |

---

**📍 Remember**: ALL documentation is in `docs/`. If you can't find it here, check the archives!

