# URL Constants Naming Convention

## Pattern

### Static Constants (UPPER_SNAKE_CASE)
Use `UPPER_SNAKE_CASE` for static string constants that don't require parameters:

```typescript
export const ELECTORS_LIST = '/api/electors/';
export const GUARANTEES_CREATE = '/api/guarantees/';
export const USERS_EXPORT_CSV = '/api/users/export-csv/';
```

### Functions (camelCase)
Use `camelCase` for functions that take parameters and return dynamic URLs:

```typescript
export const electorDetail = (kocId: string) => `/api/electors/${kocId}/`;
export const userUpdate = (id: number) => `/api/users/${id}/`;
export const guaranteeConfirm = (id: number) => `/api/guarantees/${id}/confirm/`;
```

## Usage

```typescript
import * as URL from '../urls/electors';

// Static constant
const response = await axios.get(URL.ELECTORS_LIST);

// Function with parameter
const response = await axios.get(URL.electorDetail('KOC123'));
```

## Rationale

- **Constants**: UPPER_SNAKE_CASE clearly indicates these are immutable static values
- **Functions**: camelCase follows TypeScript/JavaScript function naming conventions
- **Distinction**: Makes it immediately clear what requires parameters vs what doesn't

