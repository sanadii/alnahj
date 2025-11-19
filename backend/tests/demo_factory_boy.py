"""
Demo test file to demonstrate Factory Boy usage.

This file shows how Factory Boy works with practical examples.
Run with: pytest tests/demo_factory_boy.py -v
"""
import pytest
from tests.factories import (
    UserFactory,
    AdminUserFactory,
    SupervisorUserFactory,
    ElectionFactory,
    CommitteeFactory,
    ElectorFactory,
    CandidateFactory,
    PartyFactory,
)


@pytest.mark.unit
@pytest.mark.django_db
class TestFactoryBoyDemo:
    """Demonstration of Factory Boy capabilities."""
    
    def test_basic_factory_usage(self):
        """Test 1: Basic factory usage - create a user."""
        user = UserFactory()
        
        assert user.id is not None
        assert user.email.startswith('user')
        assert '@example.com' in user.email
        assert user.role == 'USER'
        assert user.is_active is True
        print(f"[OK] Created user: {user.email} ({user.first_name} {user.last_name})")
    
    def test_factory_with_overrides(self):
        """Test 2: Override factory defaults."""
        user = UserFactory(email='custom@test.com', role='SUPERVISOR')
        
        assert user.email == 'custom@test.com'
        assert user.role == 'SUPERVISOR'
        print(f"[OK] Created custom user: {user.email} with role {user.role}")
    
    def test_factory_sequences(self):
        """Test 3: Sequences create unique values."""
        user1 = UserFactory()
        user2 = UserFactory()
        user3 = UserFactory()
        
        # Each gets a unique email
        assert user1.email != user2.email
        assert user2.email != user3.email
        print(f"[OK] Sequential emails: {user1.email}, {user2.email}, {user3.email}")
    
    def test_faker_integration(self):
        """Test 4: Faker provides realistic data."""
        user = UserFactory()
        
        # Faker generates realistic names
        assert len(user.first_name) > 0
        assert len(user.last_name) > 0
        print(f"[OK] Faker generated: {user.first_name} {user.last_name}")
    
    def test_factory_inheritance(self):
        """Test 5: Factory inheritance (AdminUserFactory extends UserFactory)."""
        admin = AdminUserFactory()
        
        assert admin.role == 'ADMIN'
        assert admin.email.startswith('admin')
        assert admin.first_name == 'Admin'
        print(f"[OK] Admin user: {admin.email} ({admin.role})")
    
    def test_subfactory_relationships(self):
        """Test 6: SubFactory automatically creates related objects."""
        # ElectorFactory has committee = SubFactory(CommitteeFactory)
        # CommitteeFactory has election = SubFactory(ElectionFactory)
        elector = ElectorFactory()
        
        # Related objects are automatically created
        assert elector.committee is not None
        assert elector.committee.election is not None
        print(f"[OK] Elector {elector.koc_id} in committee {elector.committee.code}")
        print(f"   Committee belongs to election: {elector.committee.election.name}")
    
    def test_batch_creation(self):
        """Test 7: Create multiple objects at once."""
        users = UserFactory.create_batch(5)
        
        assert len(users) == 5
        assert all(u.id is not None for u in users)
        print(f"[OK] Created batch of {len(users)} users")
        for i, user in enumerate(users, 1):
            print(f"   {i}. {user.email}")
    
    def test_complex_relationships(self):
        """Test 8: Build complex object graphs."""
        admin = AdminUserFactory()
        election = ElectionFactory(created_by=admin, name='Demo Election')
        committee = CommitteeFactory(election=election, code='DEMO-001')
        party = PartyFactory(election=election, name='Demo Party')
        candidate = CandidateFactory(election=election, party=party, candidate_number=1)
        elector = ElectorFactory(committee=committee)
        
        # Verify relationships
        assert elector.committee == committee
        assert committee.election == election
        assert candidate.party == party
        assert party.election == election
        assert election.created_by == admin
        
        print(f"[OK] Complex graph created:")
        print(f"   Election: {election.name}")
        print(f"   Committee: {committee.code}")
        print(f"   Party: {party.name}")
        print(f"   Candidate: {candidate.name} (#{candidate.candidate_number})")
        print(f"   Elector: {elector.koc_id}")
    
    def test_factory_vs_build(self):
        """Test 9: Difference between create() and build()."""
        # create() - saves to database
        saved_user = UserFactory()
        assert saved_user.id is not None
        assert saved_user.pk is not None
        
        # build() - creates in memory only
        unsaved_user = UserFactory.build()
        assert unsaved_user.id is None
        assert unsaved_user.pk is None
        
        print(f"[OK] Saved user has ID: {saved_user.id}")
        print(f"[OK] Unsaved user has no ID: {unsaved_user.id}")
    
    def test_factory_with_fixtures(self):
        """Test 10: Using factories with pytest fixtures."""
        # This shows how fixtures use factories internally
        admin = AdminUserFactory()
        election = ElectionFactory(created_by=admin, name='Test Election')
        
        # Create multiple related objects
        committees = CommitteeFactory.create_batch(3, election=election)
        assert len(committees) == 3
        assert all(c.election == election for c in committees)
        
        print(f"[OK] Created {len(committees)} committees for {election.name}")
        for c in committees:
            print(f"   - {c.code}: {c.name}")


@pytest.mark.unit
@pytest.mark.django_db
def test_quick_demo():
    """Quick demo showing Factory Boy in action."""
    print("\n" + "="*60)
    print("FACTORY BOY DEMONSTRATION")
    print("="*60)
    
    # 1. Create a user (automatic Faker data)
    user = UserFactory()
    print(f"\n1. Created user: {user.email}")
    print(f"   Name: {user.first_name} {user.last_name}")
    print(f"   Role: {user.role}")
    
    # 2. Create admin
    admin = AdminUserFactory()
    print(f"\n2. Created admin: {admin.email}")
    
    # 3. Create election with relationships
    election = ElectionFactory(created_by=admin, name='Demo Election 2024')
    print(f"\n3. Created election: {election.name}")
    print(f"   Created by: {election.created_by.email}")
    
    # 4. Create committee
    committee = CommitteeFactory(election=election, code='DEMO-001')
    print(f"\n4. Created committee: {committee.code} - {committee.name}")
    
    # 5. Create elector (auto-creates committee if not provided)
    elector = ElectorFactory(committee=committee)
    print(f"\n5. Created elector: {elector.koc_id}")
    print(f"   Name: {elector.name_first} {elector.family_name}")
    print(f"   Committee: {elector.committee.code}")
    
    # 6. Create batch
    more_electors = ElectorFactory.create_batch(3, committee=committee)
    print(f"\n6. Created batch of {len(more_electors)} electors")
    for e in more_electors:
        print(f"   - {e.koc_id}: {e.name_first} {e.family_name}")
    
    # 7. Create party and candidate
    party = PartyFactory(election=election, name='Demo Party')
    candidate = CandidateFactory(election=election, party=party, candidate_number=1)
    print(f"\n7. Created party: {party.name}")
    print(f"   Created candidate: {candidate.name} (#{candidate.candidate_number})")
    
    print("\n" + "="*60)
    print("[OK] ALL FACTORY BOY OPERATIONS SUCCESSFUL!")
    print("="*60 + "\n")
    
    # Verify everything is saved
    assert user.id is not None
    assert admin.id is not None
    assert election.id is not None
    assert committee.id is not None
    assert elector.koc_id is not None
    assert len(more_electors) == 3
    assert party.id is not None
    assert candidate.id is not None

