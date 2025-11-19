# Voting App

## Overview

The **Voting** app manages the voting day operations for the Election Management System. It handles vote counting, results aggregation, and final winner determination with a complete audit trail.

---

## Features

### ✅ Vote Count Entry
- Record vote counts per candidate and committee
- Support for multiple vote entry sessions
- Device tracking for audit purposes
- Notes and metadata for each entry

### ✅ Results Aggregation
- Automatic aggregation across all committees
- Real-time calculation of total votes
- Rank determination and winner identification
- Committee-wise and overall results

### ✅ Audit Trail
- Complete history of all vote entries
- Track who entered votes and when
- Device information for security
- Timestamped vote count changes

### ✅ Final Results
- Compiled results for entire election
- Winner determination based on vote counts
- Committee-wise breakdown
- Export-ready format

---

## Models

### 1. VoteCount

Tracks vote counts for each candidate in each committee.

**Fields:**
- `election` (ForeignKey) - Associated election
- `committee` (ForeignKey) - Committee where votes were counted
- `candidate_name` (CharField) - Name of the candidate
- `votes` (PositiveIntegerField) - Total votes received
- `created_by` (ForeignKey) - User who created the record
- `created_at` (DateTimeField) - When record was created
- `updated_at` (DateTimeField) - Last update timestamp

**Constraints:**
- Unique together: `election`, `committee`, `candidate_name`
- Votes cannot be negative
- Committee must belong to the election

**Indexes:**
- `election`, `committee`
- `candidate_name`
- `created_at`

---

### 2. VoteEntry

Audit trail for vote count entries and changes.

**Fields:**
- `vote_count` (ForeignKey) - Associated vote count record
- `entered_by` (ForeignKey) - User who entered/updated votes
- `entry_time` (DateTimeField) - When entry was made
- `notes` (TextField) - Optional notes about the entry
- `device_info` (JSONField) - Device metadata (IP, user agent, etc.)

**Purpose:**
- Track all changes to vote counts
- Maintain complete audit trail
- Security and accountability
- Investigation of discrepancies

**Indexes:**
- `vote_count`, `entry_time`
- `entered_by`

---

### 3. ElectionResult

Final compiled results for the election.

**Fields:**
- `election` (ForeignKey) - Associated election
- `committee` (ForeignKey) - Committee (nullable for overall results)
- `candidate_name` (CharField) - Name of the candidate
- `total_votes` (PositiveIntegerField) - Total votes received
- `rank` (PositiveIntegerField) - Ranking position
- `is_winner` (BooleanField) - Whether candidate won
- `created_at` (DateTimeField) - When results were generated
- `updated_at` (DateTimeField) - Last update timestamp

**Types:**
- Committee-specific results (when `committee` is set)
- Overall results (when `committee` is null)

**Constraints:**
- Unique together: `election`, `committee`, `candidate_name`
- Rank must be positive

**Indexes:**
- `election`, `committee`
- `candidate_name`
- `rank`
- `is_winner`

---

## API Endpoints

### Vote Count Management

#### 1. List Vote Counts
```http
GET /api/voting/votes/
```

**Query Parameters:**
- `election` - Filter by election ID
- `committee` - Filter by committee ID
- `candidate_name` - Filter by candidate name (partial match)
- `created_by` - Filter by creator user ID
- `ordering` - Sort by field (e.g., `-votes`, `candidate_name`)

