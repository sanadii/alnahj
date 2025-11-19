# 🚀 Dashboard Backend - Quick Reference

**Quick implementation guide for dashboard APIs**

---

## 📌 4 Endpoints to Implement

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/elections/{id}/dashboard/guarantees/trends` | GET | Daily guarantee trends |
| `/api/elections/{id}/dashboard/groups/performance` | GET | Group performance metrics |
| `/api/elections/{id}/dashboard/attendance/hourly` | GET | Hourly attendance breakdown |
| `/api/elections/{id}/dashboard/electors/demographics` | GET | Gender demographics |

---

## 🗂️ Files to Create

```
backend/apps/elections/
├── serializers/
│   └── dashboard_serializers.py          # NEW
├── views/
│   └── dashboard_views.py                # NEW
├── utils/
│   └── dashboard_queries.py              # NEW
└── urls.py                               # UPDATE
```

---

## ⚡ Quick Implementation

### 1️⃣ Create Serializers (5 min)

**File:** `apps/elections/serializers/dashboard_serializers.py`

```python
from rest_framework import serializers

class GuaranteeTrendSerializer(serializers.Serializer):
    date = serializers.DateField()
    strong = serializers.IntegerField()
    medium = serializers.IntegerField()
    weak = serializers.IntegerField()
    total = serializers.IntegerField()

class GroupPerformanceSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    leader = serializers.CharField()
    members_count = serializers.IntegerField()
    guarantees_count = serializers.IntegerField()
    strong_count = serializers.IntegerField()
    medium_count = serializers.IntegerField()
    weak_count = serializers.IntegerField()
    conversion_rate = serializers.FloatField()
    last_activity = serializers.DateTimeField(allow_null=True)
    status = serializers.CharField()

class HourlyAttendanceSerializer(serializers.Serializer):
    hour = serializers.CharField()
    attendance = serializers.IntegerField()
    votes = serializers.IntegerField()
    target = serializers.IntegerField()

class ElectorDemographicsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    male = serializers.IntegerField()
    female = serializers.IntegerField()
    male_percentage = serializers.FloatField()
    female_percentage = serializers.FloatField()
    by_committee = serializers.ListField()
    by_family = serializers.ListField()
    by_age = serializers.ListField()
```

---

### 2️⃣ Create Query Functions (15 min)

**File:** `apps/elections/utils/dashboard_queries.py`

```python
from django.db.models import Count, Q, Max
from django.db.models.functions import TruncDate, ExtractHour
from datetime import datetime, timedelta
from django.utils import timezone

def get_guarantees_trend(user, period='30days'):
    """Get daily guarantee trend."""
    from apps.guarantees.models import Guarantee
    
    end_date = datetime.now().date()
    period_map = {'7days': 7, '30days': 30, '90days': 90}
    start_date = end_date - timedelta(days=period_map.get(period, 30)) if period != 'all' else None
    
    queryset = Guarantee.objects.filter(user=user)
    if start_date:
        queryset = queryset.filter(created_at__date__gte=start_date)
    
    return queryset.annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        strong=Count('id', filter=Q(status='STRONG')),
        medium=Count('id', filter=Q(status='MEDIUM')),
        weak=Count('id', filter=Q(status='WEAK')),
        total=Count('id')
    ).order_by('date')

def get_group_performance(user, status_filter='all'):
    """Get group performance metrics."""
    from apps.guarantees.models import GuaranteeGroup
    
    groups = GuaranteeGroup.objects.filter(user=user).annotate(
        guarantees_count=Count('guarantees'),
        strong_count=Count('guarantees', filter=Q(guarantees__status='STRONG')),
        medium_count=Count('guarantees', filter=Q(guarantees__status='MEDIUM')),
        weak_count=Count('guarantees', filter=Q(guarantees__status='WEAK')),
        last_activity=Max('guarantees__created_at')
    )
    
    seven_days_ago = timezone.now() - timedelta(days=7)
    results = []
    
    for group in groups:
        if group.guarantees_count == 0:
            group_status = 'pending'
        elif group.last_activity and group.last_activity >= seven_days_ago:
            group_status = 'active'
        else:
            group_status = 'inactive'
        
        if status_filter != 'all' and group_status != status_filter:
            continue
        
        conversion_rate = round((group.strong_count / group.guarantees_count) * 100, 1) if group.guarantees_count > 0 else 0
        
        results.append({
            'id': group.id,
            'name': group.name,
            'leader': group.user.get_full_name(),
            'members_count': group.guarantees_count,
            'guarantees_count': group.guarantees_count,
            'strong_count': group.strong_count,
            'medium_count': group.medium_count,
            'weak_count': group.weak_count,
            'conversion_rate': conversion_rate,
            'last_activity': group.last_activity,
            'status': group_status
        })
    
    return results

def get_hourly_attendance(election_id, date=None):
    """Get hourly attendance breakdown."""
    from apps.attendees.models import Attendance
    from apps.voting.models import Vote
    from apps.elections.models import Committee
    
    target_date = datetime.strptime(date, '%Y-%m-%d').date() if date else datetime.now().date()
    committees = Committee.objects.filter(election_id=election_id)
    
    # Attendance by hour
    attendance_data = Attendance.objects.filter(
        committee__in=committees,
        attended_at__date=target_date
    ).annotate(hour=ExtractHour('attended_at')).values('hour').annotate(
        count=Count('id')
    ).order_by('hour')
    
    # Votes by hour (if Vote model exists)
    try:
        votes_data = Vote.objects.filter(
            committee__in=committees,
            created_at__date=target_date
        ).annotate(hour=ExtractHour('created_at')).values('hour').annotate(
            count=Count('id')
        ).order_by('hour')
    except:
        votes_data = []
    
    # Build hour map
    hour_map = {hour: {'attendance': 0, 'votes': 0} for hour in range(8, 18)}
    
    for item in attendance_data:
        if 8 <= item['hour'] <= 17:
            hour_map[item['hour']]['attendance'] = item['count']
    
    for item in votes_data:
        if 8 <= item['hour'] <= 17:
            hour_map[item['hour']]['votes'] = item['count']
    
    # Calculate target
    total_electors = sum(c.electors.filter(is_active=True).count() for c in committees)
    target_per_hour = round(total_electors / 10)
    
    return [
        {
            'hour': f"{hour:02d}:00",
            'attendance': hour_map[hour]['attendance'],
            'votes': hour_map[hour]['votes'],
            'target': target_per_hour
        }
        for hour in range(8, 18)
    ]

def get_elector_demographics(election_id):
    """Get elector demographics."""
    from apps.electors.models import Elector
    from apps.elections.models import Committee
    
    committees = Committee.objects.filter(election_id=election_id)
    electors = Elector.objects.filter(committee__in=committees, is_active=True)
    
    total = electors.count()
    male_count = electors.filter(gender='MALE').count()
    female_count = electors.filter(gender='FEMALE').count()
    
    male_pct = round((male_count / total * 100), 1) if total > 0 else 0
    female_pct = round((female_count / total * 100), 1) if total > 0 else 0
    
    # By committee
    by_committee = [
        {
            'committee_id': c.id,
            'committee_name': c.name,
            'male': electors.filter(committee=c, gender='MALE').count(),
            'female': electors.filter(committee=c, gender='FEMALE').count()
        }
        for c in committees
    ]
    
    # By family (top 10)
    by_family = list(
        electors.values('family_name').annotate(
            count=Count('id'),
            male=Count('id', filter=Q(gender='MALE')),
            female=Count('id', filter=Q(gender='FEMALE'))
        ).order_by('-count')[:10].values('family_name', 'count', 'male', 'female')
    )
    
    return {
        'total': total,
        'male': male_count,
        'female': female_count,
        'male_percentage': male_pct,
        'female_percentage': female_pct,
        'by_committee': by_committee,
        'by_family': by_family,
        'by_age': []  # Implement if birth_date field exists
    }
