# API URLs - Quick Reference for Frontend

**Base URL:** `http://127.0.0.1:8000` ✅  
**NOT:** ~~`http://127.0.0.1:8000/api/`~~ ❌

---

## 🔐 Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout  
- `POST /api/auth/refresh/` - Refresh token

## 👤 Users
- `GET /api/users/me/` - **Current user profile** ✅
- `GET /api/users/` - List users
- `POST /api/users/` - Create user (admin)
- `GET /api/users/{id}/` - Get user
- `PATCH /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user (admin)
- `POST /api/users/{id}/change-password/` - Change password

## 🗳️ Elections
- `GET /api/election/` - List elections
- `GET /api/election/current/` - **Get active election** ✅
- `POST /api/election/` - Create election (admin)
- `GET /api/election/{id}/` - Get election
- `PATCH /api/election/{id}/` - Update election (admin)

## 🏢 Committees
- `GET /api/election/committees/` - List committees
- `POST /api/election/committees/` - Create committee (admin)
- `GET /api/election/committees/{id}/` - Get committee
- `GET /api/election/committees/{id}/electors/` - Committee electors
- `GET /api/election/committees/{id}/statistics/` - Statistics

## 👥 Electors (Voters)
- `GET /api/electors/` - List electors
- `POST /api/electors/` - Create elector (admin)
- `GET /api/electors/{koc_id}/` - Get elector
- `PATCH /api/electors/{koc_id}/` - Update elector (admin)
- `POST /api/electors/import/` - Import CSV (admin)
- `GET /api/electors/export/` - Export CSV

## 🎯 Candidates & Parties
- `GET /api/voting/candidates/` - List candidates
- `POST /api/voting/candidates/` - Create candidate (admin)
- `GET /api/voting/candidates/{id}/` - Get candidate
- `GET /api/voting/parties/` - List parties
- `POST /api/voting/parties/` - Create party (admin)

## 📊 Vote Counting
- `GET /api/voting/vote-counts/` - List vote counts
- `POST /api/voting/vote-counts/` - Create vote count
- `POST /api/voting/vote-counts/bulk-entry/` - Bulk entry
- `PATCH /api/voting/vote-counts/{id}/verify/` - Verify (admin)
- `GET /api/voting/results/{election_id}/` - Get results
- `POST /api/voting/results/generate/` - Generate results (admin)

## ✅ Guarantees
- `GET /api/guarantees/` - List guarantees
- `POST /api/guarantees/` - Create guarantee
- `GET /api/guarantees/{id}/` - Get guarantee
- `PATCH /api/guarantees/{id}/` - Update guarantee

## 📝 Attendance
- `GET /api/attendance/` - List attendance
- `POST /api/attendance/mark/` - Mark attendance
- `POST /api/attendance/bulk-mark/` - Bulk mark
- `GET /api/attendance/statistics/` - Statistics

## 📈 Reports
- `GET /api/reports/` - List reports
- `POST /api/reports/generate/` - Generate report
- `GET /api/reports/{id}/download/` - Download report

---

## 🔧 Update Frontend Axios Config

**File:** `frontend/src/utils/axios.ts`

```typescript
const axiosServices = axios.create({ 
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:8000/' 
});
// No /api/ at the end! ✅
```

---

## 📦 Standard Response Format

```typescript
// Success
{
  "status": "success",
  "data": { ... },
  "message": "Success message"
}

// Error
{
  "status": "error",
  "data": null,
  "message": "Error message",
  "errors": { "field": ["Error detail"] }
}

// Paginated
{
  "count": 100,
  "next": "url",
  "previous": null,
  "results": [ ... ]
}
```

---

## 🔑 Authorization Header

```typescript
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

---

## ⚠️ Breaking Changes

### ❌ Removed (Old Business System)
- `/api/account/profile/` - **DOES NOT EXIST**
- `/api/business/` - Removed
- `/api/locations/` - Removed
- All `primary_business_id` fields - Removed
- All `primary_location_id` fields - Removed

### ✅ Use Instead
- `/api/users/me/` - For current user profile

---

## 🎭 User Roles
- `SUPER_ADMIN` - Full access
- `ADMIN` - Management access
- `SUPERVISOR` - Team oversight
- `USER` - Basic user (guarantee collector)

---

## 🧪 Quick Test

```bash
# Login
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Get profile
curl http://127.0.0.1:8000/api/users/me/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get current election
curl http://127.0.0.1:8000/api/election/current/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Full Documentation:** See `backend/API-ENDPOINTS-REFERENCE.md`

**Updated:** October 24, 2025

