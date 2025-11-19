# Documentation Cleanup Plan

**Date:** January 2025  
**Goal:** Consolidate all scattered documentation into `docs/` folder

## Current State

### Root Level Files (to move)
- API-STRUCTURE-UPDATE.md
- AUDIT-SUMMARY-README.md
- BACKEND-CONNECTION-COMPLETE.md
- CHANGELOG.md (keep in root, but reference in docs)
- COMPREHENSIVE-SYSTEM-AUDIT-2025.md
- FEATURES-ROADMAP-2025.md
- FINAL-API-CLEANUP.md
- IMPROVEMENT-PLAN-2025.md
- PREMIUM-PAGE-HEADER-ROLLOUT-SUMMARY.md

### Frontend Files (to move)
- All .md files in frontend/ root
- frontend/src/ subdirectory .md files (keep component-level READMEs)

### Backend Files (to move)
- All .md files in backend/ root
- backend/files/ .md files
- backend/apps/*/README.md files (consolidate)

## Target Structure

```
docs/
├── features/              # Feature implementations
│   ├── frontend/
│   ├── backend/
│   └── full-stack/
├── fixes/                 # Bug fixes and patches
│   ├── frontend/
│   └── backend/
├── summaries/             # Implementation summaries
│   ├── frontend/
│   └── backend/
├── guides/                # How-to guides
│   ├── frontend/
│   └── backend/
├── releases/              # Release notes (already exists)
├── reference/             # Quick references (already exists)
└── ... (existing folders)
```

## Migration Steps

1. Create new folder structure
2. Categorize and move root-level files
3. Categorize and move frontend/ files
4. Categorize and move backend/ files
5. Update INDEX.md
6. Verify no broken references

