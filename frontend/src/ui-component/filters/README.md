# Premium FilterBar Component

A beautifully designed, reusable filter bar component with modern UI/UX.

## Features

✨ **Premium Design**
- Subtle gradient background
- Smooth hover effects & transitions
- Elevated shadows on interaction
- Consistent border radius & spacing
- Professional color scheme

🎯 **Highly Configurable**
- Dynamic filters (select, text, date, autocomplete)
- Customizable search field
- Flexible action buttons
- Active filters indicator
- Clear all filters functionality

📱 **Responsive**
- Mobile-first design
- Adaptive layout for all screen sizes
- Touch-friendly controls

♻️ **Reusable**
- Single component for all list pages
- Consistent UX across application
- Easy to maintain

## Usage

### Basic Example

```tsx
import { FilterBar } from 'ui-component/filters';

<FilterBar
  searchPlaceholder="Search items..."
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  actions={[
    {
      label: 'Add Item',
      onClick: handleCreate,
      variant: 'contained',
      startIcon: <AddIcon />
    }
  ]}
/>
```

### Advanced Example with Filters

```tsx
<FilterBar
  // Search
  searchPlaceholder="Search by name or email..."
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  onSearchSubmit={handleSearch}
  
  // Filters
  filters={[
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      value: roleFilter,
      onChange: handleRoleChange,
      options: [
        { value: '', label: 'All Roles' },
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' }
      ]
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      value: statusFilter,
      onChange: handleStatusChange,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ]}
  
  // Active filters indicator
  activeFiltersCount={activeFiltersCount}
  onClearFilters={handleClearFilters}
  
  // Actions
  actions={[
    {
      label: 'Export',
      onClick: handleExport,
      variant: 'outlined',
      startIcon: <DownloadIcon />
    },
    {
      label: 'Add User',
      onClick: handleCreate,
      variant: 'contained',
      startIcon: <AddIcon />
    }
  ]}
/>
```

## Props

### FilterBarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchPlaceholder` | `string` | `"Search..."` | Placeholder text for search input |
| `searchValue` | `string` | `""` | Current search value |
| `onSearchChange` | `(value: string) => void` | - | Callback when search value changes |
| `onSearchSubmit` | `() => void` | - | Callback when Enter is pressed in search |
| `showSearch` | `boolean` | `true` | Show/hide search field |
| `filters` | `FilterConfig[]` | `[]` | Array of filter configurations |
| `activeFiltersCount` | `number` | `0` | Number of active filters (for indicator) |
| `onClearFilters` | `() => void` | - | Callback to clear all filters |
| `actions` | `Action[]` | `[]` | Array of action buttons |
| `dense` | `boolean` | `false` | Compact mode (smaller padding) |
| `elevation` | `number` | `0` | Paper elevation |
| `sx` | `object` | `{}` | Custom MUI sx styles |

### FilterConfig

```typescript
interface FilterConfig {
  name: string;                    // Unique filter name
  label: string;                   // Display label
  type: 'select' | 'text' | 'date' | 'autocomplete';
  value: any;                      // Current value
  onChange: (value: any) => void;  // Change handler
  options?: Array<{                // For select type
    value: string | number;
    label: string;
  }>;
  placeholder?: string;            // For text type
  disabled?: boolean;              // Disabled state
  icon?: React.ReactNode;          // Optional icon
}
```

### Action Configuration

```typescript
interface Action {
  label: string;                   // Button text
  onClick: () => void;             // Click handler
  icon?: React.ReactNode;          // Optional icon
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  disabled?: boolean;              // Disabled state
  startIcon?: React.ReactNode;     // Icon before text
}
```

## Design Features

### Visual Enhancements

1. **Gradient Background**: Subtle linear gradient for depth
2. **Hover Effects**: Smooth color transitions on hover
3. **Focus States**: Blue shadow ring on focus (a11y)
4. **Button Elevation**: Buttons lift on hover
5. **Rounded Corners**: Consistent 12px border radius
6. **Clear Icons**: Easy-to-clear search with X button

