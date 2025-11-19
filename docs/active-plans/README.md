# Active Plans

Current development plans and work in progress.

## Purpose

This directory contains:
- **Feature implementation plans** - Detailed plans for features being developed
- **Active development docs** - Documentation for ongoing work
- **Work in progress** - Temporary planning documents

## Lifecycle

**Important**: Files in this directory are **temporary**.

- ✅ Create plan BEFORE starting work
- ✅ Update as work progresses
- ❌ DELETE when work is complete
- ❌ Don't keep obsolete plans

## File Naming

```
{FEATURE-NAME}-PLAN.md
{FEATURE-NAME}-STATUS.md
{FEATURE-NAME}-IMPLEMENTATION.md
```

Examples:
- `USER-AUTHENTICATION-PLAN.md`
- `API-REDESIGN-PLAN.md`
- `DATABASE-MIGRATION-PLAN.md`

## Plan Template

```markdown
# {Feature Name} Implementation Plan

**Status**: Planning / In Progress / Complete  
**Start Date**: YYYY-MM-DD  
**Target Date**: YYYY-MM-DD  
**Owner**: Developer Name

## Overview
Brief description of what we're building and why.

## Goals
- Goal 1
- Goal 2
- Goal 3

## Technical Approach
How we're going to implement this.

## Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Dependencies
What this depends on or blocks.

## Risks
Potential issues and mitigation strategies.

## Success Criteria
How we know when we're done.
```

## Current Plans

**None** - Create plans as needed for active work.

## Creating a Plan

### 1. Before Starting Work
```bash
# Create plan file
touch docs/active-plans/FEATURE-NAME-PLAN.md

# Use template above
# Fill in details
# Commit to git
```

### 2. During Work
- Update plan with progress
- Document decisions
- Track blockers
- Update task list

### 3. After Completion
```bash
# Create summary in archive
touch docs/archive/FEATURE-NAME-COMPLETE.md

# Document what was done
# Delete active plan
rm docs/active-plans/FEATURE-NAME-PLAN.md
```

## Cleanup Guidelines

### When to Delete
- ✅ Feature is complete
- ✅ Work is merged to main
- ✅ Documentation updated
- ✅ Plan is obsolete

### What to Keep
- ❌ Don't keep for "reference"
- ❌ Don't accumulate old plans
- ❌ Don't keep "maybe later" plans

### Where to Archive
Move completed work summaries to:
- `docs/archive/completed-features/`

## Examples

### Active Plan
```markdown
# User Profile Management Plan

**Status**: In Progress  
**Start Date**: 2024-10-20  
**Target Date**: 2024-10-27

## Tasks
- [x] Design API endpoints
- [x] Create database schema
- [ ] Implement backend
- [ ] Implement frontend
- [ ] Write tests
```

### Completed (Move to Archive)
```markdown
# User Profile Management - Complete

**Completed**: 2024-10-27  
**Status**: ✅ Complete

## Summary
Implemented user profile management with all planned features.

## What Was Done
- Backend API
- Frontend UI
- Tests
- Documentation
```

## Related Documentation

- [Project Overview](../01-PROJECT-OVERVIEW.md)
- [TODO List](../TODO.md)
- [Archive](../archive/)
- [Documentation Placement Guide](../DOCUMENTATION-PLACEMENT-GUIDE.md)

---

**Remember**: 
- 📝 Create plan before starting
- 🔄 Update during work
- 🗑️ DELETE when complete
- 📦 Archive summary only

**Keep this directory clean!**

---

**Last Updated**: October 24, 2025

