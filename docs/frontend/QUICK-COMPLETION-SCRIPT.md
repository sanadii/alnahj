# Quick Completion Script - 11 Files Remaining

**Time**: ~60 minutes  
**Files**: 11 remaining  
**Pattern**: Proven on 19 files (zero errors)

---

## 🎯 Execution Order (Optimized)

### Batch 1: Candidates Finish (5 minutes)
1. CandidateCreate.tsx (2 min)
2. CandidateEdit.tsx (3 min)

### Batch 2: Committees (17 minutes)
3. CommitteesList.tsx (10 min) - has delete
4. CommitteeCreate.tsx (2 min)
5. CommitteeEdit.tsx (3 min)
6. CommitteeDetail.tsx (2 min)

### Batch 3: Voting (12 minutes)
7. VotesList.tsx (10 min) - has delete
8. VoteEntry.tsx (2 min)

### Batch 4: Feature Modules (26 minutes)
9. ElectionsList.tsx (10 min) - has delete
10. ElectionResults.tsx (10 min) - has delete
11. ResultsViewTab.tsx (6 min) - has delete

---

## 📋 File-by-File Checklist

### ⬜ 1. CandidateCreate.tsx (2 min)

```tsx
// STEP 1: Update imports (line 9)
// OLD:
import MainCard from 'ui-component/cards/MainCard';

// NEW:
import { PremiumCard } from 'shared/components';
import { IconUserPlus } from '@tabler/icons-react';

// STEP 2: Update return (line ~62)
// OLD:
return (
  <MainCard title="Add New Candidate">

// NEW:
return (
  <PremiumCard title="Add New Candidate" icon={<IconUserPlus size={24} />} variant="elevated" color="primary">

// STEP 3: Close tag (end of file)
// OLD:
  </MainCard>
);

// NEW:
  </PremiumCard>
);
```

**Test**: `npm run lint -- src/views/candidates/CandidateCreate.tsx`

---

### ⬜ 2. CandidateEdit.tsx (3 min)

```tsx
// STEP 1: Update imports (line 9)
// OLD:
import MainCard from 'ui-component/cards/MainCard';

// NEW:
import { PremiumCard } from 'shared/components';
import { IconEdit } from '@tabler/icons-react';

// STEP 2: Update loading return (if present)
// Search for: if (loading) {
// Update MainCard → PremiumCard with icon

// STEP 3: Update main return
// OLD:
return (
  <MainCard title="Edit Candidate">

// NEW:
return (
  <PremiumCard title="Edit Candidate" icon={<IconEdit size={24} />} variant="elevated" color="primary">

// STEP 4: Close tag
// OLD:
  </MainCard>
);

// NEW:
  </PremiumCard>
);
```

**Test**: `npm run lint -- src/views/candidates/CandidateEdit.tsx`

---

### ⬜ 3. CommitteesList.tsx (10 min)

```tsx
// STEP 1: Update imports
// Find: import MainCard
// ADD ABOVE IT:
import { PremiumCard, DeleteConfirmationDialog } from 'shared/components';
import { IconBuildingCommunity } from '@tabler/icons-react';

// STEP 2: Add state (after other useState)
// ADD:
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [committeeToDelete, setCommitteeToDelete] = useState<{ id: number; name: string } | null>(null);
const [isDeleting, setIsDeleting] = useState(false);

// STEP 3: Find handleDeleteCommittee
// REPLACE ENTIRE FUNCTION WITH:
const handleDeleteCommittee = (id: number, name: string) => {
  setCommitteeToDelete({ id, name });
  setShowDeleteDialog(true);
};

const handleConfirmDelete = async () => {
  if (!committeeToDelete) return;
  setIsDeleting(true);
  try {
    // PUT ORIGINAL DELETE LOGIC HERE
    // Example: await api.deleteCommittee(committeeToDelete.id);
    setShowDeleteDialog(false);
    setCommitteeToDelete(null);
  } finally {
    setIsDeleting(false);
  }
};

const handleCancelDelete = () => {
  setShowDeleteDialog(false);
  setCommitteeToDelete(null);
};

// STEP 4: Update return
// OLD:
return (
  <MainCard title="Committees">

// NEW:
return (
  <>
    <PremiumCard title="Committees" icon={<IconBuildingCommunity size={24} />} variant="elevated" color="primary">

// STEP 5: Find delete button onClick
// Search for: onClick={() => handleDeleteCommittee(
// ADD second parameter (name)
// EXAMPLE:
onClick={() => handleDeleteCommittee(committee.id, committee.name)}

// STEP 6: Close and add dialog
// OLD (end of file):
  </MainCard>
);

// NEW:
    </PremiumCard>

    <DeleteConfirmationDialog
      open={showDeleteDialog}
      title="Delete Committee"
      itemName={committeeToDelete?.name || ''}
      itemType="committee"
      warningMessage="This will permanently delete this committee and all associated data."
      isDeleting={isDeleting}
      onConfirm={handleConfirmDelete}
      onCancel={handleCancelDelete}
    />
  </>
);
```

**Test**: `npm run lint -- src/views/committees/CommitteesList.tsx`

---

### ⬜ 4. CommitteeCreate.tsx (2 min)

```tsx
// Same pattern as CandidateCreate
// Icon: IconPlus
// Title: "Create Committee"
```

---

### ⬜ 5. CommitteeEdit.tsx (3 min)

```tsx
// Same pattern as CandidateEdit
// Icon: IconEdit
// Title: "Edit Committee"
```

---

### ⬜ 6. CommitteeDetail.tsx (2 min)

```tsx
// Same pattern as Create
// Icon: IconEye
// Title: "Committee Details"
```

---

### ⬜ 7. VotesList.tsx (10 min)

```tsx
// Same pattern as CommitteesList
// Icon: IconChecklist
// Item type: "vote entry"
// State names: voteToDelete
```

---

### ⬜ 8. VoteEntry.tsx (2 min)

```tsx
// Same pattern as Create
// Icon: IconEdit
// Title: "Vote Entry"
```

---

### ⬜ 9. ElectionsList.tsx (10 min)

```tsx
// Same pattern as CommitteesList
// Icon: IconCalendarEvent
// Item type: "election"
// State names: electionToDelete
```

---

### ⬜ 10. ElectionResults.tsx (10 min)

```tsx
// Same pattern as CommitteesList
// Icon: IconChartBar
// Item type: "result"
// State names: resultToDelete
```

---

### ⬜ 11. ResultsViewTab.tsx (6 min)

```tsx
// Partial pattern - may only need delete dialog
// Check if it has MainCard first
// Icon: IconSortAscending
```

---

## ⚡ Speed Commands

```bash
# Lint all at once
cd frontend
npm run lint -- src/views/candidates/ src/views/committees/ src/views/voting/

# Or individual
npm run lint -- src/views/candidates/CandidateCreate.tsx
```

---

## 📊 Progress Tracking

Mark with ✅ as you complete:

- [ ] CandidateCreate.tsx
- [ ] CandidateEdit.tsx
- [ ] CommitteesList.tsx
- [ ] CommitteeCreate.tsx
- [ ] CommitteeEdit.tsx
- [ ] CommitteeDetail.tsx
- [ ] VotesList.tsx
- [ ] VoteEntry.tsx
- [ ] ElectionsList.tsx
- [ ] ElectionResults.tsx
- [ ] ResultsViewTab.tsx

---

## 🎉 When Complete

Run full lint:
```bash
cd frontend
npm run lint
```

Expected: Previous warnings (in settings module) but **ZERO new errors**!

---

**You've got this!** 🚀 The pattern is proven and repeatable.

