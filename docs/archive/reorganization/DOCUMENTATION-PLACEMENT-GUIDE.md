# Documentation Placement Guide

**MANDATORY**: Read this BEFORE creating any documentation  
**Last Updated**: October 21, 2025  
**Status**: Authoritative Reference

---

## 🚨 GOLDEN RULE

**"Know WHERE before you write WHAT"**

Before creating ANY documentation:
1. ✅ Read this guide (5 minutes)
2. ✅ Review the documentation index for your area
3. ✅ Find the correct location
4. ✅ Check if documentation already exists
5. ✅ Update existing docs OR create in correct location

**NEVER**:
- ❌ Create documentation in project root
- ❌ Create documentation before checking the index
- ❌ Duplicate existing documentation
- ❌ Create random folder structures

---

## 📂 Documentation Structure Overview

```
d:\React\workspace\
│
├── README.md                           ✅ Project overview only
├── CHANGELOG.md                        ✅ Project-wide changes only
│
├── docs/                               📁 ALL documentation here
│   │
│   ├── 00-QUICK-START.md              ⭐ New developer onboarding
│   ├── 01-PROJECT-OVERVIEW.md         ⭐ High-level architecture
│   ├── 02-INSTALLATION.md             ⭐ Setup instructions
│   ├── 03-COMMANDS.md                 ⭐ Common commands
│   ├── 04-PROJECT-MILESTONES.md       ⭐ Project progress
│   ├── TODO.md                        ⭐ Project-wide todos
│   ├── DOCUMENTATION-PLACEMENT-GUIDE.md  ⭐ This file
│   │
│   ├── apps/                          📁 Application documentation
│   │   ├── {app}/                     📁 Per-app folder
│   │   │   ├── {module}/              📁 Per-module folder
│   │   │   │   ├── README.md          Overview
│   │   │   │   ├── FULLSTACK.md       Implementation guide
│   │   │   │   ├── API.md             API documentation
│   │   │   │   ├── TODO.md            Module tasks
│   │   │   │   └── FRONTEND-API-GUIDE.md  (if needed)
│   │   │   │
│   │   │   └── README.md              App overview
│   │   │
│   │   └── _templates/                📁 Code templates
│   │
│   ├── architecture/                  📁 System architecture
│   │   ├── backend/                   📁 Backend architecture
│   │   │   ├── START-HERE.md          Entry point
│   │   │   ├── README.md              Backend overview
│   │   │   ├── apps/                  📁 Backend apps docs
│   │   │   │   ├── 00-START-HERE.md  Entry point
│   │   │   │   └── {topic}.md         Specific topics
│   │   │   └── {topic}.md             Architecture topics
│   │   │
│   │   └── frontend/                  📁 Frontend architecture
│   │       ├── START-HERE.md          Entry point
│   │       ├── README.md              Frontend overview
│   │       └── {topic}.md             Architecture topics
│   │
│   ├── agents/                        📁 Agent coordination
│   │   ├── README.md                  Agent framework
│   │   ├── checklists/                Quality checklists
│   │   └── {workflow}.md              Workflows
│   │
│   ├── active-plans/                  📁 Current work plans
│   │   └── {FEATURE}-PLAN.md          Active plans (DELETE when done)
│   │
│   └── archive/                       📁 Historical docs
│       ├── backend/                   Old backend docs
│       └── frontend/                  Old frontend docs
│
├── backend/                           📁 Django code (NO DOCS HERE)
└── frontend/                          📁 React code (NO DOCS HERE)
```

---

## 📍 Where to Place Your Documentation

### 1. App/Module Implementation Documentation

**Location**: `docs/apps/{app}/{module}/`

**Use when**:
- Implementing a new feature/module
- Documenting API endpoints
- Creating implementation guides
- Writing module-specific guides

**Files to create**:
```
docs/apps/{app}/{module}/
├── README.md           # Overview, features, quick reference
├── FULLSTACK.md        # Complete implementation guide
├── API.md              # API endpoint documentation
├── TODO.md             # Implementation tasks
└── FRONTEND-API-GUIDE.md  # Frontend-specific API guide (optional)
```

