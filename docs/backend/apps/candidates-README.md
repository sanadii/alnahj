# Candidates & Parties Module

**Django App for managing election candidates and political parties**

---

## Overview

This module handles candidate registration and political party management for elections. It was separated from the voting module to maintain clear separation of concerns.

---

## Models

### Party
Political parties participating in elections.

**Fields:**
- `election` - FK to Election
- `name` - Party name
- `abbreviation` - Short name
- `color` - Party color (hex)
- `description` - Party description
- `is_active` - Active status

**Properties:**
- `candidate_count` - Total candidates in party

### Candidate
Electors who are running as candidates.

**Fields:**
- `election` - FK to Election
- `elector` - FK to Elector
- `candidate_number` - Ballot number
- `party` - FK to Party (optional)
- `party_affiliation` - Text field for party name
- `is_active` - Active status

**Properties:**
- `total_votes` - Total verified votes
- `vote_percentage` - Vote percentage

---

## API Endpoints

### Candidates
```
GET     /api/candidates/                    - List candidates
POST    /api/candidates/                    - Create candidate (admin)
GET     /api/candidates/{id}/               - Get candidate
PUT     /api/candidates/{id}/               - Update candidate (admin)
PATCH   /api/candidates/{id}/               - Partial update (admin)
DELETE  /api/candidates/{id}/               - Delete candidate (admin)
GET     /api/candidates/statistics/         - Statistics
GET     /api/candidates/{id}/vote-counts/   - Vote counts
```

### Parties
```
GET     /api/candidates/parties/                - List parties
POST    /api/candidates/parties/                - Create party (admin)
GET     /api/candidates/parties/{id}/           - Get party
PUT     /api/candidates/parties/{id}/           - Update party (admin)
DELETE  /api/candidates/parties/{id}/           - Delete party (admin)
GET     /api/candidates/parties/{id}/candidates/ - Party candidates
GET     /api/candidates/parties/statistics/     - Statistics
```

---

## Serializers

### Party Serializers
- `PartySerializer` - Full details
- `PartyListSerializer` - Lightweight
- `PartyCreateSerializer` - Creation

### Candidate Serializers
- `CandidateSerializer` - Full details
- `CandidateListSerializer` - Lightweight
- `CandidateCreateSerializer` - Creation
- `CandidateUpdateSerializer` - Updates

---

## ViewSets

### PartyViewSet
- **Permissions:** Authenticated users can read, admins can write
- **Filtering:** election, is_active
- **Search:** name, abbreviation
- **Custom Actions:** candidates/, statistics/

### CandidateViewSet
- **Permissions:** Authenticated users can read, admins can write
- **Filtering:** election, party, is_active
- **Search:** candidate_number, elector name, KOC ID
- **Custom Actions:** statistics/, vote_counts/

---

## Usage Examples

### Python
```python
from apps.candidates.models import Party, Candidate

# Create party
party = Party.objects.create(
    election=election,
    name="Democratic Party",
    abbreviation="DEM",
    color="#0015BC"
)

# Create candidate
candidate = Candidate.objects.create(
    election=election,
    elector=elector,
    candidate_number=1,
    party=party
)

# Get statistics
total_votes = candidate.total_votes
vote_pct = candidate.vote_percentage
```

### API
```bash
# List candidates
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/candidates/

# Create party (admin only)
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"election":1,"name":"New Party","color":"#FF0000"}' \
  http://localhost:8000/api/candidates/parties/

# Get candidate vote counts
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/candidates/1/vote-counts/
```

---

## Admin Interface

Both Party and Candidate models are registered in Django admin with:
- Optimized list displays
- Search functionality
- Filters
- Readonly fields for computed values
- Organized fieldsets

Access at: `http://localhost:8000/admin/candidates/`

---

## Relationships

### Party Relationships
- `election` → Election (Many-to-One)
- `candidates` ← Candidate (One-to-Many)

### Candidate Relationships
- `election` → Election (Many-to-One)
- `elector` → Elector (Many-to-One)
- `party` → Party (Many-to-One, nullable)
- `vote_counts` ← VoteCount (One-to-Many)
- `candidacies` - Related name from Elector

---

## Validation

### Party Validation
- Name must be at least 2 characters
- Color must be hex format (#RGB or #RRGGBB)
- Unique name per election

### Candidate Validation
- Candidate number must be positive
- Elector must be active
- Unique elector per election
- Unique candidate number per election

---

## Testing

### Run Tests
```bash
python manage.py test apps.candidates
```

### Test Coverage
- Model creation and validation
- API endpoint access
- Permission checks
- Computed properties
- Custom actions

---

## Migration Notes

**IMPORTANT:** This module uses existing database tables from the voting module:
- `parties` table
- `candidates` table

No database migration is needed when deploying this module. Only the Python code location changed.

---

## Dependencies

- `apps.election` - For Election model
- `apps.electors` - For Elector model
- `apps.voting` - VoteCount references Candidate

---

## Documentation

- **Refactoring Details:** See `REFACTORING-SUMMARY.md`
- **Standards:** See `backend/docs/BACKEND-STANDARDIZATION-GUIDE.md`
- **API Docs:** See `backend/docs/API-DOCUMENTATION.md`

---

## Changelog

### October 25, 2025
- ✅ Module created
- ✅ Models moved from voting
- ✅ Serializers created
- ✅ ViewSets created
- ✅ URLs configured
- ✅ Admin interface set up
- ✅ Documentation completed

---

## Support

For questions or issues:
1. Check `REFACTORING-SUMMARY.md`
2. Review standardization guide
3. Check model docstrings
4. Contact development team

---

**Status:** ✅ Production Ready

