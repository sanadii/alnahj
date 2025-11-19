# Factory Boy Usage Guide

Complete guide on how to use Factory Boy factories in your tests.

## Quick Start

### Basic Usage

```python
import pytest
from tests.factories import AdminUserFactory, ElectionFactory, CommitteeFactory

def test_something():
    # Create a single instance
    admin = AdminUserFactory()
    assert admin.role == 'ADMIN'
    
    # Create with overrides
    election = ElectionFactory(name='Custom Election', status='VOTING_DAY')
    assert election.name == 'Custom Election'
    
    # Create multiple instances
    committees = CommitteeFactory.create_batch(5)
    assert len(committees) == 5
```

## Using Fixtures

The easiest way is to use the existing fixtures in `conftest.py`:

```python
def test_with_fixtures(admin_user, election, committee):
    # These are already created using Factory Boy
    assert admin_user.role == 'ADMIN'
    assert election.name == 'Test Election'
    assert committee.election == election
```

## Factory Methods

### 1. `Factory()` - Create and Save

```python
from tests.factories import UserFactory

# Creates and saves to database
user = UserFactory()
user = UserFactory(email='custom@example.com')  # Override fields
```

### 2. `Factory.build()` - Create Without Saving

```python
# Creates object in memory (not saved to DB)
user = UserFactory.build()
assert user.id is None  # Not saved yet
```

### 3. `Factory.stub()` - Create Dict

```python
# Returns dict of attributes (no model instance)
user_data = UserFactory.stub()
# {'email': 'user1@example.com', 'first_name': 'John', ...}
```

### 4. `Factory.create_batch()` - Create Multiple

```python
# Create 10 users
users = UserFactory.create_batch(10)
assert len(users) == 10

# With overrides
admins = AdminUserFactory.create_batch(3, role='ADMIN')
```

## Available Factories

### User Factories

```python
from tests.factories import UserFactory, AdminUserFactory, SupervisorUserFactory

# Regular user
user = UserFactory()

# Admin user
admin = AdminUserFactory()

# Supervisor user
supervisor = SupervisorUserFactory()
```

### Election & Committee

```python
from tests.factories import ElectionFactory, CommitteeFactory

# Create election
election = ElectionFactory(name='My Election', status='VOTING_DAY')

# Create committee (automatically linked to election if using fixture)
committee = CommitteeFactory(election=election, code='CMT-001')
```

### Electors

```python
from tests.factories import ElectorFactory

# Create elector (needs committee)
elector = ElectorFactory(committee=committee)

# With custom data
elector = ElectorFactory(
    committee=committee,
    koc_id='KOC12345',
    name_first='John',
    family_name='Doe',
    is_active=True
)
```

### Candidates & Parties

```python
from tests.factories import CandidateFactory, PartyFactory

# Create party
party = PartyFactory(election=election, name='Democratic Party')

# Create candidate
candidate = CandidateFactory(
    election=election,
    candidate_number=1,
    name='John Doe',
    party=party
)
```

### Attendance

```python
from tests.factories import AttendanceFactory, AttendanceStatisticsFactory

# Create attendance record
attendance = AttendanceFactory(
    elector=elector,
    committee=committee,
    marked_by=admin_user
)

# Create statistics
stats = AttendanceStatisticsFactory(
    committee=committee,
    total_electors=100,
    total_attended=85
)
```

## Common Patterns

### Pattern 1: Using Fixtures (Recommended)

```python
def test_committee_electors(committee, elector_factory):
    # Create multiple electors for the committee
    electors = [elector_factory(committee=committee) for _ in range(10)]
    assert len(electors) == 10
    assert all(e.committee == committee for e in electors)
```

### Pattern 2: Direct Factory Usage

```python
from tests.factories import ElectionFactory, CommitteeFactory, ElectorFactory

def test_voting_flow():
    # Create related objects
    election = ElectionFactory()
    committee = CommitteeFactory(election=election)
    elector = ElectorFactory(committee=committee)
    
    # Use in test
    assert elector.committee.election == election
```

### Pattern 3: Batch Creation

```python
def test_multiple_committees(election):
    # Create 5 committees for the election
    committees = CommitteeFactory.create_batch(
        5,
        election=election,
        gender='MIXED'
    )
    assert len(committees) == 5
    assert all(c.election == election for c in committees)
```

### Pattern 4: Override Defaults

```python
def test_custom_elector(committee):
    # Override specific fields
    elector = ElectorFactory(
        committee=committee,
        koc_id='CUSTOM001',
        name_first='Custom',
        family_name='Name',
        is_active=False,
        is_approved=False
    )
    assert elector.koc_id == 'CUSTOM001'
    assert not elector.is_active
```