**Example**:
```
✅ CORRECT:
docs/apps/sales/
├── README.md
├── FULLSTACK.md
├── API.md
├── TODO.md
└── FRONTEND-API-GUIDE.md

❌ WRONG:
/SALES-IMPLEMENTATION.md
backend/SALES-API.md
docs/SALES-COMPLETE.md
```

---

### 2. Architecture Documentation

**Location**: `docs/architecture/{backend|frontend}/`

**Use when**:
- Documenting system-wide patterns
- Architectural decisions (ADRs)
- Cross-cutting concerns
- Technology choices

**Structure**:
```
docs/architecture/
├── backend/
│   ├── START-HERE.md              ⭐ Main entry
│   ├── README.md                  Overview
│   ├── BACKEND-ARCHITECTURE.md    Core patterns
│   ├── MULTI-TENANCY-*.md         Multi-tenancy
│   ├── DEPLOYMENT-GUIDE.md        Deployment
│   ├── apps/                      App-specific arch
│   │   ├── 00-START-HERE.md       Entry point
│   │   └── {TOPIC}.md             Specific topics
│   └── {TOPIC}.md                 Other topics
│
└── frontend/
    ├── START-HERE.md              ⭐ Main entry
    ├── README.md                  Overview
    ├── FRONTEND-ARCHITECTURE.md   Core patterns
    └── {TOPIC}.md                 Other topics
```

**Example**:
```
✅ CORRECT:
docs/architecture/backend/MULTI-TENANCY-GUIDE.md
docs/architecture/backend/apps/SALES-APP-REVIEW-STATUS.md
docs/architecture/frontend/REDUX-PATTERNS.md

❌ WRONG:
/ARCHITECTURE.md
backend/MULTI-TENANCY.md
docs/FRONTEND-PATTERNS.md
```

---

### 3. Active Work Plans

**Location**: `docs/active-plans/`

**Use when**:
- Planning a major feature
- Breaking down complex work
- Creating implementation roadmap

**Format**: `{FEATURE}-PLAN.md`

**IMPORTANT**: 
- ✅ Create plan BEFORE starting work
- ✅ Update plan as you progress
- ✅ DELETE when work is complete
- ✅ Create summary in archive if needed

**Example**:
```
✅ CORRECT:
docs/active-plans/
├── SALES-MODULE-PLAN.md           (active)
└── CALENDAR-ENHANCEMENT-PLAN.md   (active)

❌ WRONG:
docs/active-plans/
├── SALES-MODULE-PLAN.md           (completed, not deleted)
├── OLD-PLAN.md                    (outdated)
└── PLAN-V2.md                     (confusing name)
```

---

### 4. Completion Summaries & Reviews

**Location**: `docs/archive/`

**Use when**:
- Work is completed
- Creating historical record
- Documenting decisions made
- Summarizing major milestones

**Structure**:
```
docs/archive/
├── backend/
│   ├── apps/
│   │   ├── implementations/       Completion docs
│   │   ├── reviews/               Review docs
│   │   └── summaries/             Summary docs
│   └── {category}/                Other categories
│
└── frontend/
    └── {category}/                Frontend archives
```

**Example**:
```
✅ CORRECT:
docs/archive/backend/apps/summaries/SALES-CORRECTIONS-COMPLETE-OCT21.md
docs/archive/backend/apps/reviews/SALES-STRUCTURE-REVIEW-OCT21.md

❌ WRONG:
/SALES-COMPLETE.md
docs/SALES-DONE.md
docs/apps/sales/COMPLETE.md
```

---

### 5. Agent Coordination

**Location**: `docs/agents/`

**Use when**:
- Documenting agent workflows
- Creating quality checklists
- Defining handover protocols

**Structure**:
```
docs/agents/
├── README.md                      Agent framework
├── COMMUNICATION-PROTOCOLS.md     Handover process
├── checklists/
│   ├── pre-commit.md             ⭐ Quality gate
│   ├── code-review.md            Review checklist
│   └── {checklist}.md            Other checklists
└── {workflow}.md                 Workflow docs
```

**Example**:
```
✅ CORRECT:
docs/agents/checklists/pre-commit.md
docs/agents/BACKEND-WORKFLOW.md

❌ WRONG:
/AGENT-WORKFLOW.md
docs/CHECKLIST.md
backend/PRE-COMMIT.md
```

