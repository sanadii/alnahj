# Component Library

**Election Management System - React Component Reference**

**Last Updated:** October 27, 2025

---

## Overview

This document catalogs all reusable components in the Election Management System frontend, organized by category with usage examples and props documentation.

---

## Common Components

### Button Components

#### PrimaryButton
```typescript
import { Button } from '@mui/material';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

// Usage
<Button
  variant="contained"
  color="primary"
  onClick={handleClick}
  disabled={loading}
>
  Submit
</Button>
```

---

### Card Components

#### InfoCard
```typescript
interface InfoCardProps {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
  elevation?: number;
}

// Usage
<InfoCard
  title="Current Election"
  subtitle="2025 Election"
  content={<ElectionDetails />}
  actions={<EditButton />}
/>
```

---

### Data Display Components

#### DataTable
```typescript
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  pagination?: boolean;
  pageSize?: number;
}

// Usage
<DataTable
  columns={electorColumns}
  data={electors}
  loading={loading}
  onRowClick={handleRowClick}
  pagination
  pageSize={25}
/>
```

#### StatsCard
```typescript
interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'secondary' | 'success' | 'error';
}

// Usage
<StatsCard
  title="Total Electors"
  value={979}
  icon={<PeopleIcon />}
  trend={{ value: 5, direction: 'up' }}
  color="primary"
/>
```

---

### Form Components

#### SearchBar
```typescript
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounce?: number;
  fullWidth?: boolean;
}

// Usage
<SearchBar
  placeholder="Search electors..."
  onSearch={handleSearch}
  debounce={300}
  fullWidth
/>
```

#### DatePicker
```typescript
import { DatePicker } from '@mui/x-date-pickers';

interface CustomDatePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  error?: boolean;
  helperText?: string;
}

// Usage
<DatePicker
  label="Election Date"
  value={selectedDate}
  onChange={handleDateChange}
  minDate={new Date()}
/>
```

---

### Modal Components

#### ConfirmDialog
```typescript
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  severity?: 'warning' | 'error' | 'info';
}

// Usage
<ConfirmDialog
  open={showDialog}
  title="Delete Election"
  message="Are you sure you want to delete this election? This action cannot be undone."
  onConfirm={handleDelete}
  onCancel={() => setShowDialog(false)}
  confirmText="Delete"
  severity="error"
/>
```

---

## Feature Components

### Elections

#### ElectionCard
```typescript
interface ElectionCardProps {
  election: Election;
  onSelect?: (election: Election) => void;
  onEdit?: (election: Election) => void;
  showActions?: boolean;
}

// Usage
<ElectionCard
  election={currentElection}
  onSelect={handleSelect}
  onEdit={handleEdit}
  showActions
/>
```

#### CommitteeList
```typescript
interface CommitteeListProps {
  committees: Committee[];
  selectedCommittee?: Committee;
  onSelectCommittee: (committee: Committee) => void;
  groupBy?: 'gender' | 'none';
}

// Usage
<CommitteeList
  committees={committees}
  selectedCommittee={selected}
  onSelectCommittee={setSelected}
  groupBy="gender"
/>
```

---

### Electors

#### ElectorProfile
```typescript
interface ElectorProfileProps {
  elector: Elector;
  showFullDetails?: boolean;
  actions?: React.ReactNode;
}

// Usage
<ElectorProfile
  elector={selectedElector}
  showFullDetails
  actions={<EditButton />}
/>
```

#### ElectorSearchResults
```typescript
interface ElectorSearchResultsProps {
  results: Elector[];
  loading: boolean;
  onSelectElector: (elector: Elector) => void;
  emptyMessage?: string;
}

// Usage
<ElectorSearchResults
  results={searchResults}
  loading={searching}
  onSelectElector={handleSelect}
  emptyMessage="No electors found"
/>
```

---

### Candidates

#### CandidateCard
```typescript
interface CandidateCardProps {
  candidate: Candidate;
  showVotes?: boolean;
  showParty?: boolean;
  onVote?: (candidate: Candidate) => void;
}

// Usage
<CandidateCard
  candidate={candidate}
  showVotes
  showParty
  onVote={handleVote}
/>
```

#### PartyBadge
```typescript
interface PartyBadgeProps {
  party: Party;
  size?: 'small' | 'medium' | 'large';
  showFullName?: boolean;
}

// Usage
<PartyBadge
  party={party}
  size="medium"
  showFullName
/>
```

---

### Guarantees

#### GuaranteeStatusChip
```typescript
interface GuaranteeStatusChipProps {
  status: 'STRONG' | 'MEDIUM' | 'WEAK';
  size?: 'small' | 'medium';
}

// Usage
<GuaranteeStatusChip
  status={guarantee.status}
  size="small"
/>
```

#### GuaranteeGroupCard
```typescript
interface GuaranteeGroupCardProps {
  group: GuaranteeGroup;
  guaranteeCount: number;
  onClick?: () => void;
}

// Usage
<GuaranteeGroupCard
  group={group}
  guaranteeCount={25}
  onClick={handleGroupClick}
/>
```

---

### Attendance

