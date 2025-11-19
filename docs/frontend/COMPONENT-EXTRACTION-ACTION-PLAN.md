# Component Extraction Action Plan

**Created**: November 2, 2025  
**Priority**: HIGH  
**Estimated Time**: 2-3 hours

---

## 🎯 Objective

Extract reusable components from the Election module to the shared components library to promote code reuse across the entire project.

---

## 📋 Components to Extract

### 1. DeleteConfirmationDialog ⚡ HIGH PRIORITY

**Current Location**: `frontend/src/views/election/components/DeleteConfirmationDialog.tsx`  
**New Location**: `frontend/src/shared/components/modals/DeleteConfirmationDialog.tsx`  
**Estimated Time**: 45 minutes

**Why Extract**:
- ✅ Already 100% generic
- ✅ No election-specific logic
- ✅ Better than existing `DeleteModal.tsx`
- ✅ Can be used in all modules (users, products, electors, candidates, committees, etc.)

**Benefits**:
- Consistent delete UX across all modules
- Single source of truth for delete confirmations
- Reduces code duplication by ~60 lines per usage
- Improves maintainability

---

### 2. StatCard Component ⚡ MEDIUM PRIORITY

**Current Location**: Embedded in `frontend/src/views/election/components/DashboardView.tsx` (lines 62-127)  
**New Location**: `frontend/src/shared/components/cards/StatCard.tsx`  
**Estimated Time**: 30 minutes

**Why Extract**:
- ✅ Useful for any dashboard
- ✅ No election-specific logic
- ✅ Complements existing `MetricCard`
- ✅ Beautiful gradient-based design

**Benefits**:
- Reusable across all dashboards
- Alternative to MetricCard for different use cases
- Consistent statistics display
- Easy to customize with gradients

---

## 🔧 Extraction Steps

### Phase 1: Extract DeleteConfirmationDialog (45 minutes)

#### Step 1.1: Move Component (10 minutes)

```bash
# Create backup
cp frontend/src/views/election/components/DeleteConfirmationDialog.tsx \
   frontend/src/views/election/components/DeleteConfirmationDialog.tsx.bak

# Move to shared
mv frontend/src/views/election/components/DeleteConfirmationDialog.tsx \
   frontend/src/shared/components/modals/DeleteConfirmationDialog.tsx
```

#### Step 1.2: Update Exports (5 minutes)

Edit `frontend/src/shared/components/index.ts`:
```typescript
// Add to modals section
export { default as DeleteConfirmationDialog } from './modals/DeleteConfirmationDialog';
export type { DeleteConfirmationDialogProps } from './modals/DeleteConfirmationDialog';
```

Edit `frontend/src/shared/components/modals/DeleteConfirmationDialog.tsx`:
```typescript
// Add export for props interface
export interface DeleteConfirmationDialogProps {
  open: boolean;
  title: string;
  itemName: string;
  itemType: string;
  warningMessage?: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
```

#### Step 1.3: Update Import in CurrentElection (5 minutes)

Edit `frontend/src/views/election/CurrentElection.tsx`:
```typescript
// Change from:
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';

// To:
import { DeleteConfirmationDialog } from 'shared/components';
```

#### Step 1.4: Create Storybook Story (15 minutes)

Create `frontend/src/shared/components/modals/DeleteConfirmationDialog.stories.tsx`:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { IconTrash } from '@tabler/icons-react';