---

### 6. Project-Level Documentation

**Location**: `docs/` (root level only for these)

**Use when**:
- Quick start guides
- Project overview
- Installation instructions
- Common commands
- Project milestones

**Allowed files**:
- ✅ `00-QUICK-START.md`
- ✅ `01-PROJECT-OVERVIEW.md`
- ✅ `02-INSTALLATION.md`
- ✅ `03-COMMANDS.md`
- ✅ `04-PROJECT-MILESTONES.md`
- ✅ `TODO.md` (project-wide)
- ✅ `CHANGELOG.md`
- ✅ `DOCUMENTATION-PLACEMENT-GUIDE.md` (this file)
- ❌ NO OTHER FILES

---

## 🔍 Decision Tree: Where Should I Document?

```
START: I need to document something
│
├─ Is it about a specific app/module?
│  ├─ YES → docs/apps/{app}/{module}/
│  │         ├─ Implementation guide? → FULLSTACK.md
│  │         ├─ API endpoints? → API.md
│  │         ├─ Tasks? → TODO.md
│  │         └─ Overview? → README.md
│  │
│  └─ NO → Continue...
│
├─ Is it about system architecture?
│  ├─ YES → docs/architecture/{backend|frontend}/
│  │         ├─ Backend patterns? → backend/{TOPIC}.md
│  │         ├─ Frontend patterns? → frontend/{TOPIC}.md
│  │         └─ App architecture? → backend/apps/{TOPIC}.md
│  │
│  └─ NO → Continue...
│
├─ Is it an active work plan?
│  ├─ YES → docs/active-plans/{FEATURE}-PLAN.md
│  │         (DELETE when work is complete!)
│  │
│  └─ NO → Continue...
│
├─ Is it a completion summary?
│  ├─ YES → docs/archive/{backend|frontend}/{category}/
│  │
│  └─ NO → Continue...
│
├─ Is it about agent workflow?
│  ├─ YES → docs/agents/
│  │         ├─ Checklist? → checklists/{NAME}.md
│  │         └─ Workflow? → {WORKFLOW}.md
│  │
│  └─ NO → Continue...
│
└─ Is it project-level guide?
   ├─ YES → Check if it fits these:
   │         ├─ Quick start? → docs/00-QUICK-START.md
   │         ├─ Installation? → docs/02-INSTALLATION.md
   │         ├─ Commands? → docs/03-COMMANDS.md
   │         └─ Milestones? → docs/04-PROJECT-MILESTONES.md
   │
   └─ NO → ⚠️ STOP! Ask for guidance
```

---

## 📋 Pre-Documentation Checklist

**Before creating ANY documentation, complete this checklist**:

### Step 1: Review Index
- [ ] Read this guide (DOCUMENTATION-PLACEMENT-GUIDE.md)
- [ ] Check `docs/apps/` index for your app
- [ ] Check `docs/architecture/` for related docs
- [ ] Review `docs/active-plans/` for ongoing work

### Step 2: Check for Existing Docs
- [ ] Search for similar documentation
- [ ] Check if file already exists in correct location
- [ ] Check archive for historical versions

### Step 3: Determine Correct Location
- [ ] Use the decision tree above
- [ ] Verify location follows structure
- [ ] Confirm file naming convention

### Step 4: Create or Update
- [ ] Update existing doc if it exists
- [ ] Create new doc in correct location
- [ ] Follow file naming convention
- [ ] Add to relevant index/START-HERE.md

### Step 5: Link and Reference
- [ ] Update parent README or START-HERE
- [ ] Add cross-references if needed
- [ ] Update relevant TODO lists

---

## 📝 File Naming Conventions

### Module Documentation
```
✅ CORRECT:
README.md                          # Overview
FULLSTACK.md                       # Implementation
API.md                             # API endpoints
TODO.md                            # Tasks
FRONTEND-API-GUIDE.md              # Frontend-specific

❌ WRONG:
sales.md                           # Too generic
Sales-Module.md                    # Wrong case
sales-implementation.md            # Use FULLSTACK.md
api-documentation.md               # Use API.md
```

