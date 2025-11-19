# Reference Folder Reorganization
## October 31, 2025

**Current Files in `docs/reference/`:**

1. **QUICK-REFERENCE.md** (379 lines) - Backend Django/DRF quick reference
2. **COMPONENT-LIBRARY.md** (656 lines) - Frontend React components
3. **MIGRATION-CHECKLIST.md** (436 lines) - Frontend API migration
4. **03-COMMANDS.md** (462 lines) - Mixed backend + frontend commands

---

## 📋 Reorganization Plan

### Backend Files → `docs/backend/`

**QUICK-REFERENCE.md** → `backend/04-QUICK-REFERENCE.md`
- Backend Django/DRF patterns
- ViewSet templates
- API response formats
- Quick imports

---

### Frontend Files → `docs/frontend/`

**COMPONENT-LIBRARY.md** → `frontend/03-COMPONENT-LIBRARY.md`
- React component catalog
- MUI components
- Usage examples

**MIGRATION-CHECKLIST.md** → `frontend/04-API-MIGRATION.md`
- API endpoint migration
- Frontend updates needed
- Rename for clarity

---

### Mixed Files → Split or Archive

**03-COMMANDS.md** → Split into:
- `backend/05-COMMANDS.md` (backend commands)
- `frontend/05-COMMANDS.md` (frontend commands)
- OR archive if redundant

---

## 📊 Result

### Backend Folder (Numbered)
```
docs/backend/
├── README.md
├── 01-ARCHITECTURE.md          # Overview
├── 02-STANDARDS.md             # Standards
├── 03-BUILDING-NEW-APP.md      # Tutorial
├── 04-QUICK-REFERENCE.md       # NEW from reference/
├── 05-COMMANDS.md              # NEW (backend commands)
├── API-CONVENTIONS.md
└── APP-STRUCTURE.md
```

### Frontend Folder (Numbered)
```
docs/frontend/
├── README.md
├── 01-STANDARDS.md             # Standards
├── 02-API-INTEGRATION.md       # From integration/
├── 03-COMPONENT-LIBRARY.md     # NEW from reference/
├── 04-API-MIGRATION.md         # NEW from reference/
├── 05-COMMANDS.md              # NEW (frontend commands)
└── FULL-STACK-INTEGRATION.md   # From integration/
```

### Remove
- `docs/reference/` folder (empty after moves)
- `docs/integration/` folder (files moved to frontend)

---

**Execute this plan?**