const meta: Meta<typeof DeleteConfirmationDialog> = {
  title: 'Components/Modals/DeleteConfirmationDialog',
  component: DeleteConfirmationDialog,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof DeleteConfirmationDialog>;

export const Default: Story = {
  args: {
    open: true,
    title: 'Delete Item',
    itemName: 'Sample Item',
    itemType: 'item',
    isDeleting: false,
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled')
  }
};

export const Party: Story = {
  args: {
    open: true,
    title: 'Delete Party',
    itemName: 'Democratic Party',
    itemType: 'party',
    warningMessage: 'This will permanently delete this party and all associated data.',
    isDeleting: false,
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled')
  }
};

export const User: Story = {
  args: {
    open: true,
    title: 'Remove User from Election',
    itemName: 'John Doe',
    itemType: 'user',
    warningMessage: 'This will remove this user from the election. They will no longer be assigned to any committees.',
    isDeleting: false,
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled')
  }
};

export const Deleting: Story = {
  args: {
    open: true,
    title: 'Delete Product',
    itemName: 'iPhone 15 Pro',
    itemType: 'product',
    isDeleting: true,
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled')
  }
};

export const Candidate: Story = {
  args: {
    open: true,
    title: 'Delete Candidate',
    itemName: 'Jane Smith',
    itemType: 'candidate',
    warningMessage: 'This action cannot be undone. All candidate data will be permanently removed.',
    isDeleting: false,
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled')
  }
};

export const Committee: Story = {
  args: {
    open: true,
    title: 'Delete Committee',
    itemName: 'M1 Committee',
    itemType: 'committee',
    warningMessage: 'This will permanently delete this committee. All associated data will be removed.',
    isDeleting: false,
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled')
  }
};
```

#### Step 1.5: Test (10 minutes)

1. Run frontend: `npm run dev`
2. Test in Election page - delete party, candidate, committee, user
3. Run Storybook: `npm run storybook`
4. Verify all stories work correctly
5. Check for linting errors

---

### Phase 2: Extract StatCard (30 minutes)

#### Step 2.1: Create New Component (15 minutes)

Create `frontend/src/shared/components/cards/StatCard.tsx`:
```typescript
/**
 * StatCard Component
 * Compact statistic card with gradient background and trend indicator
 */

import React from 'react';
import { Paper, Stack, Box, Typography, Chip, alpha, useTheme, SxProps, Theme } from '@mui/material';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

export interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  gradient: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, gradient, trend, subtitle, onClick, sx }) => {
  const theme = useTheme();

  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 3,
        background: gradient,
        color: 'white',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          transition: 'transform 0.3s ease',
          boxShadow: onClick ? 6 : 4
        },
        ...sx
      }}
    >
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>{icon}</Box>
          {trend && (
            <Chip
              icon={trend.isPositive ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />}
              label={trend.value}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600
              }}
            />
          )}
        </Box>

        <Typography variant="h3" fontWeight={700} sx={{ color: 'white' }}>
          {value}
        </Typography>

        <Typography variant="body2" sx={{ color: alpha('#fff', 0.9), fontWeight: 500 }}>
          {label}
        </Typography>

        {subtitle && (
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default StatCard;

// Gradient Presets
export const StatCardGradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  pink: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  blue: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  orange: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  green: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  teal: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
};
```

#### Step 2.2: Update Exports (2 minutes)

Edit `frontend/src/shared/components/index.ts`:
```typescript
// Add to cards section
export { default as StatCard, StatCardGradients } from './cards/StatCard';
export type { StatCardProps } from './cards/StatCard';
```

Edit `frontend/src/shared/components/cards/index.ts`:
```typescript
export { default as StatCard, StatCardGradients } from './StatCard';
export type { StatCardProps } from './StatCard';
```

#### Step 2.3: Update DashboardView (5 minutes)

Edit `frontend/src/views/election/components/DashboardView.tsx`:
```typescript
// Add import at top
import { StatCard, StatCardGradients } from 'shared/components';

// Remove the inline StatCard component definition (lines 62-127)

// Usage remains the same, but now imported from shared
```

#### Step 2.4: Create Storybook Story (8 minutes)

Create `frontend/src/shared/components/cards/StatCard.stories.tsx`:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from '@mui/material';
import StatCard, { StatCardGradients } from './StatCard';
import { IconUsers, IconCash, IconTrendingUp, IconShoppingCart } from '@tabler/icons-react';

const meta: Meta<typeof StatCard> = {
  title: 'Components/Cards/StatCard',
  component: StatCard,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    icon: <IconUsers size={32} />,
    value: '1,234',
    label: 'Total Users',
    gradient: StatCardGradients.primary
  }
};

export const WithTrendPositive: Story = {
  args: {
    icon: <IconCash size={32} />,
    value: '$45,678',
    label: 'Total Revenue',
    gradient: StatCardGradients.success,
    trend: { value: '+12%', isPositive: true },
    subtitle: 'vs last month'
  }
};

export const WithTrendNegative: Story = {
  args: {
    icon: <IconShoppingCart size={32} />,
    value: '892',
    label: 'Total Orders',
    gradient: StatCardGradients.info,
    trend: { value: '-5%', isPositive: false },
    subtitle: 'vs last month'
  }
};

export const Clickable: Story = {
  args: {
    icon: <IconTrendingUp size={32} />,
    value: '2,456',
    label: 'Active Sessions',
    gradient: StatCardGradients.warning,
    onClick: () => alert('Card clicked!')
  }
};

export const AllGradients: Story = {
  render: () => (
    <Grid container spacing={3}>
      {Object.entries(StatCardGradients).map(([name, gradient]) => (
        <Grid item xs={12} sm={6} md={4} key={name}>
          <StatCard
            icon={<IconUsers size={28} />}
            value="1,234"
            label={`${name.charAt(0).toUpperCase()}${name.slice(1)} Theme`}
            gradient={gradient}
          />
        </Grid>
      ))}
    </Grid>
  )
};
```

---

## 📊 Testing Checklist

### DeleteConfirmationDialog
- [ ] Import works in CurrentElection.tsx
- [ ] Delete party functionality works
- [ ] Delete candidate functionality works
- [ ] Delete committee functionality works
- [ ] Delete user functionality works
- [ ] Storybook stories render correctly
- [ ] No linting errors
- [ ] Props are properly typed
- [ ] Loading state works correctly

### StatCard
- [ ] Import works in DashboardView.tsx
- [ ] All stat cards render correctly
- [ ] Gradients display properly
- [ ] Trends show correct arrows
- [ ] Hover effects work
- [ ] Clickable cards work
- [ ] Storybook stories render correctly
- [ ] No linting errors
- [ ] Exported gradients work

---

## 🎯 Success Criteria

### Functionality
- ✅ All existing features work identically
- ✅ No breaking changes in Election module
- ✅ Components are properly typed
- ✅ No linting errors

### Code Quality
- ✅ Proper TypeScript interfaces
- ✅ JSDoc comments added
- ✅ Exported from shared index
- ✅ Following shared component patterns

### Documentation
- ✅ Storybook stories created
- ✅ Usage examples provided
- ✅ Props documented
- ✅ Guide updated

### Reusability
- ✅ No module-specific logic
- ✅ Generic prop interfaces
- ✅ Can be used in other modules
- ✅ Follows DRY principle

---

## 📈 Impact Analysis

### Before Extraction
- `DeleteConfirmationDialog`: Used only in Election module
- `StatCard`: Embedded in DashboardView
- Total reusable code: 0 lines

### After Extraction
- `DeleteConfirmationDialog`: Available to all modules (Users, Electors, Candidates, Committees, Guarantees, etc.)
- `StatCard`: Available for all dashboards
- Total reusable code: ~200 lines
- Potential code reduction: 60 lines per module using DeleteConfirmationDialog

### Projected Benefits
- **5-10 modules** will benefit from DeleteConfirmationDialog
- **3-5 dashboards** will benefit from StatCard
- **Total code reduction**: Estimated 300-600 lines across the project
- **Maintenance improvement**: Single source of truth for delete confirmations
- **Consistency improvement**: Uniform delete UX across all modules

---

## 🔄 Rollback Plan

If issues are encountered:

1. **Restore from backup**:
```bash
cp frontend/src/views/election/components/DeleteConfirmationDialog.tsx.bak \
   frontend/src/views/election/components/DeleteConfirmationDialog.tsx
```

2. **Revert import in CurrentElection.tsx**:
```typescript
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
```

3. **Remove from shared**:
```bash
rm frontend/src/shared/components/modals/DeleteConfirmationDialog.tsx
rm frontend/src/shared/components/modals/DeleteConfirmationDialog.stories.tsx
rm frontend/src/shared/components/cards/StatCard.tsx
rm frontend/src/shared/components/cards/StatCard.stories.tsx
```

4. **Remove exports from index files**

---

## 📝 Next Steps After Extraction

### Short Term (This Sprint)
1. Update SHARED-COMPONENTS-GUIDE.md with new components
2. Test in Storybook
3. Verify no regressions in Election module
4. Create migration guide for other modules

### Medium Term (Next Sprint)
1. Migrate Users module to use DeleteConfirmationDialog
2. Migrate Electors module to use DeleteConfirmationDialog
3. Migrate Candidates module to use DeleteConfirmationDialog
4. Create dashboard using StatCard in other modules

### Long Term (Future Sprints)
1. Deprecate old DeleteModal.tsx
2. Extract more components from other modules
3. Create comprehensive component library
4. Build module templates using shared components

---

## 📞 Support

### Issues or Questions
- Check [SHARED-COMPONENTS-GUIDE.md](./SHARED-COMPONENTS-GUIDE.md)
- Review Storybook documentation
- Check existing implementations in Election module

### Reporting Problems
- Component not working as expected
- Import errors
- Type errors
- Styling issues

---

**Created By**: Development Team  
**Priority**: HIGH ⚡  
**Estimated Total Time**: 2-3 hours  
**Target Completion**: November 2, 2025

---

*This is a living document and will be updated as extraction progresses.*


