# Shared Components - Quick Reference Guide

**Quick access guide for developers** 🚀

---

## 🎯 Most Used Components

### DeleteConfirmationDialog ⭐ NEW

**When to use**: Any delete/remove action

```tsx
import { DeleteConfirmationDialog } from 'shared/components';

<DeleteConfirmationDialog
  open={showDelete}
  title="Delete Item"
  itemName="Item Name"
  itemType="item"
  warningMessage="Optional custom warning"
  isDeleting={isDeleting}
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
```

**Use cases**: Products, Users, Parties, Candidates, Committees, Electors, Guarantees

---

### StatCard ⭐ NEW

**When to use**: Dashboard statistics, key metrics

```tsx
import { StatCard, StatCardGradients } from 'shared/components';

<StatCard
  icon={<IconUsers size={32} />}
  value="1,234"
  label="Total Users"
  gradient={StatCardGradients.primary}
  trend={{ value: "+12%", isPositive: true }}
  subtitle="vs last month"
/>
```

**Gradients**: primary, success, info, warning, pink, blue, orange, green, teal, coral, sunset, ocean

---

### PremiumCard

**When to use**: Main content containers

```tsx
import { PremiumCard } from 'shared/components';

<PremiumCard color="primary" variant="gradient" hover>
  {/* Content */}
</PremiumCard>
```

---

### MetricCard

**When to use**: Detailed KPI displays with actions

```tsx
import { MetricCard } from 'shared/components';

<MetricCard
  title="Revenue"
  value="$52,450"
  icon={<IconCash />}
  trend={{ value: 12.5, direction: 'up' }}
  action={{ label: 'View', onClick: handleView }}
/>
```

---

### StatusChip

**When to use**: Status indicators, tags

```tsx
import { StatusChip } from 'shared/components';

<StatusChip status="Active" />
<StatusChip status="Pending" variant="outlined" />
```

**Auto-colors**: Active→Green, Pending→Orange, Error→Red, Info→Blue

---

## 📦 Component Categories

### Cards
- `PremiumCard` - Main content wrapper
- `MetricCard` - KPI displays
- `StatCard` - Compact statistics
- `PrimaryCard` - Basic card

### Modals
- `DeleteConfirmationDialog` ⭐ - Delete confirmations
- `ConfirmDialog` - General confirmations
- `ModalDialog` - Generic modal

### Forms
- `FormField` - Form inputs
- `SearchFilterBar` - Search + filters
- `DatePicker` - Date selection
- `FileUpload` - File uploads

### Tables
- `DataTable` - Full-featured table
- `TableContainer` - Table wrapper

### States
- `LoadingState` - Skeleton loading
- `ErrorState` - Error display
- `EmptyState` - No data

---

## 🎨 Design Tokens

### Colors
```tsx
'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
```

### StatCard Gradients
```tsx
StatCardGradients.primary   // Purple
StatCardGradients.success   // Green
StatCardGradients.info      // Blue
StatCardGradients.warning   // Orange
StatCardGradients.pink      // Pink
StatCardGradients.coral     // Coral
```

---

## 📋 Common Patterns

### Pattern 1: Delete Item

```tsx
const [itemToDelete, setItemToDelete] = useState(null);
const [showDelete, setShowDelete] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = async () => {
  setIsDeleting(true);
  try {
    await deleteItem(itemToDelete.id);
    // Success
    setShowDelete(false);
  } finally {
    setIsDeleting(false);
  }
};

// In render:
<DeleteConfirmationDialog
  open={showDelete}
  title="Delete Item"
  itemName={itemToDelete?.name}
  itemType="item"
  isDeleting={isDeleting}
  onConfirm={handleDelete}
  onCancel={() => setShowDelete(false)}
/>
```

### Pattern 2: Dashboard Stats

```tsx
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={3}>
    <StatCard
      icon={<IconUsers size={32} />}
      value="1,234"
      label="Total Users"
      gradient={StatCardGradients.primary}
    />
  </Grid>
  {/* More cards... */}
</Grid>
```

### Pattern 3: Status Display

```tsx
<StatusChip status={user.isActive ? "Active" : "Inactive"} />
```

---

## ⚡ Quick Tips

### DO ✅
- Import from `'shared/components'`
- Use TypeScript types
- Use gradient presets
- Follow component patterns
- Check Storybook first

### DON'T ❌
- Create duplicate components
- Hardcode colors
- Ignore prop types
- Skip accessibility
- Bypass shared components

---

## 🔗 Links

- **Storybook**: http://localhost:6006
- **Full Guide**: `/docs/frontend/SHARED-COMPONENTS-GUIDE.md`
- **README**: `/frontend/src/shared/components/README.md`
- **Completion Report**: `/docs/frontend/COMPONENT-EXTRACTION-COMPLETION.md`

---

## 📞 Need Help?

1. Check Storybook examples
2. Read component README
3. See usage in Election module
4. Check this quick reference

---

**Updated**: November 2, 2025  
**Components**: 52+  
**Status**: Production Ready ✅

