# State Components

## Overview

Reusable UI components for common application states (loading, error, empty).

---

## Components

### `LoadingState`

Displays a loading spinner with a message.

**Usage:**

```typescript
import { LoadingState } from 'shared/components';

<LoadingState />
<LoadingState message="Loading orders..." minHeight={300} />
```

**See:** [SHARED-PATTERNS.md](../../../../../docs/guides/SHARED-PATTERNS.md#1-loadingstate)

---

### `ErrorState`

Displays an error alert with optional retry button.

**Usage:**

```typescript
import { ErrorState } from 'shared/components';

<ErrorState error="Failed to load" />
<ErrorState error={error} onRetry={handleRetry} />
```

**See:** [SHARED-PATTERNS.md](../../../../../docs/guides/SHARED-PATTERNS.md#2-errorstate)

---

### `EmptyState`

Displays an empty state message with optional action button.

**Usage:**

```typescript
import { EmptyState } from 'shared/components';

<EmptyState
  title="No clients found"
  message="Start by adding your first client"
  action={{ label: "Add Client", onClick: handleAdd }}
/>
```

**See:** [SHARED-PATTERNS.md](../../../../../docs/guides/SHARED-PATTERNS.md#3-emptystate)

---

## When to Use

### Use `LoadingState` when:

- ✅ Fetching data from API
- ✅ Processing a long operation
- ✅ Initializing a page

### Use `ErrorState` when:

- ✅ API request fails
- ✅ Data validation fails
- ✅ Entity not found

### Use `EmptyState` when:

- ✅ No search results
- ✅ Empty list/table
- ✅ First-time user experience

---

## Consistency

**All state components support:**

- ✅ `showCard` prop to control MainCard wrapper
- ✅ Consistent styling
- ✅ Responsive design
- ✅ Accessibility features

---

## Reference Implementation

See: `frontend/src/views/application/crm/clients/ClientDetails/index.tsx`
