# Entity Tags Components

Reusable tags display and management components for any entity type (Client, Contact, Order, etc.)

## Components

### EntityTagsDisplay

A comprehensive tags display and management component with inline display and dialog-based editing.

## Usage

### Basic Example

```tsx
import { EntityTagsDisplay } from 'shared/components';
import { updateClientApi } from 'helpers/clients_api_helper';

<EntityTagsDisplay
  tags={client.tags || []}
  entityId={client.id}
  maxDisplayTags={3}
  updateApiCall={updateClientApi}
  onUpdate={(newTags) => console.log('Tags updated:', newTags)}
/>
```

### With Custom Styling

```tsx
<EntityTagsDisplay
  tags={contact.tags || []}
  entityId={contact.id}
  maxDisplayTags={5}
  updateApiCall={updateContactApi}
  size="medium"
  variant="outlined"
  showManageButton={false}
/>
```

### Read-Only Mode

```tsx
<EntityTagsDisplay
  tags={order.tags || []}
  entityId={order.id}
  updateApiCall={updateOrderApi}
  readonly={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tags` | `string[]` | `[]` | Array of tag strings to display |
| `entityId` | `number` | required | ID of the entity for API calls |
| `maxDisplayTags` | `number` | `3` | Maximum number of tags to show inline |
| `onUpdate` | `(tags: string[]) => void` | optional | Callback after successful update |
| `updateApiCall` | `(id, data) => Promise<any>` | required | API function to update tags |
| `size` | `'small' \| 'medium'` | `'small'` | Size of the chips |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Chip variant style |
| `showManageButton` | `boolean` | `true` | Show "Manage Tags" button |
| `readonly` | `boolean` | `false` | Disable editing functionality |

## Features

- ✅ Inline display of tags with configurable limit
- ✅ "+X more" indicator for additional tags
- ✅ "Manage Tags" button with dashed border
- ✅ Full-featured dialog for tag management
- ✅ Add tags with Enter key support
- ✅ Remove tags with delete icon
- ✅ Prevents duplicate tags
- ✅ Backend API integration
- ✅ Loading states during save
- ✅ Responsive design
- ✅ Theme-aware styling
- ✅ Read-only mode for view-only contexts

## Integration Example

### Client Module

```tsx
// ClientHeader.tsx
import { EntityTagsDisplay } from 'shared/components';
import { patchClientApi } from 'helpers/clients_api_helper';

<EntityTagsDisplay
  tags={client.tags || []}
  entityId={client.id}
  maxDisplayTags={3}
  updateApiCall={patchClientApi}  // Use PATCH to update only tags
  onUpdate={handleTagsUpdate}
/>
```

### Contact Module

```tsx
// ContactHeader.tsx
import { EntityTagsDisplay } from 'shared/components';
import { patchContactApi } from 'helpers/contacts_api_helper';

<EntityTagsDisplay
  tags={contact.tags || []}
  entityId={contact.id}
  maxDisplayTags={3}
  updateApiCall={patchContactApi}  // Use PATCH for partial update
  onUpdate={(tags) => setContact({ ...contact, tags })}
/>
```

### Order Module

```tsx
// OrderDetails.tsx
import { EntityTagsDisplay } from 'shared/components';
import { patchOrderApi } from 'helpers/orders_api_helper';

<EntityTagsDisplay
  tags={order.tags || []}
  entityId={order.id}
  maxDisplayTags={2}
  updateApiCall={patchOrderApi}  // Use PATCH for partial update
  variant="outlined"
/>
```

## Styling Customization

The component uses theme-aware styling and can be customized through the MUI theme:

- Primary color for filled tags
- Grey tones for "+X more" indicator
- Hover effects matching theme
- Consistent spacing and borders

## API Requirements

The `updateApiCall` function should:
- Accept `(entityId: number, data: { tags: string[] })` parameters
- Return a Promise that resolves on success
- Throw an error on failure
- **Recommended**: Use PATCH for partial updates to avoid clearing other fields

Example (Recommended - using PATCH):
```ts
export const patchClientApi = async (id: number, data: any) => {
  const response = await APIClient.patch(`/clients/updateClient/${id}/`, data);
  return response;
};
```

Example (Alternative - using PUT):
```ts
export const updateClientApi = async (id: number, data: any) => {
  const response = await APIClient.put(`/clients/updateClient/${id}/`, data);
  return response;
};
```

**Important**: When using PUT, ensure the backend doesn't null out fields not included in the request. PATCH is preferred for updating only tags.

