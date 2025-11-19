# Shared Hooks

## Overview

This directory contains reusable custom hooks that encapsulate common business logic across the application.

---

## Available Hooks

### `useEntityDetail`

Generic hook for entity detail pages.

**Use for:** Any page that displays detailed information about a single entity (Client, Order, Contact, etc.)

**See:** [SHARED-PATTERNS.md](../../../../docs/guides/SHARED-PATTERNS.md#1-useentitydetail) for full documentation

---

### `useEntityActions`

Generic hook for common entity action handlers.

**Use for:** CRUD operations, email, WhatsApp, navigation actions

**See:** [SHARED-PATTERNS.md](../../../../docs/guides/SHARED-PATTERNS.md#2-useentityactions) for full documentation

---

## Creating New Shared Hooks

When creating a new shared hook:

1. **Identify the pattern** - Is this logic used in 3+ places?
2. **Make it generic** - Use TypeScript generics for flexibility
3. **Document it** - Add JSDoc comments and examples
4. **Export it** - Add to `index.ts`
5. **Update guide** - Add to SHARED-PATTERNS.md
6. **Test it** - Use in at least 2 different modules

---

## Example: Using in Your Module

```typescript
// In your module's hook file
import { useEntityDetail, useEntityActions } from 'shared/hooks';
import { getYourEntityRequest } from 'store/yourEntity/actions';

export const useYourEntityDetail = () => {
  const { entity, loading, error, tabValue, setTabValue } = useEntityDetail({
    selector: (state) => state.yourEntity,
    fetchAction: getYourEntityRequest,
    baseRoute: '/your/base/route'
  });

  const actions = useEntityActions({
    baseRoute: '/your/base/route',
    entityId: entity?.id,
    entityEmail: entity?.email,
    entityMobile: entity?.mobile
  });

  return {
    entity,
    loading,
    error,
    tabValue,
    handlers: {
      ...actions
      // Add entity-specific handlers here
    }
  };
};
```

---

## Reference Implementation

See: `frontend/src/views/application/crm/clients/ClientDetails/hooks/useClientDetail.ts`
