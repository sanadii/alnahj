# Election Management System - API Endpoints Reference

**Base URL:** `http://127.0.0.1:8000`

**Updated:** October 24, 2025  
**Version:** 1.0 (Post-Cleanup)

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Elections](#elections)
4. [Committees](#committees)
5. [Electors](#electors)
6. [Candidates & Parties](#candidates--parties)
7. [Vote Counting](#vote-counting)
8. [Guarantees](#guarantees)
9. [Attendance](#attendance)
10. [Reports](#reports)

---

## 🔐 Authentication

### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "admin"
  }
}
```

### Logout
```http
POST /api/auth/logout/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response:
{
  "message": "Successfully logged out"
}
```

### Refresh Token
```http
POST /api/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 👥 User Management

**Base Path:** `/api/users/`

### Get Current User Profile
```http
GET /api/users/me/
Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "full_name": "John Doe",
  "phone": "+96512345678",
  "role": "admin",
  "role_display": "Admin",
  "supervisor": null,
  "supervisor_name": null,
  "teams": ["Team A", "Team B"],
  "committees": ["CAND-01"],
  "is_active": true,
  "date_joined": "2025-10-24T...",
  "last_login": "2025-10-24T...",
  "supervised_users_count": 5
}
```

### List Users (Admin Only)
```http
GET /api/users/
  ?role=admin
  &is_active=true
  &search=john
  &ordering=-date_joined
  &page=1
  &page_size=10
Authorization: Bearer {access_token}
```

### Get User by ID
```http
GET /api/users/{id}/
Authorization: Bearer {access_token}
```

### Create User (Admin Only)
```http
POST /api/users/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+96512345679",
  "role": "user",
  "supervisor": 1,
  "teams": ["Team C"],
  "committees": ["CAND-01"]
}
```

### Update User
```http
PATCH /api/users/{id}/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "first_name": "Updated Name",
  "phone": "+96512345680"
}
```

### Delete User (Admin Only)
```http
DELETE /api/users/{id}/
Authorization: Bearer {access_token}
```

### Get Supervised Users
```http
GET /api/users/supervised/
Authorization: Bearer {access_token}
```

### Change Password
```http
POST /api/users/{id}/change-password/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "old_password": "OldPass123!",
  "new_password": "NewPass123!",
  "new_password_confirm": "NewPass123!"
}
```

### Assign Supervisor (Admin Only)
```http
PATCH /api/users/{id}/assign-supervisor/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "supervisor_id": 2
}
```

### Assign Teams (Admin Only)
```http
PATCH /api/users/{id}/assign-teams/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "teams": ["Team A", "Team B", "Team C"]
}
```

### Assign Committees (Admin Only)
```http
PATCH /api/users/{id}/assign-committees/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "committees": ["CAND-01", "EK-II"]
}
```

---

## 🗳️ Elections

**Base Path:** `/api/election/`

### List Elections
```http
GET /api/election/
  ?status=SETUP
  &ordering=-created_at
  &page=1
  &page_size=10
Authorization: Bearer {access_token}
```

### Get Current/Active Election
```http
GET /api/election/current/
Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "name": "Kuwait National Assembly Election 2025",
  "description": "Demo election for testing",
  "voting_mode": "BOTH",
  "voting_mode_display": "Both Options",
  "max_candidates_per_ballot": 19,
  "allow_partial_voting": true,
  "minimum_votes_required": 1,
  "status": "SETUP",
  "status_display": "Setup",
  "guarantee_start_date": "2025-10-24",
  "guarantee_end_date": "2025-11-23",
  "voting_date": "2025-12-08",
  "committee_count": 1,
  "created_by": 1,
  "created_by_name": "System Admin",
  "created_at": "2025-10-24T...",
  "updated_at": "2025-10-24T..."
}
```

### Get Election by ID
```http
GET /api/election/{id}/
Authorization: Bearer {access_token}
```

### Create Election (Admin Only)
```http
POST /api/election/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Kuwait National Assembly Election 2026",
  "description": "National election 2026",
  "voting_mode": "BOTH",
  "max_candidates_per_ballot": 19,
  "allow_partial_voting": true,
  "minimum_votes_required": 1,
  "status": "SETUP",
  "guarantee_start_date": "2026-01-01",
  "guarantee_end_date": "2026-02-01",
  "voting_date": "2026-03-01"
}
```

### Update Election (Admin Only)
```http
PATCH /api/election/{id}/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": "GUARANTEE_PHASE"
}
```

### Delete Election (Admin Only)
```http
DELETE /api/election/{id}/
Authorization: Bearer {access_token}
```

---

## 🏢 Committees

**Base Path:** `/api/election/committees/`

### List Committees
```http
GET /api/election/committees/
  ?election=1
  &gender=MALE
  &search=CAND
  &ordering=code
  &page=1
  &page_size=10
Authorization: Bearer {access_token}
```

### Get Committee by ID
```http
GET /api/election/committees/{id}/
Authorization: Bearer {access_token}

Response:
{
  "id": 1,
  "election": 1,
  "code": "CAND-01",
  "name": "Candidates Committee",
  "gender": "MALE",
  "gender_display": "Male",
  "elector_count": 35,
  "attendance_count": 0,
  "attendance_percentage": 0.0,
  "assigned_user_count": 0,
  "statistics": {
    "total_electors": 35,
    "total_attended": 0,
    "pending": 35,
    "attendance_percentage": 0.0
  },
  "created_at": "2025-10-24T...",
  "updated_at": "2025-10-24T..."
}
```

### Create Committee (Admin Only)
```http
POST /api/election/committees/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "election": 1,
  "code": "EK-II",
  "name": "Electoral District 2",
  "gender": "MALE"
}
```

### Update Committee (Admin Only)
```http
PATCH /api/election/committees/{id}/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Updated Committee Name"
}
```

### Delete Committee (Admin Only)
```http
DELETE /api/election/committees/{id}/
Authorization: Bearer {access_token}
```

### Get Committee Electors
```http
GET /api/election/committees/{id}/electors/
Authorization: Bearer {access_token}

Response:
{
  "committee": { ... },
  "electors": [ ... ]
}
```

### Get Committee Statistics
```http
GET /api/election/committees/{id}/statistics/
Authorization: Bearer {access_token}
```

### Assign Users to Committee (Admin Only)
```http
POST /api/election/committees/{id}/assign-users/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_ids": [1, 2, 3]
}
```

---

## 👤 Electors (Voters)

**Base Path:** `/api/electors/`

### List Electors
```http
GET /api/electors/
  ?committee=1
  &gender=MALE
  &is_active=true
  &search=Ahmad
  &ordering=name_first
  &page=1
  &page_size=10
Authorization: Bearer {access_token}
```

### Get Elector by KOC ID
```http
GET /api/electors/{koc_id}/
Authorization: Bearer {access_token}

Response:
{
  "koc_id": "PA0001",
  "full_name": "Ahmad Abdullah Salem AlReformed01",
  "name_first": "Ahmad",
  "name_second": "Abdullah",
  "name_third": "Salem",
  "name_fourth": "",
  "name_fifth": "",
  "name_before_last": "",
  "name_last": "AlReformed01",
  "designation": "",
  "section": "",
  "extension": "",
  "mobile": "",
  "area": "",
  "team": "",
  "committee": 1,
  "committee_code": "CAND-01",
  "committee_name": "Candidates Committee",
  "gender": "MALE",
  "gender_display": "Male",
  "is_active": true,
  "is_walk_in": false,
  "has_attended": false,
  "created_at": "2025-10-24T...",
  "updated_at": "2025-10-24T..."
}
```

### Create Elector (Admin Only)
```http
POST /api/electors/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "koc_id": "NEW001",
  "name_first": "Ahmed",
  "name_second": "Mohammed",
  "name_third": "Ali",
  "name_last": "AlKuwait",
  "gender": "MALE",
  "committee": 1,
  "mobile": "+96512345678",
  "is_active": true
}
```

### Update Elector (Admin Only)
```http
PATCH /api/electors/{koc_id}/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "mobile": "+96512345679",
  "committee": 2
}
```

### Delete Elector (Admin Only)
```http
DELETE /api/electors/{koc_id}/
Authorization: Bearer {access_token}
```

### Import Electors (Admin Only)
```http
POST /api/electors/import/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

file: [CSV file]
```

### Export Electors
```http
GET /api/electors/export/
Authorization: Bearer {access_token}
```

---

## 🎯 Candidates & Parties

**Base Path:** `/api/candidates/`

### List Candidates
```http
GET /api/candidates/
  ?election=1
  &party=1
  &is_active=true
  &search=Ahmad
  &ordering=candidate_number
  &page=1
  &page_size=10
Authorization: Bearer {access_token}

Response:
{
  "count": 35,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "election": 1,
      "elector": "PA0001",
      "elector_name": "Ahmad Abdullah Salem AlReformed01",
      "elector_koc_id": "PA0001",
      "elector_section": "",
      "candidate_number": 1,
      "party": 1,
      "party_affiliation": "Progressive Alliance",
      "is_active": true,
      "total_votes": 0,
      "created_at": "2025-10-24T...",
      "updated_at": "2025-10-24T..."
    }
  ]
}
```

### Get Candidate by ID
```http
GET /api/candidates/{id}/
Authorization: Bearer {access_token}
```

### Create Candidate (Admin Only)
```http
POST /api/candidates/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "election": 1,
  "elector": "NEW001",
  "candidate_number": 36,
  "party": 1,
  "party_affiliation": "Progressive Alliance",
  "is_active": true
}
```

### Update Candidate (Admin Only)
```http
PATCH /api/candidates/{id}/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "is_active": false
}
```

### Delete Candidate (Admin Only)
```http
DELETE /api/candidates/{id}/
Authorization: Bearer {access_token}
```

### List Parties
```http
GET /api/candidates/parties/
  ?election=1
  &is_active=true
  &search=Progressive
  &ordering=name
Authorization: Bearer {access_token}

Response:
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "election": 1,
      "name": "Progressive Alliance",
      "abbreviation": "PA",
      "color": "#1976D2",
      "description": "Progressive political alliance...",
      "is_active": true,
      "candidate_count": 15,
      "created_at": "2025-10-24T...",
      "updated_at": "2025-10-24T..."
    }
  ]
}
```

### Create Party (Admin Only)
```http
POST /api/candidates/parties/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "election": 1,
  "name": "New Party",
  "abbreviation": "NP",
  "color": "#4CAF50",
  "description": "New political party",
  "is_active": true
}
```

---

## 📊 Vote Counting

**Base Path:** `/api/voting/`

### List Vote Counts
```http
GET /api/voting/vote-counts/
  ?election=1
  &committee=1
  &candidate=1
  &status=VERIFIED
  &is_verified=true
  &ordering=-created_at
Authorization: Bearer {access_token}
```

### Create Vote Count
```http
POST /api/voting/vote-counts/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "election": 1,
  "committee": 1,
  "candidate": 1,
  "vote_count": 150,
  "notes": "Initial count"
}
```

### Update Vote Count
```http
PATCH /api/voting/vote-counts/{id}/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "vote_count": 152,
  "notes": "Corrected count"
}
```

### Verify Vote Count (Admin Only)
```http
PATCH /api/voting/vote-counts/{id}/verify/
Authorization: Bearer {access_token}
```

### Get Vote Count Audit Log
```http
GET /api/voting/vote-counts/{id}/audit/
Authorization: Bearer {access_token}
```

### Bulk Vote Entry
```http
POST /api/voting/vote-counts/bulk-entry/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "committee_id": 1,
  "total_ballots_cast": 500,
  "invalid_ballots": 5,
  "vote_counts": [
    {"candidate_id": 1, "vote_count": 150},
    {"candidate_id": 2, "vote_count": 145},
    {"candidate_id": 3, "vote_count": 142}
  ],
  "notes": "Final count for Committee 1"
}
```

### List Committee Vote Entries
```http
GET /api/voting/committee-entries/
  ?election=1
  &committee=1
  &status=VERIFIED
Authorization: Bearer {access_token}
```

### Generate Election Results (Admin Only)
```http
POST /api/voting/results/generate/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "election_id": 1
}
```

### Get Election Results
```http
GET /api/voting/results/{election_id}/
Authorization: Bearer {access_token}
```

### Publish Results (Admin Only)
```http
POST /api/voting/results/{id}/publish/
Authorization: Bearer {access_token}
```

---

## ✅ Guarantees

**Base Path:** `/api/guarantees/`

### List Guarantees
```http
GET /api/guarantees/
  ?elector=PA0001
  &collector=1
  &status=PENDING
  &created_date_after=2025-10-01
  &ordering=-created_at
  &page=1
  &page_size=10
Authorization: Bearer {access_token}
```

### Get Guarantee by ID
```http
GET /api/guarantees/{id}/
Authorization: Bearer {access_token}
```

### Create Guarantee
```http
POST /api/guarantees/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "elector": "PA0001",
  "collector": 1,
  "notes": "Collected at home",
  "status": "COLLECTED"
}
```

### Update Guarantee
```http
PATCH /api/guarantees/{id}/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": "VERIFIED",
  "notes": "Signature verified"
}
```

### Delete Guarantee (Admin Only)
```http
DELETE /api/guarantees/{id}/
Authorization: Bearer {access_token}
```

---

## 📝 Attendance

**Base Path:** `/api/attendance/`

### List Attendance Records
```http
GET /api/attendance/
  ?elector=PA0001
  &committee=1
  &marked_by=1
  &date_after=2025-10-01
  &ordering=-marked_at
  &page=1
  &page_size=10
Authorization: Bearer {access_token}
```

### Mark Attendance
```http
POST /api/attendance/mark/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "elector": "PA0001",
  "committee": 1,
  "notes": "Voted successfully"
}
```

### Bulk Mark Attendance
```http
POST /api/attendance/bulk-mark/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "elector_ids": ["PA0001", "PA0002", "PA0003"],
  "committee": 1
}
```

### Get Attendance Statistics
```http
GET /api/attendance/statistics/
  ?committee=1
Authorization: Bearer {access_token}
```

---

## 📈 Reports

**Base Path:** `/api/reports/`

### List Reports
```http
GET /api/reports/
  ?report_type=ELECTION_SUMMARY
  &status=COMPLETED
  &ordering=-created_at
Authorization: Bearer {access_token}
```

### Generate Report
```http
POST /api/reports/generate/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "report_type": "ELECTION_SUMMARY",
  "election": 1,
  "parameters": {
    "include_candidates": true,
    "include_committees": true
  }
}
```

### Get Report by ID
```http
GET /api/reports/{id}/
Authorization: Bearer {access_token}
```

### Download Report
```http
GET /api/reports/{id}/download/
Authorization: Bearer {access_token}
```

### Export Report (PDF/CSV)
```http
GET /api/reports/{id}/export/
  ?format=pdf
Authorization: Bearer {access_token}
```

### Campaign Performance Snapshot (Admin Only)
```http
GET /api/reports/analytics/campaign-performance/
Authorization: Bearer {access_token}
```
**Response:**
```json
{
  "budget": {
    "id": 3,
    "total_budget": "250000.00",
    "committed_budget": "175000.00",
    "spent_budget": "92000.00",
    "available_budget": "158000.00",
    "burn_rate": "6500.00",
    "period_start": "2025-10-01",
    "period_end": "2025-10-31",
    "notes": "Includes media and field ops commitments",
    "created_at": "2025-10-31T14:05:12Z",
    "created_by": 4,
    "created_by_name": "Finance Director"
  },
  "resources": {
    "total_users": 128,
    "admins": 6,
    "supervisors": 18,
    "field_agents": 104,
    "active_today": 87,
    "active_ratio": 68.0
  },
  "forecast": {
    "daily_burn_rate": "6500.00",
    "guarantees_total": 1875,
    "attendance_today": 240
  }
}
```

---

## 🔑 Authentication Headers

All authenticated requests require:
```http
Authorization: Bearer {access_token}
```

## 📦 Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful",
  "meta": {
    "timestamp": "2025-10-24T12:00:00Z",
    "request_id": "abc123"
  }
}
```

### Error Response
```json
{
  "status": "error",
  "data": null,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

### Pagination Response
```json
{
  "count": 100,
  "next": "http://127.0.0.1:8000/api/endpoint/?page=2",
  "previous": null,
  "results": [ ... ]
}
```

---

## 🎭 User Roles

- **SUPER_ADMIN**: Full system access
- **ADMIN**: Operational management
- **SUPERVISOR**: Team oversight
- **USER**: Guarantee collector / Basic user

---

## ⚠️ Important Notes

1. **Base URL changed**: Use `http://127.0.0.1:8000/` (NOT `http://127.0.0.1:8000/api/`)
2. **No business/location fields**: All business-related endpoints removed
3. **Token expiry**: Access tokens expire after 60 minutes
4. **Refresh tokens**: Valid for 7 days
5. **Rate limiting**: May be implemented per endpoint

---

## 🧪 Testing

### Using cURL
```bash
# Login
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get current user
curl http://127.0.0.1:8000/api/users/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman/Insomnia
1. Import this document as API collection
2. Set base URL as environment variable
3. Add Authorization header with Bearer token

---

**Last Updated:** October 24, 2025  
**Documentation Version:** 1.0