### Architecture Documentation
```
✅ CORRECT:
MULTI-TENANCY-IMPLEMENTATION-COMPLETE.md
BACKEND-ARCHITECTURE.md
SALES-APP-REVIEW-STATUS.md

❌ WRONG:
multi-tenancy.md                   # Not descriptive enough
backend.md                         # Too generic
sales_review.md                    # Use dashes, not underscores
```

### Active Plans
```
✅ CORRECT:
SALES-MODULE-PLAN.md
CALENDAR-ENHANCEMENT-PLAN.md
VOUCHER-INTEGRATION-PLAN.md

❌ WRONG:
plan.md                            # Not specific
sales.md                           # Not a plan file
PLAN-SALES.md                      # Feature first, then type
```

### Archive Files
```
✅ CORRECT:
SALES-CORRECTIONS-COMPLETE-OCT21.md
CALENDAR-IMPLEMENTATION-COMPLETE.md
STRUCTURE-REVIEW-OCT21.md

❌ WRONG:
COMPLETE.md                        # Not specific
sales-done.md                      # Use COMPLETE
oct21-sales.md                     # Date last, not first
```

---

## 🎯 Common Scenarios

### Scenario 1: Implementing New Feature
```
Task: Implement Sales module

Steps:
1. Check: Does docs/apps/sales/ exist?
   - No → Create folder
   - Yes → Review existing docs

2. Create required files:
   - docs/apps/sales/README.md
   - docs/apps/sales/FULLSTACK.md
   - docs/apps/sales/API.md
   - docs/apps/sales/TODO.md

3. Update indexes:
   - Update docs/apps/README.md (if exists)
   - Update docs/architecture/backend/apps/00-START-HERE.md

4. When complete:
   - Move plan to docs/archive/
   - Keep implementation docs in docs/apps/sales/
```

---

### Scenario 2: Architectural Decision
```
Task: Document multi-tenancy pattern

Steps:
1. Check: Is this backend or frontend?
   - Backend → docs/architecture/backend/

2. Check: Does similar doc exist?
   - Search for "multi-tenancy" in docs/architecture/backend/

3. Create or update:
   - Update existing OR create new
   - File: docs/architecture/backend/MULTI-TENANCY-GUIDE.md

4. Reference:
   - Add to docs/architecture/backend/START-HERE.md
   - Cross-reference in related module docs
```

---

### Scenario 3: Completion Summary
```
Task: Document completed work

Steps:
1. Create summary in archive:
   - docs/archive/backend/apps/summaries/FEATURE-COMPLETE-OCT21.md

2. Delete active plan:
   - Remove docs/active-plans/FEATURE-PLAN.md

3. Update implementation docs:
   - Update docs/apps/{app}/{module}/FULLSTACK.md
   - Update docs/apps/{app}/{module}/TODO.md

4. Update indexes:
   - Update docs/architecture/backend/apps/00-START-HERE.md
```

---

### Scenario 4: Creating Quality Checklist
```
Task: Create new quality checklist

Steps:
1. Location: docs/agents/checklists/

2. File name: {purpose}-checklist.md
   - Example: pre-deployment-checklist.md

3. Update index:
   - Add to docs/agents/README.md
```

---

## ⚠️ Common Mistakes to Avoid

### Mistake 1: Documentation in Project Root
```
❌ WRONG:
/SALES-COMPLETE.md
/API-GUIDE.md
/IMPLEMENTATION.md

✅ CORRECT:
docs/apps/sales/FULLSTACK.md
docs/apps/sales/API.md
docs/archive/backend/apps/summaries/SALES-COMPLETE-OCT21.md
```

### Mistake 2: Documentation in Code Folders
```
❌ WRONG:
backend/SALES-API.md
frontend/COMPONENT-GUIDE.md
backend/apps/sales/IMPLEMENTATION.md

✅ CORRECT:
docs/apps/sales/API.md
docs/architecture/frontend/COMPONENT-GUIDE.md
docs/apps/sales/FULLSTACK.md
```

### Mistake 3: Not Updating Indexes
```
❌ WRONG:
- Create docs/apps/sales/README.md
- Don't update any indexes

✅ CORRECT:
- Create docs/apps/sales/README.md
- Update docs/architecture/backend/apps/00-START-HERE.md
- Add cross-references as needed
```

