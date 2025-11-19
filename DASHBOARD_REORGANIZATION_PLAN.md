# Dashboard Folder Structure Reorganization Plan

## Current Issues
1. **Flat structure**: All components are in a single `components/` folder
2. **Mixed concerns**: Tabs, dialogs, and views are all at the same level
3. **No grouping**: Related components (tabs + their dialogs) are scattered
4. **Unclear separation**: Dashboard tabs vs Management tabs are not clearly separated

## Current Structure
```
dashboard/
├── Dashboard.tsx (main entry point)
└── components/
    ├── DashboardView.tsx (has 6 tabs: Overview, Parties, Candidates, Committees, Electors, Attendance)
    ├── ManagementView.tsx (has 4 tabs: Parties, Candidates, Committees, Users)
    ├── TabPanel.tsx
    ├── PartiesTab.tsx
    ├── CandidatesTab.tsx
    ├── CommitteesTab.tsx
    ├── UsersTab.tsx
    ├── PartyFormDialog.tsx
    ├── CandidateFormDialog.tsx
    ├── CommitteeFormDialog.tsx
    ├── EditElectionDialog.tsx
    ├── AddMembersDialog.tsx
    ├── AssignToCommitteeDialog.tsx
    ├── cards/
    ├── charts/
    ├── widgets/
    └── hooks/
```

## Proposed Structure
```
dashboard/
├── Dashboard.tsx (main entry point)
├── components/
│   ├── dashboard/                    # Dashboard view tabs and related components
│   │   ├── DashboardView.tsx         # Main dashboard view container
│   │   ├── tabs/
│   │   │   ├── OverviewTab.tsx       # Overview tab (currently index 0 in DashboardView)
│   │   │   ├── PartiesTab.tsx        # Parties tab (currently index 1)
│   │   │   ├── CandidatesTab.tsx     # Candidates tab (currently index 2)
│   │   │   ├── CommitteesTab.tsx     # Committees tab (currently index 3)
│   │   │   ├── ElectorsTab.tsx       # Electors tab (currently index 4)
│   │   │   └── AttendanceTab.tsx    # Attendance tab (currently index 5)
│   │   └── index.ts                  # Export dashboard components
│   │
│   ├── management/                   # Management view tabs and related components
│   │   ├── ManagementView.tsx        # Main management view container
│   │   ├── tabs/
│   │   │   ├── PartiesTab.tsx        # Parties management tab
│   │   │   ├── CandidatesTab.tsx     # Candidates management tab
│   │   │   ├── CommitteesTab.tsx     # Committees management tab
│   │   │   └── UsersTab.tsx          # Users management tab
│   │   ├── dialogs/                  # Management-specific dialogs
│   │   │   ├── PartyFormDialog.tsx
│   │   │   ├── CandidateFormDialog.tsx
│   │   │   ├── CommitteeFormDialog.tsx
│   │   │   ├── AddMembersDialog.tsx
│   │   │   └── AssignToCommitteeDialog.tsx
│   │   └── index.ts                  # Export management components
│   │
│   ├── shared/                       # Shared components used by both views
│   │   ├── TabPanel.tsx              # Reusable tab panel component
│   │   ├── EditElectionDialog.tsx    # Shared election edit dialog
│   │   └── index.ts                  # Export shared components
│   │
│   ├── cards/                        # Card components (keep as is)
│   ├── charts/                       # Chart components (keep as is)
│   ├── widgets/                      # Widget components (keep as is)
│   └── hooks/                        # Custom hooks (keep as is)
```

## Implementation Steps

### Phase 1: Create New Folder Structure
1. Create `components/dashboard/tabs/` directory
2. Create `components/management/tabs/` directory
3. Create `components/management/dialogs/` directory
4. Create `components/shared/` directory

### Phase 2: Extract Dashboard Tabs from DashboardView
1. Extract Overview tab content → `components/dashboard/tabs/OverviewTab.tsx`
2. Extract Parties tab content → `components/dashboard/tabs/PartiesTab.tsx`
3. Extract Candidates tab content → `components/dashboard/tabs/CandidatesTab.tsx`
4. Extract Committees tab content → `components/dashboard/tabs/CommitteesTab.tsx`
5. Extract Electors tab content → `components/dashboard/tabs/ElectorsTab.tsx`
6. Extract Attendance tab content → `components/dashboard/tabs/AttendanceTab.tsx`
7. Update `DashboardView.tsx` to import and use these tab components

### Phase 3: Move Management Components
1. Move `PartiesTab.tsx` → `components/management/tabs/PartiesTab.tsx`
2. Move `CandidatesTab.tsx` → `components/management/tabs/CandidatesTab.tsx`
3. Move `CommitteesTab.tsx` → `components/management/tabs/CommitteesTab.tsx`
4. Move `UsersTab.tsx` → `components/management/tabs/UsersTab.tsx`
5. Move `ManagementView.tsx` → `components/management/ManagementView.tsx`
6. Move management dialogs to `components/management/dialogs/`:
   - `PartyFormDialog.tsx`
   - `CandidateFormDialog.tsx`
   - `CommitteeFormDialog.tsx`
   - `AddMembersDialog.tsx`
   - `AssignToCommitteeDialog.tsx`

### Phase 4: Move Shared Components
1. Move `TabPanel.tsx` → `components/shared/TabPanel.tsx`
2. Move `EditElectionDialog.tsx` → `components/shared/EditElectionDialog.tsx`

### Phase 5: Update Imports
1. Update `Dashboard.tsx` imports
2. Update `DashboardView.tsx` imports
3. Update `ManagementView.tsx` imports
4. Update all tab component imports
5. Update all dialog component imports
6. Create barrel exports (`index.ts`) for each folder

### Phase 6: Cleanup
1. Remove old files from root `components/` directory
2. Verify all imports work correctly
3. Test both dashboard and management views
4. Run linter and fix any issues

## Benefits
1. **Clear separation**: Dashboard tabs vs Management tabs are clearly separated
2. **Related components grouped**: Tabs and their dialogs are in the same folder
3. **Better maintainability**: Easier to find and modify related components
4. **Scalability**: Easy to add new tabs or dialogs in the right place
5. **Shared components**: Clear distinction between shared and view-specific components

## Notes
- Keep `cards/`, `charts/`, `widgets/`, and `hooks/` as they are (already well-organized)
- Dashboard tabs are currently inline in `DashboardView.tsx` - need to extract them
- Management tabs already exist as separate files - just need to move them
- Some dialogs might be shared (like `EditElectionDialog`) - place in `shared/`
- Management-specific dialogs go in `management/dialogs/`

