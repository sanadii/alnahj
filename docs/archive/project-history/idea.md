# Election Guarantee Administration System

**Version**: 1.0  
**Client**: Kuwait Oil Company  
**Tech Stack**: React + Material UI (Frontend) | Django REST Framework (Backend) | PostgreSQL (Database)  
**Last Updated**: October 2025

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Election Configuration](#election-configuration)
3. [User Roles & Permissions](#user-roles--permissions)
4. [System Phases](#system-phases)
5. [Data Model](#data-model)
6. [Technical Architecture](#technical-architecture)
7. [Implementation Roadmap](#implementation-roadmap)

---

## Project Overview

### Purpose
Complete election lifecycle management system for Kuwait Oil Company internal elections, covering three critical phases:
1. **Pre-Election**: Guarantee collection and tracking
2. **Election Day**: Voter attendance and vote recording
3. **Post-Election**: Vote counting and results compilation

### Scope
- **Single Election Event** per deployment
- **Multi-Committee Support** (male/female separation)
- **~1000 electors** (KOC employees)
- **Multiple users** with role-based access
- **Real-time tracking** and reporting

---

## Election Configuration

### Voting System

#### Flexible Ballot Options
The system supports configurable voting methods:

**Option A: Full Party Ticket**
- Voter selects entire party list
- All party candidates (1-19) automatically selected
- Single selection per ballot

**Option B: Mixed Ticket**
- Voter selects individual candidates from different parties
- Configurable vote limit (e.g., max 5, 10, 15, or 19 candidates)
- Prevents over-voting

**Configuration Settings** (Admin-configurable):
```
- voting_mode: "full_party" | "mixed" | "both"
- max_candidates_per_ballot: 1-19
- allow_partial_voting: boolean
- minimum_votes_required: integer
```

### Committee Structure

**Organization**:
- Single election with multiple voting committees
- Gender-segregated committees (male/female)
- Committee assignment based on:
  - Elector's work location
  - Gender
  - Team/Department

**Committee Properties**:
- Unique committee code (e.g., "EK-II", "FC#28")
- Assigned electors list
- Assigned staff/users for voting day
- Real-time statistics

---

## User Roles & Permissions

### Role Matrix

| Feature | Super Admin | Admin | Supervisor | User |
|---------|------------|-------|------------|------|
| Manage Users | ✅ | ✅ | ❌ | ❌ |
| Assign Roles | ✅ | ✅ | ❌ | ❌ |
| View All Guarantees | ✅ | ✅ | 👥 Team Only | ❌ Own Only |
| Assign Supervisors | ✅ | ✅ | ❌ | ❌ |
| Assign Committees | ✅ | ✅ | ❌ | ❌ |
| Configure Election | ✅ | ✅ | ❌ | ❌ |
| Import Electors | ✅ | ✅ | ❌ | ❌ |
| Collect Guarantees | ✅ | ✅ | ✅ | ✅ |
| Create Groups | ✅ | ✅ | ✅ | ✅ |
| Record Attendance | ✅ | ✅ | ✅ Committee | ✅ Committee |
| Enter Vote Counts | ✅ | ✅ | ✅ Committee | ✅ Committee |
| View Final Results | ✅ | ✅ | ✅ | ❌ |
| Export Reports | ✅ | ✅ | ✅ Limited | ❌ |

### 1. Super Admin
**Full System Control**
- All permissions across all modules
- User and role management
- System configuration
- Audit log access
- Database management

### 2. Admin
**Operational Management**
- Configure election settings (voting mode, limits, dates)
- Import and manage elector database
- View all guarantees across all users
- Assign users to supervisors
- Assign users to teams
- Assign staff to committees (for voting day)
- Access all reports and analytics
- Cannot modify system-level settings

### 3. Supervisor
**Team Oversight**
- Assigned users by admin
- View guarantees of assigned users only
- Monitor team performance and statistics
- Review guarantee quality (strong/medium/weak distribution)
- Export team reports
- Can collect own guarantees
- If assigned to committee: can record attendance and votes

### 4. Regular User (Guarantee Collector)
**Personal Guarantee Management**
- Personal guarantee list (isolated from other users)
- Search and add electors to personal list
- Assign guarantee status (strong/medium/weak)
- Create custom groups for organization
- Add private notes per elector
- Add/update contact information
- View personal statistics only
- Can be assigned to team(s) by admin
- If assigned to committee: can record attendance and votes

---

## System Phases

### Phase 1: Guarantee Collection (Pre-Election)

**Timeline**: 2-8 weeks before election day  
**Primary Users**: All users (Admin, Supervisor, User)  
**Objective**: Build comprehensive guarantee lists to predict turnout

---

#### 1.1 Elector Database Management

**Data Source**: KOC employee CSV import

**Elector Schema**:
```
- koc_id: String (Employee Number) - Primary Key
- name_first: String
- name_second: String
- name_third: String
- name_fourth: String
- name_fifth: String
- name_before_last: String (Family/Tribe name)
- name_last: String (Surname)
- designation: String (Job Title)
- section: String (Department)
- location: String (Work Location)
- extension: String (Office Phone)
- mobile: String (Personal Phone)
- area: String (Geographic Area)
- team: String (Organizational Team)
- committee_code: String (Assigned Voting Committee)
- gender: String (Male/Female) - Derived or imported
- is_active: Boolean (Eligible to vote)
- created_at: DateTime
- updated_at: DateTime
```

**Import Process**:
1. Admin uploads CSV file
2. System validates format and required fields
3. Parse full name into 7 components
4. Assign committee based on location/gender
5. Check for duplicates (by KOC ID)
6. Import/update records
7. Generate import report (success/failures)

**Validation Rules**:
- KOC ID must be unique
- Name and Committee Code are required
- Mobile must be valid Kuwait format (8 digits)
- Gender must be Male/Female
- Committee Code must exist in system

---

#### 1.2 Advanced Search System

**Search Interface**:
- Single search bar with multi-field search
- Advanced filter panel
- Real-time results (as you type)
- Pagination (50 results per page)
- Export search results

**Searchable Fields**:
1. **KOC ID** (exact or partial match)
2. **Full Name** (any part of name)
3. **First Name** (exact or partial)
4. **Family Name** (name_before_last - tribe/family)
5. **Last Name** (surname)
6. **Designation** (job title)
7. **Section** (department)
8. **Location** (work location)
9. **Extension** (office phone)
10. **Mobile** (phone number)
11. **Area** (geographic area)
12. **Team** (organizational team)
13. **Committee Code** (voting committee)

**Search Logic**:
- Case-insensitive
- Partial matching (contains)
- Multiple field search (OR logic)
- Arabic/English support
- Fuzzy matching for names (optional)

**Search Performance Requirements**:
- Results within 500ms for database of 10,000 electors
- Database indexes on all searchable fields
- Full-text search optimization

---

#### 1.3 Guarantee Collection & Management

**Workflow**:

**Step 1: Search Elector**
```
User searches by any field → System returns matching electors
```

**Step 2: Add to Personal List**
```
User clicks "Add Guarantee" → Elector added to user's personal list
```

**Step 3: Set Guarantee Details**
```
User sets:
- Status: Strong / Medium / Weak
- Group: Custom category (optional)
- Notes: Private notes (optional)
- Additional Phone: Alternate contact (optional)
```

**Step 4: Track Interactions**
```
System automatically logs:
- Date added
- Last updated
- Status changes history
- Notes history
```

---

**Guarantee Record Schema**:
```
- id: UUID
- user_id: Foreign Key (User who collected)
- elector_id: Foreign Key (Elector)
- status: Enum [STRONG, MEDIUM, WEAK]
- groups: Array[String] (custom categories)
- notes: Text (private notes)
- additional_contacts: JSON [{type, number, label}]
- follow_up_date: Date (optional reminder)
- follow_up_done: Boolean
- created_at: DateTime
- updated_at: DateTime
- status_history: JSON (audit trail)
```

**Business Rules**:
- ✅ One elector can be guaranteed by multiple users (not shared between them)
- ✅ Users cannot see other users' guarantees (except supervisor/admin)
- ✅ Guarantee status can be updated anytime before election day
- ✅ Deleting guarantee keeps audit trail (soft delete)
- ✅ Export user's guarantees to Excel/PDF

---

#### 1.4 Group Management

**Purpose**: Organize guarantees into custom categories

**Features**:
- Create unlimited custom groups (e.g., "Priority", "Friends", "Family", "Co-workers")
- Assign multiple groups to single guarantee
- Rename/delete groups
- View guarantees filtered by group
- Color-code groups (optional)
- Group statistics (count per group, status breakdown)

**Use Cases**:
- Organize by relationship type
- Organize by geographic area
- Organize by priority
- Organize by follow-up status

---

#### 1.5 Notes & Contact Management

**Notes System**:
- Rich text notes per guarantee
- Timestamp and user attribution
- Edit history (audit trail)
- Search notes content
- Pin important notes

**Additional Contacts**:
- Add multiple phone numbers per elector
- Contact types: Mobile, WhatsApp, Office, Home, Other
- Label each contact (e.g., "Personal", "Wife", "Brother")
- Primary contact designation
- Validation (Kuwait format: 8 digits)

---

#### 1.6 Dashboard & Reporting

**Personal Dashboard (User)**:
```
📊 My Statistics
- Total Guarantees: 150
- Strong: 80 (53%)
- Medium: 50 (33%)
- Weak: 20 (14%)
- Groups: 5 custom groups
- Last Activity: 2 hours ago

📋 Recent Activity
- Last 10 guarantees added
- Recent status changes
- Upcoming follow-ups

📈 Trends
- Guarantees added over time (chart)
- Status distribution (pie chart)
```

**Supervisor Dashboard**:
```
👥 Team Overview
- Assigned Users: 5
- Total Team Guarantees: 750
- Average per user: 150
- Top performer: User A (250)

📊 Team Performance
- Status breakdown across team
- User comparison chart
- Goal tracking (if set)

🔍 Quality Check
- Users with low guarantee count (alert)
- Status distribution concerns
- Last activity per user
```

**Admin Dashboard**:
```
🌐 System-wide Statistics
- Total Users: 50
- Active Users: 45
- Total Guarantees: 7,500
- Unique Electors Guaranteed: 850 (85% coverage)
- Average guarantees per elector: 8.8

📈 Coverage Analysis
- Electors with 0 guarantees: 150 (alert)
- Electors with 10+ guarantees: 200
- Geographic coverage heatmap
- Team coverage comparison

👥 User Statistics
- Top 10 collectors
- Users by role distribution
- Inactive users (no activity 7+ days)

📊 Trend Analysis
- Daily guarantee collection rate
- Status distribution over time
- Prediction: estimated turnout
```

---

### Phase 2: Voting Day Operations (Election Day)

**Timeline**: Election day (single day event)  
**Primary Users**: Admin + Users assigned to committees  
**Objective**: Track voter attendance and record votes efficiently

---

#### 2.1 Committee Assignment (Pre-Election Setup)

**Admin Workflow**:
1. View all users
2. Assign user to committee(s):
   - Single committee (most common)
   - Multiple committees (if needed)
   - All committees (admin oversight)
3. Set committee role: "Monitor" or "Data Entry"
4. Confirm assignments

**User Notification**:
- Email/SMS notification of committee assignment
- Committee details (location, time, elector count)
- Assigned role and responsibilities

**Committee View Access**:
- User can only access assigned committee(s)
- View elector list for committee
- View committee statistics

---

#### 2.2 Attendance Tracking System

**Interface Design**: Fast, keyboard-friendly, mobile-optimized

**Workflow**:

**Step 1: KOC ID Entry**
```
User Interface:
┌─────────────────────────────────────┐
│  Attendance Tracking - Committee EK-II │
├─────────────────────────────────────┤
│                                     │
│  Enter KOC ID:                      │
│  [_____________] [Search]           │
│                                     │
│  Quick Tip: Press Enter to search   │
└─────────────────────────────────────┘

User enters KOC ID (e.g., "84698")
Press Enter or Click Search
```

**Step 2: Elector Confirmation**
```
✅ Elector Found:

┌─────────────────────────────────────┐
│  KOC ID: 84698                      │
│  Name: Khalifah Yousef Al-Loughani  │
│  Section: GC-01/GC-02&HUB-III       │
│  Committee: EK-II ✓                 │
├─────────────────────────────────────┤
│  [✓ Confirm Attendance] [✗ Cancel]  │
└─────────────────────────────────────┘

User clicks "Confirm Attendance" or presses Enter
System marks elector as "Attended"
Focus returns to KOC ID input for next elector
```

**Step 3: Not Found Scenario**
```
❌ Elector Not Found:

┌─────────────────────────────────────┐
│  KOC ID: 99999                      │
│  ❌ No elector found with this ID   │
├─────────────────────────────────────┤
│  Possible Actions:                  │
│  • Check if ID is correct           │
│  • Search by name instead           │
│                                     │
│  [📝 Add New Elector] [🔍 Search by Name] [✗ Cancel] │
└─────────────────────────────────────┘

Options:
A) Add New Elector (for walk-ins)
B) Search by Name (if ID might be wrong)
C) Cancel and try again
```

**Step 4: Add New Elector (Walk-in)**
```
📝 Add New Elector:

┌─────────────────────────────────────┐
│  KOC ID: [_____________] (required) │
│  Full Name: [_____________] (req)   │
│  Mobile: [_____________] (optional) │
│  Section: [_____________] (opt)     │
│  Committee: EK-II (auto-filled)     │
├─────────────────────────────────────┤
│  [✓ Add & Mark Attended] [✗ Cancel] │
└─────────────────────────────────────┘

System validates:
- KOC ID not already in database
- Required fields filled
- Creates elector record
- Marks as attended
- Flags as "Added on voting day" for admin review
```

---

**Attendance Record Schema**:
```
- id: UUID
- elector_id: Foreign Key
- committee_code: String
- marked_by_user_id: Foreign Key (who recorded attendance)
- attended_at: DateTime (exact timestamp)
- is_walk_in: Boolean (added on voting day)
- notes: Text (optional - any issues)
- device_info: JSON (mobile/desktop, location if GPS)
```

**Real-Time Statistics (Per Committee)**:
```
📊 Committee EK-II - Live Statistics

Total Electors: 250
✅ Attended: 187 (74.8%)
⏱️ Pending: 63 (25.2%)

📈 Hourly Breakdown:
08:00-09:00: 45 (peak)
09:00-10:00: 62 (peak)
10:00-11:00: 38
11:00-12:00: 28
12:00-13:00: 14 (current hour)

⏱️ Last Attendance: 2 minutes ago
📱 Recorded by: User A
```

**Features**:
- Auto-refresh every 30 seconds
- Export attendance list (Excel/PDF)
- Print attendance sheet
- SMS alerts for low turnout (optional)
- Duplicate prevention (already attended alert)

---

#### 2.3 Vote Recording (Optional Module)

**Note**: This is for recording final vote counts, not individual votes (anonymous)

**When**: After voting closes and manual counting is done

**Workflow**:

**Step 1: Committee Vote Count Entry**
```
User assigned to committee enters results:

Party A: [___] votes
Party B: [___] votes
Party C: [___] votes
...

OR (for mixed voting):

Candidate 1 (Party A): [___] votes
Candidate 2 (Party A): [___] votes
Candidate 3 (Party B): [___] votes
...

Validation:
- Total votes ≤ Total attendance
- All required fields filled
- Confirmed by 2 users (dual entry for accuracy)
```

**Step 2: Verification**
```
System shows summary:
- Total votes entered: 187
- Total attendance: 187 ✓
- Invalid ballots: 5

[✓ Confirm] [✗ Edit]
```

**Step 3: Submission**
```
Results submitted to central database
Committee status: "Completed"
User cannot edit after submission (unless admin unlocks)
```

---

### Phase 3: Results Compilation (Post-Election)

**Timeline**: After voting closes (same day/next day)  
**Primary Users**: Admin, Supervisor  
**Objective**: Aggregate results from all committees and generate final reports

---

#### 3.1 Results Aggregation

**Process**:
1. Admin verifies all committees submitted results
2. System aggregates votes from all committees
3. Calculate totals per party/candidate
4. Determine winners based on vote count
5. Generate discrepancy reports (if any)

**Data Integrity Checks**:
- ✅ All committees submitted
- ✅ Total votes = Total attendance (within margin)
- ✅ No duplicate submissions
- ✅ Invalid ballots accounted for
- ⚠️ Flag unusual patterns for review

---

#### 3.2 Final Reports

**Report Types**:

**1. Official Results Report**
```
Election Results - Kuwait Oil Company
Date: [DATE]

Total Registered Electors: 978
Total Attendance: 750 (76.7%)
Total Valid Votes: 745
Total Invalid Votes: 5

Results by Party:
1. Party A: 4,250 votes (57%)
2. Party B: 2,100 votes (28%)
3. Party C: 1,120 votes (15%)

Winners:
[List of elected candidates]
```

**2. Committee Breakdown Report**
```
Results by Committee:

Committee EK-II (Male):
- Registered: 250
- Attended: 187 (74.8%)
- Valid Votes: 185
- Results: [breakdown]

Committee FC#28 (Female):
- Registered: 180
- Attended: 145 (80.6%)
- Valid Votes: 143
- Results: [breakdown]

[Continue for all committees...]
```

**3. Guarantee Accuracy Report**
```
Guarantee vs Actual Turnout Analysis:

Users with High Accuracy (90%+):
- User A: 92% (92/100 attended)
- User B: 91% (85/93 attended)

System-wide Guarantee Accuracy:
- Strong: 85% attended
- Medium: 60% attended
- Weak: 30% attended

Total Coverage: 7,500 guarantees for 978 electors
Average per elector: 7.7 guarantees
```

**4. Audit Trail Report**
```
Complete audit log:
- Who entered what and when
- All edits and changes
- User activity timeline
- System events
```

---

#### 3.3 Export & Archive

**Export Formats**:
- **PDF**: Official reports with letterhead
- **Excel**: Detailed data for analysis
- **CSV**: Raw data for external processing
- **JSON**: API integration

**Archive Requirements**:
- Keep all data for minimum 7 years (legal requirement)
- Encrypted backup of sensitive data
- Audit trail preservation
- Read-only access after election closes

---

## Data Model

### Core Entities & Relationships

```
┌─────────────┐
│   User      │
├─────────────┤
│ id (PK)     │
│ username    │
│ email       │
│ role        │
│ supervisor_id (FK) │
│ teams[]     │
│ committees[]│
└─────────────┘
      │ 1
      │
      │ N
┌─────────────┐        N            1  ┌─────────────┐
│ Guarantee   │──────────────────────▶ │  Elector    │
├─────────────┤                        ├─────────────┤
│ id (PK)     │                        │ koc_id (PK) │
│ user_id(FK) │                        │ name_*      │
│ elector_id(FK)│                      │ designation │
│ status      │                        │ section     │
│ groups[]    │                        │ committee   │
│ notes       │                        │ ...         │
│ contacts    │                        └─────────────┘
└─────────────┘                               │ 1
                                              │
                                              │ N
                                        ┌─────────────┐
                                        │ Attendance  │
                                        ├─────────────┤
                                        │ id (PK)     │
                                        │ elector_id(FK)│
                                        │ committee   │
                                        │ attended_at │
                                        │ recorded_by │
                                        └─────────────┘
```

### Database Schema (PostgreSQL)

#### Table: `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'USER')),
    supervisor_id UUID REFERENCES users(id),
    teams TEXT[], -- Array of team names
    committees TEXT[], -- Array of committee codes (for voting day)
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_supervisor ON users(supervisor_id);
```

#### Table: `electors`
```sql
CREATE TABLE electors (
    koc_id VARCHAR(20) PRIMARY KEY,
    name_first VARCHAR(50) NOT NULL,
    name_second VARCHAR(50),
    name_third VARCHAR(50),
    name_fourth VARCHAR(50),
    name_fifth VARCHAR(50),
    name_before_last VARCHAR(50), -- Family/Tribe name
    name_last VARCHAR(50) NOT NULL,
    designation VARCHAR(100),
    section VARCHAR(100),
    location VARCHAR(100),
    extension VARCHAR(20),
    mobile VARCHAR(15),
    area VARCHAR(100),
    team VARCHAR(100),
    committee_code VARCHAR(20) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')),
    is_active BOOLEAN DEFAULT TRUE,
    is_walk_in BOOLEAN DEFAULT FALSE, -- Added on voting day
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Full text search indexes
CREATE INDEX idx_electors_koc_id ON electors(koc_id);
CREATE INDEX idx_electors_name_last ON electors(name_last);
CREATE INDEX idx_electors_name_before_last ON electors(name_before_last);
CREATE INDEX idx_electors_committee ON electors(committee_code);
CREATE INDEX idx_electors_team ON electors(team);
CREATE INDEX idx_electors_mobile ON electors(mobile);
CREATE INDEX idx_electors_section ON electors(section);

-- Full-text search
CREATE INDEX idx_electors_fulltext ON electors 
USING GIN (to_tsvector('english', 
    COALESCE(name_first, '') || ' ' || 
    COALESCE(name_second, '') || ' ' || 
    COALESCE(name_third, '') || ' ' ||
    COALESCE(name_before_last, '') || ' ' ||
    COALESCE(name_last, '')
));
```

#### Table: `guarantees`
```sql
CREATE TABLE guarantees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    elector_id VARCHAR(20) NOT NULL REFERENCES electors(koc_id),
    status VARCHAR(10) NOT NULL CHECK (status IN ('STRONG', 'MEDIUM', 'WEAK')),
    groups TEXT[], -- Array of custom group names
    notes TEXT,
    additional_contacts JSONB, -- [{type, number, label}]
    follow_up_date DATE,
    follow_up_done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_user_elector UNIQUE (user_id, elector_id)
);

CREATE INDEX idx_guarantees_user ON guarantees(user_id);
CREATE INDEX idx_guarantees_elector ON guarantees(elector_id);
CREATE INDEX idx_guarantees_status ON guarantees(status);
CREATE INDEX idx_guarantees_groups ON guarantees USING GIN(groups);
```

#### Table: `guarantee_history`
```sql
CREATE TABLE guarantee_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guarantee_id UUID NOT NULL REFERENCES guarantees(id),
    changed_by UUID REFERENCES users(id),
    field_name VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_guarantee_history_guarantee ON guarantee_history(guarantee_id);
```

#### Table: `attendance`
```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    elector_id VARCHAR(20) NOT NULL REFERENCES electors(koc_id),
    committee_code VARCHAR(20) NOT NULL,
    marked_by_user_id UUID NOT NULL REFERENCES users(id),
    attended_at TIMESTAMP DEFAULT NOW(),
    is_walk_in BOOLEAN DEFAULT FALSE,
    notes TEXT,
    device_info JSONB,
    
    CONSTRAINT unique_elector_attendance UNIQUE (elector_id)
);

CREATE INDEX idx_attendance_committee ON attendance(committee_code);
CREATE INDEX idx_attendance_date ON attendance(attended_at);
CREATE INDEX idx_attendance_user ON attendance(marked_by_user_id);
```

#### Table: `vote_counts`
```sql
CREATE TABLE vote_counts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_code VARCHAR(20) NOT NULL UNIQUE,
    party_candidate_votes JSONB NOT NULL, -- {party_id: vote_count} or {candidate_id: vote_count}
    total_valid_votes INTEGER NOT NULL,
    total_invalid_votes INTEGER DEFAULT 0,
    entered_by_user_id UUID NOT NULL REFERENCES users(id),
    verified_by_user_id UUID REFERENCES users(id),
    is_final BOOLEAN DEFAULT FALSE,
    notes TEXT,
    submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vote_counts_committee ON vote_counts(committee_code);
```

#### Table: `audit_log`
```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_date ON audit_log(created_at);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
```

---

## Technical Architecture

### Frontend (React + Material UI)

#### Technology Stack
```
- React 18+
- TypeScript
- Material UI (MUI) v5+
- Redux Toolkit (state management)
- React Router v6 (routing)
- Axios (HTTP client)
- React Query (server state)
- Formik + Yup (forms & validation)
- Chart.js / Recharts (data visualization)
- date-fns (date handling)
- React-to-Print (printing)
- XLSX (Excel export)
```

#### Key Features
- **Responsive Design**: Mobile-first approach
- **Progressive Web App (PWA)**: Offline capability for voting day
- **Real-time Updates**: WebSocket for live statistics
- **Accessibility**: WCAG 2.1 Level AA compliance
- **Internationalization**: Arabic/English support
- **Dark Mode**: Optional theme switching

#### Pages Structure
```
/login
/dashboard (role-based)
/guarantees
  /search
  /my-list
  /groups
  /statistics
/admin
  /users
  /electors
  /import
  /configuration
  /reports
/voting-day
  /attendance (committee-specific)
  /vote-entry (committee-specific)
  /statistics
/results
  /overview
  /by-committee
  /guarantee-analysis
/profile
/settings
```

---

### Backend (Django REST Framework)

#### Technology Stack
```
- Python 3.11+
- Django 4.2+
- Django REST Framework
- PostgreSQL 15+
- Redis (caching & WebSocket)
- Celery (background tasks)
- JWT Authentication (djangorestframework-simplejwt)
- Django Channels (WebSockets)
- Pandas (data import/export)
- ReportLab (PDF generation)
```

#### API Structure

**Authentication**:
```
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/change-password
```

**Users**:
```
GET    /api/users/              # List users (admin only)
POST   /api/users/              # Create user (admin only)
GET    /api/users/{id}/         # Get user
PUT    /api/users/{id}/         # Update user
DELETE /api/users/{id}/         # Delete user (admin only)
GET    /api/users/me/           # Current user profile
PATCH  /api/users/{id}/assign-supervisor/
PATCH  /api/users/{id}/assign-teams/
PATCH  /api/users/{id}/assign-committees/
```

**Electors**:
```
GET    /api/electors/           # List electors (paginated, searchable)
POST   /api/electors/           # Create elector (admin/voting day)
GET    /api/electors/{koc_id}/  # Get elector details
PUT    /api/electors/{koc_id}/  # Update elector
DELETE /api/electors/{koc_id}/  # Delete elector (admin only)
POST   /api/electors/import/    # Import CSV (admin only)
GET    /api/electors/export/    # Export to Excel
GET    /api/electors/search/?q={query}&fields={field1,field2}
```

**Guarantees**:
```
GET    /api/guarantees/         # List user's guarantees
POST   /api/guarantees/         # Add guarantee
GET    /api/guarantees/{id}/    # Get guarantee details
PUT    /api/guarantees/{id}/    # Update guarantee
DELETE /api/guarantees/{id}/    # Delete guarantee
PATCH  /api/guarantees/{id}/status/
POST   /api/guarantees/bulk-import/
GET    /api/guarantees/export/
GET    /api/guarantees/statistics/
GET    /api/guarantees/by-group/{group_name}/
```

**Admin Views**:
```
GET    /api/admin/all-guarantees/      # All users' guarantees
GET    /api/admin/statistics/          # System-wide stats
GET    /api/admin/user-performance/    # User rankings
GET    /api/admin/coverage-analysis/   # Elector coverage
```

**Supervisor Views**:
```
GET    /api/supervisor/team-guarantees/
GET    /api/supervisor/team-statistics/
GET    /api/supervisor/team-performance/
```

**Attendance**:
```
GET    /api/attendance/            # List by committee
POST   /api/attendance/mark/       # Mark attendance
GET    /api/attendance/statistics/{committee}/
GET    /api/attendance/export/{committee}/
GET    /api/attendance/check/{koc_id}/  # Check if already attended
```

**Vote Counts**:
```
GET    /api/vote-counts/
POST   /api/vote-counts/
GET    /api/vote-counts/{committee}/
PUT    /api/vote-counts/{committee}/
POST   /api/vote-counts/{committee}/finalize/
```

**Results**:
```
GET    /api/results/summary/
GET    /api/results/by-committee/
GET    /api/results/guarantee-accuracy/
GET    /api/results/export/
```

**WebSocket Endpoints**:
```
ws://api/ws/attendance/{committee}/     # Real-time attendance updates
ws://api/ws/guarantees/statistics/      # Real-time guarantee stats
```

---

### Security

#### Authentication & Authorization
- **JWT tokens** with refresh mechanism
- **Role-based permissions** (DRF permissions)
- **Row-level permissions** (user can only see own guarantees)
- **Token expiry**: Access token (1 hour), Refresh token (7 days)
- **Password policy**: Min 8 chars, complexity requirements
- **Rate limiting**: 100 req/min per user

#### Data Protection
- **HTTPS only** in production
- **Database encryption at rest**
- **Environment variables** for secrets
- **SQL injection prevention** (ORM parameterization)
- **XSS protection** (React auto-escaping + CSP headers)
- **CSRF protection** (Django CSRF + SameSite cookies)

#### Audit Trail
- Log all critical actions (create, update, delete)
- IP address and user agent logging
- Failed login attempt tracking
- Data export logging
- Admin action monitoring

---

### Performance Optimization

#### Frontend
- **Code splitting**: Lazy load routes
- **Memoization**: React.memo, useMemo, useCallback
- **Virtual scrolling**: Large lists (1000+ items)
- **Debounced search**: 300ms delay
- **Service Worker**: Cache static assets
- **Compression**: Gzip/Brotli

#### Backend
- **Database indexing**: All foreign keys and search fields
- **Query optimization**: Select_related, prefetch_related
- **Pagination**: 50 items per page default
- **Redis caching**: Frequently accessed data (1 hour TTL)
- **Database connection pooling**: Max 20 connections
- **API response compression**: Gzip middleware

#### Database
- **Indexes** on all searchable fields
- **Full-text search** using PostgreSQL tsvector
- **Partitioning** (if dataset grows beyond 100k electors)
- **Regular VACUUM** and ANALYZE
- **Connection pooling** via PgBouncer

---

### Deployment

#### Infrastructure
```
Production:
- Frontend: Vercel / Netlify (CDN)
- Backend: AWS EC2 / Digital Ocean
- Database: AWS RDS PostgreSQL
- Redis: AWS ElastiCache
- Storage: AWS S3 (file uploads)
- Monitoring: Sentry, DataDog
- Backups: Daily automated backups (7 day retention)
```

#### CI/CD Pipeline
```
GitHub Actions:
1. Lint (ESLint, Pylint)
2. Type Check (TypeScript, mypy)
3. Unit Tests (Jest, pytest)
4. Integration Tests
5. Build
6. Deploy to staging
7. Smoke tests
8. Deploy to production (manual approval)
```

#### Environment Configuration
```
Development:
- DEBUG=True
- Local PostgreSQL
- Local Redis
- Hot reload

Staging:
- DEBUG=False
- Cloud database (separate from prod)
- Full production-like setup
- Test data

Production:
- DEBUG=False
- Secure configuration
- Monitoring enabled
- Scheduled backups
- Auto-scaling (if needed)
```

---

## Implementation Roadmap

### Phase 1: Core Guarantee System (6-8 weeks)

#### Week 1-2: Foundation
- [x] Project setup (React + Django)
- [ ] Database schema implementation
- [ ] User authentication system
- [ ] Role-based access control
- [ ] Basic admin panel

#### Week 3-4: Elector Management
- [ ] Elector model and API
- [ ] CSV import functionality
- [ ] Name parsing logic (7 components)
- [ ] Basic elector listing
- [ ] Admin elector management

#### Week 5-6: Guarantee System
- [ ] Advanced search implementation
- [ ] Full-text search optimization
- [ ] Guarantee creation/management
- [ ] Groups functionality
- [ ] Notes and contacts
- [ ] Personal dashboard

#### Week 7-8: Reporting & Polish
- [ ] User dashboard with charts
- [ ] Supervisor dashboard
- [ ] Admin dashboard
- [ ] Export functionality (Excel/PDF)
- [ ] Mobile responsiveness
- [ ] User testing and bug fixes

---

### Phase 2: Voting Day System (3-4 weeks)

#### Week 9-10: Attendance System
- [ ] Committee assignment UI
- [ ] Attendance marking interface
- [ ] KOC ID search and confirmation
- [ ] Walk-in elector addition
- [ ] Real-time statistics
- [ ] Mobile optimization

#### Week 11-12: Testing & Deployment
- [ ] End-to-end testing
- [ ] Performance testing (simulate high load)
- [ ] User training materials
- [ ] Production deployment
- [ ] Monitoring setup

---

### Phase 3: Results System (2-3 weeks)

#### Week 13-14: Vote Counting
- [ ] Vote count entry interface
- [ ] Validation and verification
- [ ] Results aggregation
- [ ] Final reports generation
- [ ] Guarantee accuracy analysis

#### Week 15: Final Polish
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation completion
- [ ] User acceptance testing
- [ ] Production handoff

---

## Testing Strategy

### Unit Tests
- Models: Data validation, relationships
- API endpoints: CRUD operations, permissions
- Business logic: Calculations, aggregations
- **Coverage Target**: 80%+

### Integration Tests
- Full user workflows
- Authentication flow
- Guarantee collection workflow
- Attendance tracking workflow
- Results compilation workflow

### Performance Tests
- Load test: 100 concurrent users
- Search performance: <500ms for 10k records
- Attendance marking: <200ms response time
- Dashboard loading: <2s

### Security Tests
- SQL injection attempts
- XSS attempts
- CSRF protection verification
- JWT token validation
- Permission boundary testing

### User Acceptance Testing
- Real users test all workflows
- Mobile device testing (iOS, Android)
- Browser compatibility (Chrome, Safari, Firefox, Edge)
- Accessibility testing

---

## Maintenance & Support

### Monitoring
- **Uptime**: 99.9% target
- **Error tracking**: Sentry integration
- **Performance monitoring**: Response time, database queries
- **User activity**: Daily active users, popular features

### Backup Strategy
- **Database**: Daily automated backups (retained 30 days)
- **File uploads**: S3 versioning enabled
- **Recovery Time Objective (RTO)**: 2 hours
- **Recovery Point Objective (RPO)**: 24 hours

### Support Plan
- **During guarantee phase**: Business hours support
- **During election day**: 24/7 on-call support
- **Post-election**: Standard support

---

## Appendix

### Glossary
- **Elector**: KOC employee eligible to vote
- **Guarantee**: Commitment from an elector to vote (collected by user)
- **Committee**: Voting location/group
- **Walk-in**: Elector who wasn't in original database (added on voting day)
- **KOC ID**: Employee identification number

### Sample Data Volumes
- Electors: ~1,000
- Users: 50-100
- Guarantees per user: 50-200
- Total guarantees: 5,000-10,000
- Committees: 10-20

### Contact & Escalation
- **Project Manager**: [Name] - [Email]
- **Technical Lead**: [Name] - [Email]
- **Support Email**: support@example.com
- **Emergency Hotline**: [Phone] (election day only)

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Next Review**: Before Phase 2 implementation

--- 