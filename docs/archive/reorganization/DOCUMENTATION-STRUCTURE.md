# Documentation Structure

How documentation is organized in this project.

## Directory Structure

```
docs/
├── README.md                           # Documentation index
├── 00-QUICK-START.md                  # Quick start guide
├── 01-PROJECT-OVERVIEW.md             # Project overview
├── 02-INSTALLATION.md                 # Installation guide
├── 03-COMMANDS.md                     # Command reference
├── TODO.md                            # Project TODO list
├── CHANGELOG.md                       # Version history
├── DOCUMENTATION-STRUCTURE.md         # This file
├── DOCUMENTATION-PLACEMENT-GUIDE.md   # Placement rules
│
├── core/                              # Core documentation
│   ├── README.md                      # Core docs index
│   ├── frontend/                      # Frontend docs
│   │   ├── README.md
│   │   ├── architecture.md
│   │   ├── components.md
│   │   ├── state-management.md
│   │   └── ...
│   ├── backend/                       # Backend docs
│   │   ├── README.md
│   │   ├── architecture.md
│   │   ├── api.md
│   │   └── ...
│   ├── app/                           # App features
│   │   ├── README.md
│   │   └── users/                     # User management
│   │       ├── README.md
│   │       ├── api.md
│   │       └── ...
│   ├── database/                      # Database docs
│   │   ├── README.md
│   │   ├── schema.md
│   │   └── ...
│   ├── security/                      # Security docs
│   │   ├── README.md
│   │   ├── authentication.md
│   │   └── ...
│   └── testing/                       # Testing docs
│       ├── README.md
│       ├── strategy.md
│       └── ...
│
├── active-plans/                      # Current work plans
│   └── feature-name-plan.md
│
└── archive/                           # Historical docs
    ├── previous-project/              # Old project docs
    └── completed-features/            # Completed work
```

## Documentation Categories

### 1. Root Documentation
**Purpose**: Quick access and overview  
**Location**: `docs/`

Files:
- `README.md` - Documentation index
- `00-QUICK-START.md` - 5-minute setup
- `01-PROJECT-OVERVIEW.md` - Project details
- `02-INSTALLATION.md` - Detailed setup
- `03-COMMANDS.md` - Command reference
- `TODO.md` - Task tracking
- `CHANGELOG.md` - Version history

### 2. Core Documentation
**Purpose**: Technical documentation by concern  
**Location**: `docs/core/`

Organized by:
- **Frontend**: UI, components, state
- **Backend**: API, business logic
- **App**: Features and modules
- **Database**: Schema, queries
- **Security**: Auth, authorization
- **Testing**: Tests, QA

### 3. Active Plans
**Purpose**: Current work and planning  
**Location**: `docs/active-plans/`

Contains:
- Feature implementation plans
- Active development docs
- Work in progress

**Lifecycle**: DELETE when work is complete

### 4. Archive
**Purpose**: Historical reference  
**Location**: `docs/archive/`

Contains:
- Completed feature summaries
- Previous project documentation
- Obsolete documentation

**Purpose**: Reference only, not active docs

## Documentation Principles

### Organization
- ✅ Organized by concern, not by date
- ✅ Clear hierarchy
- ✅ Easy to find
- ✅ Consistent structure

### Location
- ✅ Documentation close to what it documents
- ✅ Core docs in `core/`
- ✅ Feature docs in `core/app/`
- ✅ Plans in `active-plans/`

### Naming
- ✅ Lowercase with hyphens: `feature-name.md`
- ✅ Descriptive names
- ✅ Consistent conventions
- ✅ README.md for indexes

### Content
- ✅ Clear and concise
- ✅ Code examples
- ✅ Diagrams when helpful
- ✅ Cross-references
- ✅ Keep updated

## Decision Tree

### Where to Document?

```
Project overview/setup?
  → Root: 00-QUICK-START.md, 01-PROJECT-OVERVIEW.md, 02-INSTALLATION.md

Frontend architecture?
  → core/frontend/

Backend architecture?
  → core/backend/

Feature/module?
  → core/app/{feature-name}/

Database schema?
  → core/database/

Security practices?
  → core/security/

Testing approach?
  → core/testing/

Active work plan?
  → active-plans/{feature-name}-plan.md
  (DELETE when complete!)

Completed feature?
  → archive/completed-features/{feature-name}-complete.md

Historical reference?
  → archive/
```

## File Naming Conventions

### Documentation Files
```
✅ GOOD:
- feature-name.md
- authentication-flow.md
- api-design.md

❌ BAD:
- Feature Name.md
- feature_name.md
- featureName.md
```

### Directories
```
✅ GOOD:
- user-management/
- api-design/
- feature-name/

❌ BAD:
- UserManagement/
- API_Design/
- Feature Name/
```

### Special Files
```
README.md           # Directory index
TODO.md            # Task list
CHANGELOG.md       # Version history
```

## Maintenance

### When to Update
- ✅ Adding features
- ✅ Changing architecture
- ✅ Fixing bugs
- ✅ Updating dependencies

### What to Update
- Feature docs in `core/app/`
- Architecture docs in `core/{frontend,backend}/`
- API documentation
- `TODO.md` for tasks
- `CHANGELOG.md` for versions

### How to Update
1. Find correct location
2. Update existing docs
3. Add examples
4. Update cross-references
5. Update indexes

### Cleanup
- Archive old documentation
- Delete completed plans
- Remove obsolete docs
- Update broken links

## Quality Standards

### Good Documentation
- ✅ Accurate and current
- ✅ Clear and concise
- ✅ Complete coverage
- ✅ Good examples
- ✅ Proper organization
- ✅ Cross-referenced

### Red Flags
- ❌ Outdated information
- ❌ Broken links
- ❌ Missing examples
- ❌ Scattered files
- ❌ Duplicated content

## Tools & Automation

### Linting
```bash
# Check links
markdown-link-check docs/**/*.md

# Check spelling
aspell check docs/**/*.md

# Check style
markdownlint docs/**/*.md
```

### Generation
```bash
# Generate diagrams
mermaid docs/**/*.mmd

# Generate API docs
npm run docs:api
```

## Related Files

- [Documentation Placement Guide](DOCUMENTATION-PLACEMENT-GUIDE.md) - Detailed placement rules
- [README.md](README.md) - Documentation index

---

**Remember**: Good structure makes documentation easy to find and maintain!

**Last Updated**: October 24, 2025