### Responsive Behavior

- **Desktop**: Filters in a single row
- **Tablet**: Flexible wrapping
- **Mobile**: Stacked layout

### Active Filters Indicator

When filters are active, shows:
- Filter icon
- Count of active filters
- "Clear all" chip button
- Fade-in animation

## Examples in Project

### Users Management
```tsx
// src/views/users/UsersList.tsx
<FilterBar
  searchPlaceholder="Search by name or email..."
  filters={[
    { name: 'role', label: 'Role', type: 'select', ... },
    { name: 'status', label: 'Status', type: 'select', ... }
  ]}
  actions={[
    { label: 'Export', variant: 'outlined', ... },
    { label: 'Add User', variant: 'contained', ... }
  ]}
/>
```

### Electors List
```tsx
// src/views/electors/ElectorsList.tsx
<FilterBar
  searchPlaceholder="Search electors..."
  filters={[
    { name: 'committee', label: 'Committee', type: 'select', ... },
    { name: 'status', label: 'Status', type: 'select', ... }
  ]}
  actions={[
    { label: 'Import', variant: 'outlined', ... },
    { label: 'Add Elector', variant: 'contained', ... }
  ]}
/>
```

### Guarantees List
```tsx
// src/views/guarantees/Guarantees.tsx
<FilterBar
  searchPlaceholder="Search guarantees..."
  filters={[
    { name: 'strength', label: 'Strength', type: 'select', ... },
    { name: 'group', label: 'Group', type: 'select', ... },
    { name: 'followUp', label: 'Follow-up', type: 'select', ... }
  ]}
  actions={[
    { label: 'Manage Groups', variant: 'outlined', ... },
    { label: 'Add Guarantee', variant: 'contained', ... }
  ]}
/>
```

## Customization

### Custom Styling

```tsx
<FilterBar
  sx={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderColor: 'primary.main',
    borderRadius: 3,
    p: 3
  }}
/>
```

### Dense Mode

```tsx
<FilterBar
  dense
  // Reduces padding and uses smaller components
/>
```

### With Elevation

```tsx
<FilterBar
  elevation={2}
  // Adds shadow elevation
/>
```

## Migration Guide

### Before (Old Style)
```tsx
<Box sx={{ mb: 3 }}>
  <Grid container spacing={2} alignItems="center">
    <Grid size={{ xs: 12, md: 4 }}>
      <TextField
        fullWidth
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    </Grid>
    <Grid size={{ xs: 12, md: 2 }}>
      <TextField select fullWidth label="Role" ...>
        <MenuItem value="">All</MenuItem>
        ...
      </TextField>
    </Grid>
    ...
  </Grid>
</Box>
```

### After (New Style)
```tsx
<FilterBar
  searchPlaceholder="Search..."
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  filters={[
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      value: roleFilter,
      onChange: handleRoleChange,
      options: [
        { value: '', label: 'All' },
        ...
      ]
    }
  ]}
/>
```

## Benefits

### For Users
- 🎨 Beautiful, modern interface
- ⚡ Fast, responsive interactions
- 📱 Works great on mobile
- ♿ Accessible (keyboard navigation, focus states)

### For Developers
- 🔧 Single source of truth
- 📦 Consistent behavior across app
- 🚀 Quick to implement
- 🛠️ Easy to maintain
- 📚 Well documented
- ✅ Type-safe (TypeScript)

## Best Practices

1. **Keep filters minimal** - Only show essential filters
2. **Use clear labels** - Make filter purpose obvious
3. **Provide clear all** - Always allow resetting filters
4. **Show active count** - Help users understand state
5. **Group related actions** - Export/Import together
6. **Primary action last** - "Add" button should be rightmost

## Accessibility

- ✅ Keyboard navigation supported
- ✅ Focus indicators visible
- ✅ ARIA labels on interactive elements
- ✅ High contrast mode compatible
- ✅ Screen reader friendly

---

**Created**: October 27, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready






