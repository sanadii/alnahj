"""
Multi-Tenancy Isolation Tests for Deals App

Tests to verify that deals, pipelines, and related data are properly isolated by business.
CRITICAL: These tests must pass before deploying multi-tenancy fix to production.

Run with: python manage.py test tests.test_multi_tenancy_deals
"""

import pytest

pytest.skip(
    "Multi-tenancy deal tests depend on legacy CRM apps that are not installed",
    allow_module_level=True,
)

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from decimal import Decimal

from apps.business.models import Business
from apps.crm.deals.models import Deal, Pipeline, PipelineStage, DealActivity, DealNote

User = get_user_model()


class DealMultiTenancyModelTest(TestCase):
    """Test model-level multi-tenancy isolation"""
    
    def setUp(self):
        """Set up test data"""
        # Create two businesses
        self.business1 = Business.objects.create(
            name='Business 1',
            email='business1@test.com'
        )
        self.business2 = Business.objects.create(
            name='Business 2',
            email='business2@test.com'
        )
        
        # Create users for each business
        self.user1 = User.objects.create_user(
            email='user1@test.com',
            password='password123',
            business=self.business1
        )
        self.user2 = User.objects.create_user(
            email='user2@test.com',
            password='password123',
            business=self.business2
        )
        
        # Create pipelines for each business
        self.pipeline1 = Pipeline.objects.create(
            name='Pipeline 1',
            business=self.business1,
            is_default=True
        )
        self.pipeline2 = Pipeline.objects.create(
            name='Pipeline 2',
            business=self.business2,
            is_default=True
        )
        
        # Create stages for each pipeline
        self.stage1 = PipelineStage.objects.create(
            name='Prospect',
            pipeline=self.pipeline1,
            business=self.business1,
            order=1,
            probability=20
        )
        self.stage2 = PipelineStage.objects.create(
            name='Prospect',
            pipeline=self.pipeline2,
            business=self.business2,
            order=1,
            probability=20
        )
        
        # Create deals for each business
        self.deal1 = Deal.objects.create(
            title='Deal 1',
            value=Decimal('1000.00'),
            business=self.business1,
            stage=self.stage1,
            owner=self.user1
        )
        self.deal2 = Deal.objects.create(
            title='Deal 2',
            value=Decimal('2000.00'),
            business=self.business2,
            stage=self.stage2,
            owner=self.user2
        )
    
    def test_deal_has_business_field(self):
        """CRITICAL: Verify Deal model has business field"""
        self.assertTrue(hasattr(Deal, 'business'))
        self.assertIsNotNone(self.deal1.business)
        self.assertEqual(self.deal1.business, self.business1)
    
    def test_pipeline_has_business_field(self):
        """CRITICAL: Verify Pipeline model has business field"""
        self.assertTrue(hasattr(Pipeline, 'business'))
        self.assertIsNotNone(self.pipeline1.business)
        self.assertEqual(self.pipeline1.business, self.business1)
    
    def test_pipeline_stage_has_business_field(self):
        """CRITICAL: Verify PipelineStage model has business field"""
        self.assertTrue(hasattr(PipelineStage, 'business'))
        self.assertIsNotNone(self.stage1.business)
        self.assertEqual(self.stage1.business, self.business1)
    
    def test_deal_isolation_by_business(self):
        """CRITICAL: Verify deals are isolated by business"""
        # Query deals for business 1
        business1_deals = Deal.objects.filter(business=self.business1)
        self.assertEqual(business1_deals.count(), 1)
        self.assertIn(self.deal1, business1_deals)
        self.assertNotIn(self.deal2, business1_deals)
        
        # Query deals for business 2
        business2_deals = Deal.objects.filter(business=self.business2)
        self.assertEqual(business2_deals.count(), 1)
        self.assertIn(self.deal2, business2_deals)
        self.assertNotIn(self.deal1, business2_deals)
    
    def test_pipeline_isolation_by_business(self):
        """Verify pipelines are isolated by business"""
        business1_pipelines = Pipeline.objects.filter(business=self.business1)
        self.assertEqual(business1_pipelines.count(), 1)
        self.assertIn(self.pipeline1, business1_pipelines)
        self.assertNotIn(self.pipeline2, business1_pipelines)
    
    def test_pipeline_stage_isolation_by_business(self):
        """Verify pipeline stages are isolated by business"""
        business1_stages = PipelineStage.objects.filter(business=self.business1)
        self.assertEqual(business1_stages.count(), 1)
        self.assertIn(self.stage1, business1_stages)
        self.assertNotIn(self.stage2, business1_stages)
    
    def test_deal_activity_has_business_field(self):
        """CRITICAL: Verify DealActivity has business field"""
        activity = DealActivity.objects.create(
            deal=self.deal1,
            business=self.business1,
            activity_type='call',
            title='Called client',
            performed_by=self.user1
        )
        self.assertTrue(hasattr(DealActivity, 'business'))
        self.assertEqual(activity.business, self.business1)
    
    def test_deal_note_has_business_field(self):
        """CRITICAL: Verify DealNote has business field"""
        note = DealNote.objects.create(
            deal=self.deal1,
            business=self.business1,
            note='Important note',
            created_by=self.user1
        )
        self.assertTrue(hasattr(DealNote, 'business'))
        self.assertEqual(note.business, self.business1)
    
    def test_deal_activity_isolation(self):
        """Verify deal activities are isolated by business"""
        activity1 = DealActivity.objects.create(
            deal=self.deal1,
            business=self.business1,
            activity_type='call',
            title='Activity 1',
            performed_by=self.user1
        )
        activity2 = DealActivity.objects.create(
            deal=self.deal2,
            business=self.business2,
            activity_type='call',
            title='Activity 2',
            performed_by=self.user2
        )
        
        business1_activities = DealActivity.objects.filter(business=self.business1)
        self.assertEqual(business1_activities.count(), 1)
        self.assertIn(activity1, business1_activities)
        self.assertNotIn(activity2, business1_activities)
    
    def test_deal_note_isolation(self):
        """Verify deal notes are isolated by business"""
        note1 = DealNote.objects.create(
            deal=self.deal1,
            business=self.business1,
            note='Note 1',
            created_by=self.user1
        )
        note2 = DealNote.objects.create(
            deal=self.deal2,
            business=self.business2,
            note='Note 2',
            created_by=self.user2
        )
        
        business1_notes = DealNote.objects.filter(business=self.business1)
        self.assertEqual(business1_notes.count(), 1)
        self.assertIn(note1, business1_notes)
        self.assertNotIn(note2, business1_notes)
    
    def test_cross_business_stage_assignment_prevented(self):
        """CRITICAL: Verify deals can't be assigned to stages from other businesses"""
        # Try to assign deal1 to stage2 (from different business)
        # This should fail at the application level
        with self.assertRaises(Exception):
            deal = Deal.objects.create(
                title='Cross Business Deal',
                value=Decimal('500.00'),
                business=self.business1,
                stage=self.stage2,  # Stage from business2
                owner=self.user1
            )


class DealMultiTenancyAPITest(APITestCase):
    """Test API-level multi-tenancy isolation"""
    
    def setUp(self):
        """Set up test data"""
        # Create two businesses
        self.business1 = Business.objects.create(
            name='Business 1',
            email='business1@test.com'
        )
        self.business2 = Business.objects.create(
            name='Business 2',
            email='business2@test.com'
        )
        
        # Create users
        self.user1 = User.objects.create_user(
            email='user1@test.com',
            password='password123',
            business=self.business1
        )
        self.user2 = User.objects.create_user(
            email='user2@test.com',
            password='password123',
            business=self.business2
        )
        
        # Create pipelines and stages
        self.pipeline1 = Pipeline.objects.create(
            name='Pipeline 1',
            business=self.business1
        )
        self.stage1 = PipelineStage.objects.create(
            name='Prospect',
            pipeline=self.pipeline1,
            business=self.business1,
            order=1
        )
        
        self.pipeline2 = Pipeline.objects.create(
            name='Pipeline 2',
            business=self.business2
        )
        self.stage2 = PipelineStage.objects.create(
            name='Prospect',
            pipeline=self.pipeline2,
            business=self.business2,
            order=1
        )
        
        # Create deals
        self.deal1 = Deal.objects.create(
            title='Deal 1',
            value=Decimal('1000.00'),
            business=self.business1,
            stage=self.stage1,
            owner=self.user1
        )
        self.deal2 = Deal.objects.create(
            title='Deal 2',
            value=Decimal('2000.00'),
            business=self.business2,
            stage=self.stage2,
            owner=self.user2
        )
        
        # Set up API client
        self.client = APIClient()
    
    def test_user_sees_only_own_business_deals(self):
        """CRITICAL: Verify users only see deals from their business"""
        # Authenticate as user1
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.get('/api/deals/')
        self.assertEqual(response.status_code, 200)
        
        # Check that only deal1 is returned
        if 'results' in response.data:
            results = response.data['results']
        else:
            results = response.data
        
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], self.deal1.id)
        self.assertEqual(results[0]['title'], 'Deal 1')
    
    def test_user_cannot_access_other_business_deal(self):
        """CRITICAL: Verify users cannot access deals from other businesses"""
        # Authenticate as user1
        self.client.force_authenticate(user=self.user1)
        
        # Try to access deal2 (belongs to business2)
        response = self.client.get(f'/api/deals/{self.deal2.id}/')
        
        # Should return 404 (not found) to prevent information leakage
        self.assertEqual(response.status_code, 404)
    
    def test_user_can_access_own_business_deal(self):
        """Verify users can access deals from their own business"""
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.get(f'/api/deals/{self.deal1.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], self.deal1.id)
    
    def test_deal_creation_auto_assigns_business(self):
        """CRITICAL: Verify new deals are automatically assigned to user's business"""
        self.client.force_authenticate(user=self.user1)
        
        data = {
            'title': 'New Deal',
            'value': '5000.00',
            'stage': self.stage1.id
        }
        
        response = self.client.post('/api/deals/', data)
        self.assertEqual(response.status_code, 201)
        
        # Verify business was auto-assigned
        new_deal = Deal.objects.get(id=response.data['id'])
        self.assertEqual(new_deal.business, self.business1)
    
    def test_deal_stats_isolated_by_business(self):
        """CRITICAL: Verify dashboard stats are isolated by business"""
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.get('/api/deals/stats/')
        self.assertEqual(response.status_code, 200)
        
        # User1 should only see stats from business1
        self.assertEqual(response.data['total_deals'], 1)
        self.assertAlmostEqual(
            float(response.data['total_pipeline_value']),
            1000.00,
            places=2
        )
    
    def test_pipeline_isolation_in_api(self):
        """Verify pipeline endpoints are isolated by business"""
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.get('/api/deals/pipelines/')
        self.assertEqual(response.status_code, 200)
        
        # Should only see pipelines from business1
        pipelines = response.data
        self.assertEqual(len(pipelines), 1)
        self.assertEqual(pipelines[0]['id'], self.pipeline1.id)
    
    def test_pipeline_stage_isolation_in_api(self):
        """Verify pipeline stage endpoints are isolated by business"""
        self.client.force_authenticate(user=self.user1)
        
        response = self.client.get(f'/api/deals/pipelines/{self.pipeline1.id}/stages/')
        self.assertEqual(response.status_code, 200)
        
        # Should only see stages from business1
        stages = response.data
        self.assertEqual(len(stages), 1)
        self.assertEqual(stages[0]['id'], self.stage1.id)


class DealMultiTenancySecurityTest(TestCase):
    """Security-focused tests for multi-tenancy"""
    
    def setUp(self):
        """Set up test data"""
        self.business1 = Business.objects.create(name='Business 1')
        self.business2 = Business.objects.create(name='Business 2')
        
        self.user1 = User.objects.create_user(
            email='user1@test.com',
            password='password123',
            business=self.business1
        )
        self.user2 = User.objects.create_user(
            email='user2@test.com',
            password='password123',
            business=self.business2
        )
    
    def test_deal_requires_business_field(self):
        """CRITICAL: Verify deals cannot be created without business"""
        pipeline = Pipeline.objects.create(
            name='Test Pipeline',
            business=self.business1
        )
        stage = PipelineStage.objects.create(
            name='Test Stage',
            pipeline=pipeline,
            business=self.business1
        )
        
        # This should fail - business is required
        with self.assertRaises(Exception):
            Deal.objects.create(
                title='Deal without business',
                value=Decimal('1000.00'),
                stage=stage,
                owner=self.user1
                # Missing: business=self.business1
            )
    
    def test_all_deal_models_have_business(self):
        """CRITICAL: Verify all deal-related models have business field"""
        models_to_check = [
            Deal,
            Pipeline,
            PipelineStage,
            DealActivity,
            DealNote
        ]
        
        for model in models_to_check:
            self.assertTrue(
                hasattr(model, 'business'),
                f"{model.__name__} is missing business field"
            )


if __name__ == '__main__':
    import django
    import os
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()
    
    from django.test.utils import get_runner
    from django.conf import settings
    
    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    failures = test_runner.run_tests(['tests.test_multi_tenancy_deals'])
    
    if failures:
        print(f"\n❌ {failures} test(s) failed")
        exit(1)
    else:
        print("\n✅ All multi-tenancy tests passed!")
        exit(0)