**Response:**
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "election": 1,
      "committee": 2,
      "candidate_name": "Ahmed Al-Mutairi",
      "votes": 145,
      "created_by": {
        "id": 3,
        "email": "supervisor@koc.com",
        "full_name": "Supervisor Name"
      },
      "created_at": "2025-10-24T10:30:00Z",
      "updated_at": "2025-10-24T14:15:00Z"
    }
  ]
}
```

**Permissions:**
- Supervisor or above can view all
- Regular users can view their own committee's votes

---

#### 2. Enter/Update Votes
```http
POST /api/voting/votes/enter_votes/
```

**Request Body:**
```json
{
  "election": 1,
  "committee": 2,
  "votes": [
    {
      "candidate_name": "Ahmed Al-Mutairi",
      "votes": 145
    },
    {
      "candidate_name": "Fatima Al-Ali",
      "votes": 132
    },
    {
      "candidate_name": "Mohammed Al-Rashidi",
      "votes": 98
    }
  ],
  "notes": "Final count verified by committee head",
  "device_info": {
    "ip": "192.168.1.50",
    "user_agent": "Mozilla/5.0..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vote counts saved successfully",
  "vote_counts": [
    {
      "id": 1,
      "candidate_name": "Ahmed Al-Mutairi",
      "votes": 145,
      "updated": true
    },
    {
      "id": 2,
      "candidate_name": "Fatima Al-Ali",
      "votes": 132,
      "updated": false
    },
    {
      "id": 3,
      "candidate_name": "Mohammed Al-Rashidi",
      "votes": 98,
      "updated": true
    }
  ]
}
```

**Permissions:**
- Supervisor or above
- User must be assigned to the committee

**Features:**
- Bulk vote entry for multiple candidates
- Automatic creation of VoteEntry audit records
- Updates existing counts or creates new ones
- Validates committee belongs to election

---

#### 3. Get Vote Count Details
```http
GET /api/voting/votes/{id}/
```

**Response:**
```json
{
  "id": 1,
  "election": {
    "id": 1,
    "name": "2025 Employee Council Election"
  },
  "committee": {
    "id": 2,
    "name": "Male Committee - Building A",
    "code": "M-A-01"
  },
  "candidate_name": "Ahmed Al-Mutairi",
  "votes": 145,
  "created_by": {
    "id": 3,
    "email": "supervisor@koc.com",
    "full_name": "Supervisor Name"
  },
  "vote_entries": [
    {
      "id": 1,
      "entered_by": "supervisor@koc.com",
      "entry_time": "2025-10-24T10:30:00Z",
      "notes": "Initial count",
      "device_info": {"ip": "192.168.1.50"}
    },
    {
      "id": 2,
      "entered_by": "supervisor@koc.com",
      "entry_time": "2025-10-24T14:15:00Z",
      "notes": "Final count verified",
      "device_info": {"ip": "192.168.1.50"}
    }
  ],
  "created_at": "2025-10-24T10:30:00Z",
  "updated_at": "2025-10-24T14:15:00Z"
}
```

---

### Results Management

#### 4. Aggregate Results
```http
POST /api/voting/votes/aggregate_results/
```

**Request Body:**
```json
{
  "election": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Results aggregated successfully",
  "statistics": {
    "committees_counted": 8,
    "total_candidates": 24,
    "total_votes": 3456,
    "results_generated": 32
  }
}
```

**Permissions:**
- Admin or above only

**Process:**
1. Aggregates votes from all committees
2. Calculates total votes per candidate
3. Determines rankings
4. Identifies winners (top 5 by default)
5. Generates both committee-wise and overall results
6. Stores in `ElectionResult` model

---

#### 5. Get Final Results
```http
GET /api/voting/votes/get_final_results/
```

**Query Parameters:**
- `election` - Election ID (required)
- `committee` - Optional: Filter by specific committee

**Response (Overall Results):**
```json
{
  "election": {
    "id": 1,
    "name": "2025 Employee Council Election"
  },
  "result_type": "overall",
  "results": [
    {
      "rank": 1,
      "candidate_name": "Ahmed Al-Mutairi",
      "total_votes": 589,
      "is_winner": true
    },
    {
      "rank": 2,
      "candidate_name": "Fatima Al-Ali",
      "total_votes": 567,
      "is_winner": true
    },
    {
      "rank": 3,
      "candidate_name": "Mohammed Al-Rashidi",
      "total_votes": 534,
      "is_winner": true
    }
  ],
  "statistics": {
    "total_votes": 3456,
    "total_candidates": 24,
    "winners_count": 5
  }
}
```

**Response (Committee-Specific Results):**
```json
{
  "election": {
    "id": 1,
    "name": "2025 Employee Council Election"
  },
  "committee": {
    "id": 2,
    "name": "Male Committee - Building A",
    "code": "M-A-01"
  },
  "result_type": "committee",
  "results": [
    {
      "rank": 1,
      "candidate_name": "Ahmed Al-Mutairi",
      "total_votes": 145,
      "is_winner": true
    }
  ],
  "statistics": {
    "total_votes": 432,
    "total_candidates": 12,
    "winners_count": 5
  }
}
```

**Permissions:**
- Admin and above: View all results
- Supervisor: View their assigned committees
- Regular users: View their committee only

---

#### 6. List Results
```http
GET /api/voting/results/
```

**Query Parameters:**
- `election` - Filter by election ID
- `committee` - Filter by committee ID
- `is_winner` - Filter winners only (true/false)
- `ordering` - Sort by field (default: `rank`)

**Response:**
```json
{
  "count": 24,
  "results": [
    {
      "id": 1,
      "election": 1,
      "committee": null,
      "candidate_name": "Ahmed Al-Mutairi",
      "total_votes": 589,
      "rank": 1,
      "is_winner": true,
      "created_at": "2025-10-24T16:00:00Z"
    }
  ]
}
```

---

#### 7. Get Result Details
```http
GET /api/voting/results/{id}/
```

**Response:**
```json
{
  "id": 1,
  "election": {
    "id": 1,
    "name": "2025 Employee Council Election"
  },
  "committee": null,
  "candidate_name": "Ahmed Al-Mutairi",
  "total_votes": 589,
  "rank": 1,
  "is_winner": true,
  "committee_breakdown": [
    {
      "committee": "Male Committee - Building A",
      "votes": 145
    },
    {
      "committee": "Male Committee - Building B",
      "votes": 178
    }
  ],
  "created_at": "2025-10-24T16:00:00Z",
  "updated_at": "2025-10-24T16:00:00Z"
}
```

---

## Usage Examples

### 1. Enter Vote Counts

```python
import requests

url = "http://localhost:8000/api/voting/votes/enter_votes/"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json"
}