```

---

### 3️⃣ Create Views (10 min)

**File:** `apps/elections/views/dashboard_views.py`

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from datetime import datetime

from apps.elections.models import Election
from apps.elections.serializers.dashboard_serializers import (
    GuaranteeTrendSerializer,
    GroupPerformanceSerializer,
    HourlyAttendanceSerializer,
    ElectorDemographicsSerializer
)
from apps.elections.utils.dashboard_queries import (
    get_guarantees_trend,
    get_group_performance,
    get_hourly_attendance,
    get_elector_demographics
)


class GuaranteesTrendView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, election_id):
        election = get_object_or_404(Election, id=election_id)
        period = request.query_params.get('period', '30days')
        
        if period not in ['7days', '30days', '90days', 'all']:
            return Response({'error': 'Invalid period'}, status=status.HTTP_400_BAD_REQUEST)
        
        data = get_guarantees_trend(request.user, period)
        serializer = GuaranteeTrendSerializer(data, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'period': period,
                'total_guarantees': sum(item['total'] for item in serializer.data)
            }
        })


class GroupPerformanceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, election_id):
        election = get_object_or_404(Election, id=election_id)
        status_filter = request.query_params.get('status', 'all')
        
        data = get_group_performance(request.user, status_filter)
        serializer = GroupPerformanceSerializer(data, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'total_groups': len(serializer.data),
                'active_groups': sum(1 for x in serializer.data if x['status'] == 'active')
            }
        })


class HourlyAttendanceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, election_id):
        election = get_object_or_404(Election, id=election_id)
        date_str = request.query_params.get('date', None)
        
        data = get_hourly_attendance(election_id, date_str)
        serializer = HourlyAttendanceSerializer(data, many=True)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'date': date_str or datetime.now().date().isoformat(),
                'total_attendance': sum(item['attendance'] for item in serializer.data)
            }
        })


class ElectorDemographicsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, election_id):
        election = get_object_or_404(Election, id=election_id)
        
        data = get_elector_demographics(election_id)
        serializer = ElectorDemographicsSerializer(data)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'election_id': election_id,
                'last_updated': datetime.now().isoformat()
            }
        })
```

---

### 4️⃣ Update URLs (2 min)

**File:** `apps/elections/urls.py`

```python
from apps.elections.views.dashboard_views import (
    GuaranteesTrendView,
    GroupPerformanceView,
    HourlyAttendanceView,
    ElectorDemographicsView
)

# Add to urlpatterns:
urlpatterns = [
    # ... existing URLs ...
    
    # Dashboard endpoints
    path('elections/<int:election_id>/dashboard/guarantees/trends', 
         GuaranteesTrendView.as_view(), 
         name='dashboard-guarantees-trends'),
    path('elections/<int:election_id>/dashboard/groups/performance', 
         GroupPerformanceView.as_view(), 
         name='dashboard-groups-performance'),
    path('elections/<int:election_id>/dashboard/attendance/hourly', 
         HourlyAttendanceView.as_view(), 
         name='dashboard-attendance-hourly'),
    path('elections/<int:election_id>/dashboard/electors/demographics', 
         ElectorDemographicsView.as_view(), 
         name='dashboard-electors-demographics'),
]
```

---

## 🧪 Test Commands

```bash
# Test with curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://127.0.0.1:8000/api/elections/1/dashboard/guarantees/trends?period=30days"

curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://127.0.0.1:8000/api/elections/1/dashboard/groups/performance"

curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://127.0.0.1:8000/api/elections/1/dashboard/attendance/hourly"

curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://127.0.0.1:8000/api/elections/1/dashboard/electors/demographics"
```

---

## ✅ Deployment Steps

1. **Apply changes:**
   ```bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Test locally:**
   ```bash
   python manage.py runserver
   # Test each endpoint
   ```

3. **Update frontend:**
   ```bash
   cd ../frontend
   # Edit .env
   VITE_USE_MOCK_DASHBOARD=false
   
   # Restart server
   npm start
   ```

4. **Verify:**
   - Navigate to Dashboard tab
   - All 4 components should show real data
   - No 404 errors in console

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 errors | Check URLs in `urls.py` match exactly |
| Empty data | Verify database has data, check query filters |
| Slow queries | Add database indexes (see full guide) |
| Frontend still mocks | Check `.env` and restart dev server |

---

## 📚 Full Documentation

For complete details, see: **`DASHBOARD-BACKEND-IMPLEMENTATION-GUIDE.md`**

Includes:
- ✅ Detailed query optimization
- ✅ Caching strategies
- ✅ Unit test examples
- ✅ Performance tips
- ✅ Security best practices

---

**Total Implementation Time:** ~30-45 minutes

**Ready to code? Start with Step 1! 🚀**