#### AttendanceMarkButton
```typescript
interface AttendanceMarkButtonProps {
  elector: Elector;
  onMark: (electorId: string) => Promise<void>;
  disabled?: boolean;
}

// Usage
<AttendanceMarkButton
  elector={elector}
  onMark={handleMarkAttendance}
  disabled={alreadyMarked}
/>
```

#### AttendanceStatistics
```typescript
interface AttendanceStatisticsProps {
  committee: Committee;
  showHourlyBreakdown?: boolean;
}

// Usage
<AttendanceStatistics
  committee={selectedCommittee}
  showHourlyBreakdown
/>
```

---

### Voting

#### VoteEntryForm
```typescript
interface VoteEntryFormProps {
  candidates: Candidate[];
  committee: Committee;
  onSubmit: (votes: VoteData[]) => Promise<void>;
}

// Usage
<VoteEntryForm
  candidates={candidates}
  committee={committee}
  onSubmit={handleSubmitVotes}
/>
```

#### ResultsSummary
```typescript
interface ResultsSummaryProps {
  results: ElectionResults;
  showDetails?: boolean;
}

// Usage
<ResultsSummary
  results={electionResults}
  showDetails
/>
```

---

## Layout Components

### MainLayout
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Breadcrumb[];
}

// Usage
<MainLayout
  title="Elections"
  breadcrumbs={[
    { label: 'Home', path: '/' },
    { label: 'Elections', path: '/elections' },
  ]}
>
  {children}
</MainLayout>
```

### Sidebar
```typescript
interface SidebarProps {
  open: boolean;
  onClose: () => void;
  userRole: UserRole;
}

// Usage
<Sidebar
  open={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  userRole={user.role}
/>
```

### Header
```typescript
interface HeaderProps {
  title: string;
  user: User;
  onMenuClick: () => void;
  onLogout: () => void;
}

// Usage
<Header
  title="Election Management"
  user={currentUser}
  onMenuClick={toggleSidebar}
  onLogout={handleLogout}
/>
```

---

## Loading States

### LoadingSpinner
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  message?: string;
}

// Usage
<LoadingSpinner
  size="large"
  fullPage
  message="Loading election data..."
/>
```

### Skeleton Components
```typescript
// For card loading
<Skeleton variant="rectangular" width="100%" height={200} />

// For text loading
<Skeleton variant="text" width="80%" />

// For circular avatar loading
<Skeleton variant="circular" width={40} height={40} />
```

---

## Empty States

### EmptyState
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Usage
<EmptyState
  icon={<InboxIcon />}
  title="No elections found"
  description="Create your first election to get started"
  action={{
    label: "Create Election",
    onClick: handleCreate
  }}
/>
```

---

## Error States

### ErrorAlert
```typescript
interface ErrorAlertProps {
  error: string | Error;
  onRetry?: () => void;
  onDismiss?: () => void;
}

// Usage
<ErrorAlert
  error={error}
  onRetry={refetch}
  onDismiss={() => setError(null)}
/>
```

---

## Best Practices

### Component Design
- ✅ Keep components focused and single-purpose
- ✅ Use composition over inheritance
- ✅ Provide sensible defaults for props
- ✅ Make components controlled when possible
- ✅ Document all props with TypeScript
- ✅ Handle loading, error, and empty states

### Props Design
- ✅ Use optional props for flexibility
- ✅ Provide TypeScript interfaces
- ✅ Use descriptive prop names
- ✅ Avoid prop drilling (use context when needed)
- ✅ Validate props with PropTypes or TypeScript

### Performance
- ✅ Use React.memo() for expensive components
- ✅ Implement proper key props
- ✅ Avoid inline function definitions
- ✅ Use useCallback and useMemo appropriately
- ✅ Lazy load heavy components

---

## Component Testing

### Example Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ElectionCard } from './ElectionCard';

describe('ElectionCard', () => {
  const mockElection = {
    id: 1,
    name: 'Test Election',
    status: 'VOTING_DAY',
  };

  it('renders election information', () => {
    render(<ElectionCard election={mockElection} />);
    
    expect(screen.getByText('Test Election')).toBeInTheDocument();
    expect(screen.getByText('VOTING_DAY')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const handleSelect = jest.fn();
    render(
      <ElectionCard 
        election={mockElection} 
        onSelect={handleSelect} 
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleSelect).toHaveBeenCalledWith(mockElection);
  });
});
```

---

## Adding New Components

### Checklist
1. Create component file with .tsx extension
2. Define TypeScript interface for props
3. Add JSDoc documentation
4. Implement component with proper typing
5. Handle loading/error/empty states
6. Add to this documentation
7. Write unit tests
8. Export from index.ts

### Template
```typescript
/**
 * ComponentName - Brief description
 * 
 * @component
 * @example
 * ```tsx
 * <ComponentName 
 *   prop1={value1}
 *   prop2={value2}
 * />
 * ```
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2,
  ...rest
}) => {
  // Implementation
  
  return (
    // JSX
  );
};
```

---

**Maintained by**: Frontend Team  
**Last Updated**: October 27, 2025

