# Complete Implementation Patterns - Copy & Paste Guide

**Purpose**: Exact patterns for modernizing remaining modules  
**Status**: Production-tested on 6 modules (zero errors)  
**Time per module**: 10-20 minutes

---

## 📋 Table of Contents

1. [List Page Pattern (with Delete)](#list-page-pattern)
2. [Create Page Pattern](#create-page-pattern)
3. [Edit Page Pattern](#edit-page-pattern)
4. [Icon Reference](#icon-reference)
5. [Module Checklists](#module-checklists)

---

## 🎯 List Page Pattern (with Delete)

### Step 1: Update Imports

**Find**:
```tsx
import MainCard from 'ui-component/cards/MainCard';
```

**Replace with**:
```tsx
import { PremiumCard, DeleteConfirmationDialog } from 'shared/components';
import { IconXXX } from '@tabler/icons-react'; // See icon reference below
```

---

### Step 2: Add State Variables

**Find** (typically after other useState declarations):
```tsx
const [loading, setLoading] = useState(false);
```

**Add after**:
```tsx
// Delete dialog state
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);
const [isDeleting, setIsDeleting] = useState(false);
```

---

### Step 3: Replace Delete Handler

**Find** (typical pattern):
```tsx
const handleDeleteXXX = (id: number) => {
  if (window.confirm('Are you sure...?')) {
    // delete logic
  }
};
```

**Replace with**:
```tsx
const handleDeleteXXX = (id: number, name: string) => {
  setItemToDelete({ id, name });
  setShowDeleteDialog(true);
};

const handleConfirmDelete = async () => {
  if (!itemToDelete) return;
  
  setIsDeleting(true);
  try {
    // Original delete logic here (API call, dispatch, etc.)
    // Example: await api.deleteItem(itemToDelete.id);
    // Or: dispatch(deleteItemRequest(itemToDelete.id));
    
    setShowDeleteDialog(false);
    setItemToDelete(null);
    
    // Refresh list if needed
    // fetchItems(); or similar
  } catch (error) {
    console.error('Delete failed:', error);
    // Show error notification if available
  } finally {
    setIsDeleting(false);
  }
};

const handleCancelDelete = () => {
  setShowDeleteDialog(false);
  setItemToDelete(null);
};
```

---

### Step 4: Update JSX Return

**Find**:
```tsx
return (
  <MainCard title="XXX Management">
```

**Replace with**:
```tsx
return (
  <>
    <PremiumCard title="XXX Management" icon={<IconXXX size={24} />} variant="elevated" color="primary">
```

---

### Step 5: Update Delete Button Click

**Find** (in table actions):
```tsx
<IconButton onClick={() => handleDeleteXXX(item.id)}>
  <DeleteIcon />
</IconButton>
```

**Replace with**:
```tsx
<IconButton onClick={() => handleDeleteXXX(item.id, item.name)}>
  <DeleteIcon />
</IconButton>
```

---

### Step 6: Close Tags and Add Dialog

**Find** (at end of return):
```tsx
    </MainCard>
  );
};
```

**Replace with**:
```tsx
    </PremiumCard>

    {/* Delete Confirmation Dialog */}
    <DeleteConfirmationDialog
      open={showDeleteDialog}
      title="Delete XXX"
      itemName={itemToDelete?.name || ''}
      itemType="XXX"
      warningMessage="This will permanently delete this XXX and all associated data. This action cannot be undone."
      isDeleting={isDeleting}
      onConfirm={handleConfirmDelete}
      onCancel={handleCancelDelete}
    />
  </>
);
};
```

---

## 📝 Create Page Pattern

### Step 1: Update Imports

**Find**:
```tsx
import MainCard from 'ui-component/cards/MainCard';
```

**Replace with**:
```tsx
import { PremiumCard } from 'shared/components';
import { IconXXXPlus } from '@tabler/icons-react'; // See icon reference
```

---

### Step 2: Update JSX Return

**Find**:
```tsx
return (
  <MainCard title="Create XXX">
```

**Replace with**:
```tsx
return (
  <PremiumCard title="Create XXX" icon={<IconXXXPlus size={24} />} variant="elevated" color="primary">
```

---

### Step 3: Close Tag

**Find**:
```tsx
  </MainCard>
);
```

**Replace with**:
```tsx
  </PremiumCard>
);
```

---

## ✏️ Edit Page Pattern

### Step 1: Update Imports

**Find**:
```tsx
import MainCard from 'ui-component/cards/MainCard';
```

**Replace with**:
```tsx
import { PremiumCard } from 'shared/components';
import { IconEdit } from '@tabler/icons-react';
```

---

### Step 2: Update JSX Return

**Find** (may have conditional title):
```tsx
return (
  <MainCard title={isEditMode ? 'Edit XXX' : 'Create XXX'}>
```

**Replace with**:
```tsx
return (
  <PremiumCard 
    title={isEditMode ? 'Edit XXX' : 'Create XXX'} 
    icon={<IconEdit size={24} />} 
    variant="elevated" 
    color="primary"
  >
```

---

### Step 3: Handle Loading State (if present)

**Find**:
```tsx
if (loading) {
  return (
    <MainCard title="...">
      <CircularProgress />
    </MainCard>
  );
}
```

**Replace with**:
```tsx
if (loading) {
  return (
    <PremiumCard title="..." icon={<IconEdit size={24} />} variant="elevated" color="primary">
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    </PremiumCard>
  );
}
```

---

### Step 4: Close Main Return Tag

**Find**:
```tsx
  </MainCard>
);
```

**Replace with**:
```tsx
  </PremiumCard>
);
```

---

## 🎨 Icon Reference

| Module | List Icon | Create Icon | Edit Icon | Detail Icon |
|--------|-----------|-------------|-----------|-------------|
| **Users** | `IconUsers` | `IconUserPlus` | `IconEdit` | `IconUser` |
| **Parties** | `IconFlag` | `IconFlagPlus` | `IconEdit` | - |
| **Candidates** | `IconUsers` | `IconUserPlus` | `IconEdit` | - |
| **Committees** | `IconBuildingCommunity` | `IconPlus` | `IconEdit` | `IconEye` |
| **Voting** | `IconChecklist` | `IconPlus` | `IconEdit` | - |
| **Elections** | `IconCalendarEvent` | `IconCalendarPlus` | `IconEdit` | - |
| **Results** | `IconChartBar` | - | - | - |
| **Sorting** | `IconSortAscending` | - | - | - |

---

## 📋 Module Checklists

### Candidates Module (2 files remaining)

#### ✅ CandidatesList.tsx - DONE

#### ⬜ CandidateCreate.tsx

**Changes needed**:
1. Import: `import { PremiumCard } from 'shared/components';`
2. Import: `import { IconUserPlus } from '@tabler/icons-react';`
3. Replace: `<MainCard title="Create Candidate">` → `<PremiumCard title="Create Candidate" icon={<IconUserPlus size={24} />} variant="elevated" color="primary">`
4. Replace: `</MainCard>` → `</PremiumCard>`

**Estimated time**: 2 minutes

---

#### ⬜ CandidateEdit.tsx

**Changes needed**:
1. Import: `import { PremiumCard } from 'shared/components';`
2. Import: `import { IconEdit } from '@tabler/icons-react';`
3. Replace: `<MainCard title="Edit Candidate">` → `<PremiumCard title="Edit Candidate" icon={<IconEdit size={24} />} variant="elevated" color="primary">`
4. Replace loading state MainCard → PremiumCard (if present)
5. Replace: `</MainCard>` → `</PremiumCard>`

**Estimated time**: 3 minutes

---

### Committees Module (4 files)

#### ⬜ CommitteesList.tsx

**Has**: window.confirm  
**Pattern**: List Page Pattern (full)  
**Icon**: `IconBuildingCommunity`  
**Estimated time**: 10 minutes

**Exact changes**:
1. Imports: Add `PremiumCard`, `DeleteConfirmationDialog`, `IconBuildingCommunity`
2. State: Add delete dialog states (3 variables)
3. Handler: Replace window.confirm logic
4. JSX: Wrap in `<>`, use PremiumCard, add DeleteConfirmationDialog
5. Button: Update onClick to pass `(id, name)`

---

#### ⬜ CommitteeCreate.tsx

**Pattern**: Create Page Pattern  
**Icon**: `IconPlus`  
**Estimated time**: 2 minutes

---

#### ⬜ CommitteeEdit.tsx

**Pattern**: Edit Page Pattern  
**Icon**: `IconEdit`  
**Estimated time**: 3 minutes

---

#### ⬜ CommitteeDetail.tsx

**Pattern**: Create Page Pattern (view-only)  
**Icon**: `IconEye`  
**Estimated time**: 2 minutes

---

### Voting Module (2 files)

#### ⬜ VotesList.tsx

**Has**: window.confirm  
**Pattern**: List Page Pattern (full)  
**Icon**: `IconChecklist`  
**Estimated time**: 10 minutes

---

#### ⬜ VoteEntry.tsx

**Pattern**: Create Page Pattern  
**Icon**: `IconEdit`  
**Estimated time**: 2 minutes

---

### Elections Module (1 file)

#### ⬜ ElectionsList.tsx

**Has**: window.confirm  
**Pattern**: List Page Pattern (full)  
**Icon**: `IconCalendarEvent`  
**Estimated time**: 10 minutes

---

### Results Module (1 file)

#### ⬜ ElectionResults.tsx

**Has**: window.confirm  
**Pattern**: List Page Pattern (full)  
**Icon**: `IconChartBar`  
**Estimated time**: 10 minutes

---

### Sorting Module (1 file)

#### ⬜ ResultsViewTab.tsx

**Has**: window.confirm  
**Pattern**: Partial (may just need delete dialog)  
**Icon**: `IconSortAscending`  
**Estimated time**: 5 minutes

---

## 🚀 Quick Start Guide

### For Each Module:

1. **Open the file**
2. **Identify pattern**: List (with delete), Create, or Edit
3. **Follow the pattern above** (copy-paste-adapt)
4. **Test for linting**: `npm run lint`
5. **Mark complete**: Update progress doc

---

## 💡 Pro Tips

### Finding window.confirm

```bash
# Search for window.confirm in a module
grep -r "window.confirm" frontend/src/views/MODULE_NAME/
```

### Finding MainCard usage

```bash
# Search for MainCard in a module
grep -r "MainCard" frontend/src/views/MODULE_NAME/
```

### Checking your work

```bash
# Lint specific module
cd frontend
npm run lint -- --quiet src/views/MODULE_NAME/
```

---

## 🎯 Common Patterns by File Type

### Pattern A: List with Delete (7 files)
- UsersList ✅
- PartiesList ✅
- CandidatesList ✅
- CommitteesList ⬜
- VotesList ⬜
- ElectionsList ⬜
- ElectionResults ⬜

**Time**: 10 min each

---

### Pattern B: Simple Create (5 files)
- UserCreate ✅
- PartyCreate ✅
- CandidateCreate ⬜
- CommitteeCreate ⬜
- VoteEntry ⬜

**Time**: 2 min each

---

### Pattern C: Simple Edit (5 files)
- UserEdit ✅
- PartyEdit ✅
- CandidateEdit ⬜
- CommitteeEdit ⬜
- CommitteeDetail ⬜

**Time**: 3 min each

---

## 📊 Progress Tracker

### Completed (6 modules)
- ✅ Election
- ✅ Electors
- ✅ Guarantees
- ✅ Attendance
- ✅ Users (4/4 files)
- ✅ Parties (3/3 files)

### In Progress (1 module)
- 🔄 Candidates (1/3 files done)

### Remaining (6 modules)
- ⬜ Candidates (2 files)
- ⬜ Committees (4 files)
- ⬜ Voting (2 files)
- ⬜ Elections (1 file)
- ⬜ Results (1 file)
- ⬜ Sorting (1 file)

**Total**: 11 files remaining  
**Estimated time**: ~60 minutes

---

## 🎉 Success Criteria

After applying patterns:

- ✅ No `import MainCard` statements
- ✅ No `window.confirm` statements
- ✅ All pages have icons
- ✅ `npm run lint` shows zero errors
- ✅ All functionality preserved

---

## 📚 Reference Files

**Perfect examples** to copy from:
- `frontend/src/views/users/UsersList.tsx` - List with delete
- `frontend/src/views/users/UserCreate.tsx` - Create page
- `frontend/src/views/users/UserEdit.tsx` - Edit page
- `frontend/src/views/parties/PartiesList.tsx` - List with delete (async)

---

## 🔥 Speed Run Mode

For maximum efficiency:

1. **Batch by pattern**: Do all "List with Delete" first
2. **Use multi-cursor**: Edit similar lines simultaneously
3. **Copy icon imports**: From completed modules
4. **Test in batches**: Lint after each module
5. **Track progress**: Check off as you go

---

**Estimated completion**: 60 minutes total  
**Complexity**: Low (pattern established)  
**Risk**: Minimal (6 modules done with zero errors)

---

*This pattern guide is battle-tested on 6 production modules!* ✅