### Mistake 4: Not Checking Existing Docs
```
❌ WRONG:
- Create docs/apps/sales/IMPLEMENTATION.md
- Duplicate of existing FULLSTACK.md

✅ CORRECT:
- Check for existing docs first
- Update FULLSTACK.md instead of creating duplicate
```

### Mistake 5: Not Deleting Completed Plans
```
❌ WRONG:
docs/active-plans/
├── SALES-PLAN.md (completed, still there)
├── OLD-PLAN.md (outdated)
└── SALES-V2-PLAN.md (confusion)

✅ CORRECT:
docs/active-plans/
└── CALENDAR-ENHANCEMENT-PLAN.md (only active work)

docs/archive/backend/apps/summaries/
└── SALES-COMPLETE-OCT21.md (summary in archive)
```

---

## 📚 Quick Reference Table

| Documentation Type | Location | File Name | Index to Update |
|-------------------|----------|-----------|-----------------|
| App Implementation | `docs/apps/{app}/{module}/` | `FULLSTACK.md` | `backend/apps/00-START-HERE.md` |
| API Endpoints | `docs/apps/{app}/{module}/` | `API.md` | Same as above |
| Frontend API | `docs/apps/{app}/{module}/` | `FRONTEND-API-GUIDE.md` | Same as above |
| Module Tasks | `docs/apps/{app}/{module}/` | `TODO.md` | Same as above |
| Backend Architecture | `docs/architecture/backend/` | `{TOPIC}.md` | `backend/START-HERE.md` |
| App Architecture | `docs/architecture/backend/apps/` | `{TOPIC}.md` | `backend/apps/00-START-HERE.md` |
| Frontend Architecture | `docs/architecture/frontend/` | `{TOPIC}.md` | `frontend/START-HERE.md` |
| Active Plan | `docs/active-plans/` | `{FEATURE}-PLAN.md` | None (delete when done) |
| Completion Summary | `docs/archive/{backend\|frontend}/` | `{FEATURE}-COMPLETE.md` | Archive index |
| Agent Checklist | `docs/agents/checklists/` | `{purpose}-checklist.md` | `agents/README.md` |
| Agent Workflow | `docs/agents/` | `{WORKFLOW}.md` | `agents/README.md` |

---

## 🔧 Maintenance

### Weekly Review
- [ ] Check for documentation in wrong locations
- [ ] Move misplaced docs to correct locations
- [ ] Delete completed plans from active-plans/
- [ ] Update indexes

### Monthly Cleanup
- [ ] Archive outdated documentation
- [ ] Consolidate duplicate docs
- [ ] Update cross-references
- [ ] Review and update this guide

---

## ✅ Compliance Checklist

Before considering your documentation complete:

- [ ] Documentation is in correct location per this guide
- [ ] File name follows naming conventions
- [ ] Existing docs checked (no duplication)
- [ ] Parent index/START-HERE updated
- [ ] Cross-references added if needed
- [ ] If completion doc, active plan deleted
- [ ] No documentation in project root (except allowed files)
- [ ] No documentation in code folders

---

## 🆘 When in Doubt

**If you're unsure where to place documentation**:

1. Read this guide again
2. Check the decision tree
3. Look at similar existing documentation
4. Ask: "Is this app-specific or system-wide?"
5. Ask: "Is this active work or historical?"
6. When still unsure, ask for guidance

**Contact Points**:
- Check `docs/architecture/backend/apps/00-START-HERE.md`
- Check `docs/architecture/backend/START-HERE.md`
- Review existing documentation structure

---

## 📖 Related Documentation

- `docs/architecture/backend/DOCUMENTATION-ARCHITECTURE.md` - Detailed structure
- `docs/agents/README.md` - Agent coordination
- `docs/agents/checklists/pre-commit.md` - Quality checklist

---

**Remember**: 
- 🎯 **Know WHERE before you write WHAT**
- 📍 **Check the index first**
- 🔄 **Update existing docs before creating new ones**
- 🗑️ **Delete completed plans**
- 📦 **Archive historical docs**

---

**Version**: 1.0  
**Last Updated**: October 21, 2025  
**Status**: Authoritative Reference  
**Compliance**: Mandatory for all documentation