### Pattern 5: Using Faker (Automatic)

Factory Boy automatically uses Faker for realistic data:

```python
# These fields use Faker automatically:
user = UserFactory()
# user.first_name = 'John' (random)
# user.last_name = 'Smith' (random)
# user.email = 'user1@example.com' (sequential)

elector = ElectorFactory()
# elector.name_first = 'John' (random from Faker)
# elector.family_name = 'Doe' (random from Faker)
# elector.designation = 'Engineer' (random job title)
```

## Advanced Usage

### Trait Pattern (Custom Variants)

You can create custom factory variants:

```python
from tests.factories import ElectorFactory

# Create inactive elector
inactive_elector = ElectorFactory(is_active=False)

# Create approved elector
approved_elector = ElectorFactory(is_approved=True)
```

### SubFactory (Automatic Relationships)

Factories automatically create related objects:

```python
# ElectorFactory automatically creates a CommitteeFactory
elector = ElectorFactory()
# elector.committee is automatically created

# You can still override
custom_committee = CommitteeFactory(code='CUSTOM')
elector = ElectorFactory(committee=custom_committee)
```

### Sequences (Unique Values)

Factories use sequences for unique fields:

```python
# Each call gets a unique value
user1 = UserFactory()  # email='user0@example.com'
user2 = UserFactory()  # email='user1@example.com'
user3 = UserFactory()  # email='user2@example.com'
```

## Integration with Existing Tests

All existing tests continue to work! The fixtures maintain backward compatibility:

```python
# Old way (still works)
def test_old_way(admin_user, election, committee):
    # These fixtures now use Factory Boy internally
    pass

# New way (also works)
def test_new_way():
    admin = AdminUserFactory()
    election = ElectionFactory(created_by=admin)
    # Direct factory usage
```

## Best Practices

1. **Use Fixtures When Possible**
   ```python
   # Good - uses fixture
   def test_something(committee, elector_factory):
       elector = elector_factory(committee=committee)
   ```

2. **Override Only What You Need**
   ```python
   # Good - minimal override
   elector = ElectorFactory(is_active=False)
   
   # Avoid - unnecessary overrides
   elector = ElectorFactory(
       committee=committee,
       koc_id='KOC00001',  # Auto-generated anyway
       name_first='Test',  # Faker provides this
       # ... many more defaults
   )
   ```

3. **Use Batch Creation for Multiple Objects**
   ```python
   # Good
   electors = ElectorFactory.create_batch(10, committee=committee)
   
   # Avoid
   electors = [ElectorFactory(committee=committee) for _ in range(10)]
   ```

4. **Leverage Faker for Realistic Data**
   ```python
   # Faker automatically provides realistic names, emails, etc.
   user = UserFactory()  # Realistic first_name, last_name
   ```

## Examples from Your Codebase

### Example 1: Voting Model Test

```python
def test_vote_count(admin_user, election, committee, candidate_factory, elector_factory):
    # Create test data
    elector_factory(committee=committee)
    candidate = candidate_factory(1)
    
    # Test vote count
    vote = VoteCount.objects.create(
        election=election,
        committee=committee,
        candidate=candidate,
        vote_count=42,
        entered_by=admin_user,
    )
    assert vote.status == 'DRAFT'
```

### Example 2: Viewset Test

```python
def test_create_vote_count(supervisor_client, election, committee, candidate):
    # Factories create realistic test data
    data = {
        'election': election.id,
        'committee': committee.id,
        'candidate': candidate.id,
        'vote_count': 150
    }
    response = supervisor_client.post('/api/voting/vote-counts/', data)
    assert response.status_code == 201
```

## Troubleshooting

### Issue: "NameError: name 'XFactory' is not defined"

**Solution**: Import the factory
```python
from tests.factories import XFactory
```

### Issue: "Unique constraint violation"

**Solution**: Use `django_get_or_create` or override unique fields
```python
# Factory already handles this with django_get_or_create
# But you can override if needed
election = ElectionFactory(name='Unique Name')
```

### Issue: "Related object does not exist"

**Solution**: Create related objects first or use SubFactory
```python
# Option 1: Create explicitly
election = ElectionFactory()
committee = CommitteeFactory(election=election)

# Option 2: Let SubFactory handle it
elector = ElectorFactory()  # Automatically creates committee
```

## Reference

- **Factory Boy Docs**: https://factoryboy.readthedocs.io/
- **Faker Docs**: https://faker.readthedocs.io/
- **Your Factories**: `backend/tests/factories.py`
- **Your Fixtures**: `backend/tests/conftest.py`