data = {
    "election": 1,
    "committee": 2,
    "votes": [
        {"candidate_name": "Ahmed Al-Mutairi", "votes": 145},
        {"candidate_name": "Fatima Al-Ali", "votes": 132},
        {"candidate_name": "Mohammed Al-Rashidi", "votes": 98}
    ],
    "notes": "Final count verified",
    "device_info": {
        "ip": "192.168.1.50",
        "user_agent": "Mozilla/5.0..."
    }
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

---

### 2. Aggregate Results

```python
import requests

url = "http://localhost:8000/api/voting/votes/aggregate_results/"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json"
}

data = {
    "election": 1
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
# Output: Results aggregated, statistics shown
```

---

### 3. Get Final Results

```python
import requests

# Get overall results
url = "http://localhost:8000/api/voting/votes/get_final_results/?election=1"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}

response = requests.get(url, headers=headers)
results = response.json()

print(f"Winners:")
for result in results['results']:
    if result['is_winner']:
        print(f"{result['rank']}. {result['candidate_name']} - {result['total_votes']} votes")

# Get committee-specific results
url = "http://localhost:8000/api/voting/votes/get_final_results/?election=1&committee=2"
response = requests.get(url, headers=headers)
print(response.json())
```

---

### 4. View Vote Entry History

```python
import requests

url = "http://localhost:8000/api/voting/votes/1/"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}

response = requests.get(url, headers=headers)
vote_count = response.json()

print(f"Candidate: {vote_count['candidate_name']}")
print(f"Current Votes: {vote_count['votes']}")
print(f"\nVote Entry History:")

for entry in vote_count['vote_entries']:
    print(f"- {entry['entry_time']}: {entry['entered_by']} - {entry['notes']}")
```

---

## Business Rules

### Vote Entry Rules
1. Only supervisors and above can enter vote counts
2. Users must be assigned to the committee
3. Vote counts cannot be negative
4. Candidate names are case-sensitive
5. Bulk entry creates audit records for all votes

### Results Aggregation Rules
1. Only admins can trigger aggregation
2. Aggregation processes all committees
3. Rankings are calculated by total votes (descending)
4. Winners are determined by rank (top 5 by default)
5. Both committee-wise and overall results are generated

### Audit Trail Rules
1. Every vote entry creates an audit record
2. Device information is captured automatically
3. Timestamps are recorded in UTC
4. Audit records are immutable (never deleted)

### Access Control Rules
1. **Regular Users**: Can only view their assigned committee's votes
2. **Supervisors**: Can enter votes and view their committees
3. **Admins**: Can enter votes, aggregate results, view all
4. **Super Admins**: Full access to all operations

---

## Database Schema

### VoteCount Table
```sql
CREATE TABLE voting_votecount (
    id SERIAL PRIMARY KEY,
    election_id INTEGER REFERENCES election_election(id) ON DELETE CASCADE,
    committee_id INTEGER REFERENCES election_committee(id) ON DELETE CASCADE,
    candidate_name VARCHAR(200) NOT NULL,
    votes INTEGER CHECK (votes >= 0),
    created_by_id INTEGER REFERENCES account_customuser(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (election_id, committee_id, candidate_name)
);

CREATE INDEX idx_votecount_election_committee ON voting_votecount(election_id, committee_id);
CREATE INDEX idx_votecount_candidate ON voting_votecount(candidate_name);
CREATE INDEX idx_votecount_created_at ON voting_votecount(created_at);
```

### VoteEntry Table
```sql
CREATE TABLE voting_voteentry (
    id SERIAL PRIMARY KEY,
    vote_count_id INTEGER REFERENCES voting_votecount(id) ON DELETE CASCADE,
    entered_by_id INTEGER REFERENCES account_customuser(id) ON DELETE SET NULL,
    entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_voteentry_votecount_time ON voting_voteentry(vote_count_id, entry_time);
CREATE INDEX idx_voteentry_entered_by ON voting_voteentry(entered_by_id);
```

### ElectionResult Table
```sql
CREATE TABLE voting_electionresult (
    id SERIAL PRIMARY KEY,
    election_id INTEGER REFERENCES election_election(id) ON DELETE CASCADE,
    committee_id INTEGER REFERENCES election_committee(id) ON DELETE CASCADE NULL,
    candidate_name VARCHAR(200) NOT NULL,
    total_votes INTEGER CHECK (total_votes >= 0),
    rank INTEGER CHECK (rank > 0),
    is_winner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (election_id, committee_id, candidate_name)
);

CREATE INDEX idx_result_election_committee ON voting_electionresult(election_id, committee_id);
CREATE INDEX idx_result_candidate ON voting_electionresult(candidate_name);
CREATE INDEX idx_result_rank ON voting_electionresult(rank);
CREATE INDEX idx_result_winner ON voting_electionresult(is_winner);
```

---

## Integration with Other Apps

### With Election App
- Validates election exists and is active
- Validates committee belongs to election
- Uses election configuration for voting options

### With Account App
- Tracks who entered votes (audit trail)
- Enforces permissions based on user roles
- Validates committee assignments

### With Reports App
- Provides data for results reports
- Feeds into analytics dashboard
- Supports historical comparisons

---

## Testing

### Test Coverage
- Vote count entry and updates
- Bulk vote entry
- Results aggregation logic
- Winner determination
- Audit trail creation
- Permission checks
- Edge cases (ties, invalid data)

### Run Tests
```bash
# Run all voting tests
pytest apps/voting/tests/

# Run with coverage
pytest apps/voting/tests/ --cov=apps.voting --cov-report=html

# View coverage report
open htmlcov/index.html
```

---

## Security Considerations

### Data Integrity
- Vote counts cannot be negative
- Audit trail is immutable
- Timestamps are server-generated
- Device information is captured

### Access Control
- Strict role-based permissions
- Committee assignment validation
- Admin-only result aggregation
- Audit of all operations

### Audit Trail
- Complete vote entry history
- Device tracking for accountability
- Timestamps in UTC
- User tracking for all operations

---

## Future Enhancements

### Planned Features
- Real-time vote count updates (WebSocket)
- Automatic result notifications
- Multiple voting rounds support
- Ranked-choice voting option
- Vote verification workflow
- Blockchain-based audit trail

### Performance Optimizations
- Caching of final results
- Materialized views for aggregations
- Background task for result calculation
- Redis for real-time updates

---

## Troubleshooting

### Issue: Cannot enter votes
**Solution:** Verify user is assigned to the committee and has Supervisor role or above.

### Issue: Results not aggregating
**Solution:** Check that all committees have entered votes and election is in correct status.

### Issue: Duplicate candidate names
**Solution:** Candidate names are case-sensitive. Ensure consistent naming across committees.

### Issue: Vote counts don't match
**Solution:** Review audit trail in VoteEntry to track all changes and verify final counts.

---

## Support

For issues or questions about the Voting app:
1. Check the API documentation above
2. Review the implementation plan
3. Check the audit trail for vote entry issues
4. Contact the development team

---

**Status**: ✅ Phase 5 Complete
**Version**: 1.0.0
**Last Updated**: October 24, 2025

