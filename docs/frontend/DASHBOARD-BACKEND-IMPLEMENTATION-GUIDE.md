# 🚀 Dashboard Backend Implementation Guide

**Complete Guide to Implementing Real Backend APIs for Election Dashboard**

**Version:** 1.0  
**Date:** November 4, 2025  
**Target:** Backend Developers (Django/Python)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API Endpoints Specification](#api-endpoints-specification)
4. [Database Queries](#database-queries)
5. [Implementation Steps](#implementation-steps)
6. [Response Format Standards](#response-format-standards)
7. [Performance Optimization](#performance-optimization)
8. [Testing](#testing)
9. [Deployment Checklist](#deployment-checklist)

---

## 1. Overview

### 1.1 Purpose

This guide provides complete specifications for implementing 4 backend API endpoints that power the election dashboard analytics:

1. **Guarantees Trend Chart** - Daily guarantee collection trends
2. **Group Performance Table** - Performance metrics by guarantee groups
3. **Hourly Attendance Chart** - Real-time attendance by hour
4. **Gender Distribution Chart** - Demographic analysis of electors

### 1.2 Requirements

- **Backend**: Django 4.x, Django REST Framework
- **Database**: PostgreSQL (existing models)
- **Authentication**: JWT (existing)
- **Permissions**: User must have election access

### 1.3 Frontend Integration

The frontend is **already implemented** and ready to consume these APIs:
- API client: `frontend/src/helpers/api/dashboard.ts`
- Custom hooks: `frontend/src/hooks/dashboard/useDashboardData.ts`
- Components: `frontend/src/views/election/components/charts/*WithAPI.tsx`

---

## 2. Architecture

### 2.1 Directory Structure

```
backend/apps/
├── elections/
│   ├── views/
│   │   ├── __init__.py
│   │   ├── election_views.py
│   │   └── dashboard_views.py          # ← NEW: Create this
│   ├── urls.py                          # ← UPDATE: Add dashboard routes
│   └── serializers/
│       └── dashboard_serializers.py     # ← NEW: Create this
```

### 2.2 URL Structure

All dashboard endpoints follow this pattern:

```
/api/elections/{election_id}/dashboard/{resource}
```

**Examples:**
- `/api/elections/1/dashboard/guarantees/trends?period=30days`
- `/api/elections/1/dashboard/groups/performance`
- `/api/elections/1/dashboard/attendance/hourly?date=2025-11-04`
- `/api/elections/1/dashboard/electors/demographics`

### 2.3 Data Flow

```
Frontend Component
    ↓ (calls custom hook)
useDashboardData Hook
    ↓ (calls API service)
API Service (dashboard.ts)
    ↓ (HTTP Request)
Django View (dashboard_views.py)
    ↓ (queries database)
Database (PostgreSQL)
    ↓ (returns data)
Serializer (dashboard_serializers.py)
    ↓ (formats response)
Frontend (renders chart)
```

---

## 3. API Endpoints Specification

### 3.1 Guarantees Trend Chart

**Purpose:** Show daily trend of guarantee collection by strength (strong, medium, weak)

#### Endpoint
```http
GET /api/elections/{election_id}/dashboard/guarantees/trends
```

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| period | string | No | 30days | Time period: `7days`, `30days`, `90days`, `all` |

#### Request Example
```http
GET /api/elections/1/dashboard/guarantees/trends?period=30days
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

#### Response Format
```json
{
  "status": "success",
  "data": [
    {
      "date": "2025-10-05",
      "strong": 12,
      "medium": 8,
      "weak": 5,
      "total": 25
    },
    {
      "date": "2025-10-06",
      "strong": 15,
      "medium": 10,
      "weak": 3,
      "total": 28
    }
    // ... more daily data points
  ],
  "meta": {
    "period": "30days",
    "start_date": "2025-10-05",
    "end_date": "2025-11-04",
    "total_days": 30,
    "total_guarantees": 753
  }
}
```

#### Data Requirements
- **Date**: ISO format (YYYY-MM-DD)
- **Counts**: Integer (0 or positive)
- **Total**: Sum of strong + medium + weak
- **Sort**: Ascending by date (oldest first)

#### Business Logic
1. Filter guarantees by election (user's guarantees only)
2. Filter by date range based on period parameter
3. Group by date (created_at date)
4. Count by status (STRONG, MEDIUM, WEAK)
5. Calculate daily totals
6. Return ordered by date ascending

---

### 3.2 Group Performance Table

**Purpose:** Show performance metrics for each guarantee group

#### Endpoint
```http
GET /api/elections/{election_id}/dashboard/groups/performance
```

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| status | string | No | all | Filter: `active`, `inactive`, `pending`, `all` |
| sort_by | string | No | guarantees_desc | Sort: `name`, `guarantees_desc`, `conversion_desc` |

#### Request Example
```http
GET /api/elections/1/dashboard/groups/performance?status=active&sort_by=guarantees_desc
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

#### Response Format
```json
{
  "status": "success",
  "data": [
    {
      "id": 5,
      "name": "Close Friends",
      "leader": "John Doe",
      "members_count": 8,
      "guarantees_count": 45,
      "strong_count": 20,
      "medium_count": 18,
      "weak_count": 7,
      "conversion_rate": 84.4,
      "last_activity": "2025-11-04T14:30:00Z",
      "status": "active"
    },
    {
      "id": 3,
      "name": "Family",
      "leader": "Jane Smith",
      "members_count": 12,
      "guarantees_count": 38,
      "strong_count": 25,
      "medium_count": 10,
      "weak_count": 3,
      "conversion_rate": 92.1,
      "last_activity": "2025-11-03T16:45:00Z",
      "status": "active"
    }
    // ... more groups
  ],
  "meta": {
    "total_groups": 8,
    "active_groups": 6,
    "total_guarantees": 312,
    "average_conversion_rate": 78.5
  }
}
```

#### Data Requirements
- **ID**: Group primary key
- **Name**: Group name (string)
- **Leader**: User's full name who created the group
- **Members Count**: Number of guarantees in this group
- **Guarantees Count**: Total guarantees in group
- **Strong/Medium/Weak Count**: Count by status
- **Conversion Rate**: (strong_count / guarantees_count) * 100
- **Last Activity**: Most recent guarantee created_at in this group
- **Status**: 
  - `active`: Has activity in last 7 days
  - `inactive`: No activity in last 7 days
  - `pending`: No guarantees yet

#### Business Logic
1. Get all guarantee groups for current user
2. For each group:
   - Count total guarantees
   - Count by status (STRONG, MEDIUM, WEAK)
   - Calculate conversion rate (strong %)
   - Get most recent guarantee timestamp
   - Determine status based on last activity
3. Apply status filter if provided
4. Sort based on sort_by parameter
5. Calculate summary metadata

---

### 3.3 Hourly Attendance Chart

**Purpose:** Show attendance patterns throughout election day by hour

#### Endpoint
```http
GET /api/elections/{election_id}/dashboard/attendance/hourly
```

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| date | string | No | today | Date in YYYY-MM-DD format |

#### Request Example
```http
GET /api/elections/1/dashboard/attendance/hourly?date=2025-11-04
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

#### Response Format
```json
{
  "status": "success",
  "data": [
    {
      "hour": "08:00",
      "attendance": 45,
      "votes": 40,
      "target": 50
    },
    {
      "hour": "09:00",
      "attendance": 78,
      "votes": 72,
      "target": 80
    },
    {
      "hour": "10:00",
      "attendance": 92,
      "votes": 85,
      "target": 100
    }
    // ... data for each hour from 08:00 to 17:00
  ],
  "meta": {
    "date": "2025-11-04",
    "total_attendance": 756,
    "total_votes": 698,
    "total_target": 800,
    "attendance_percentage": 94.5,
    "voting_percentage": 87.3,
    "peak_hour": "11:00",
    "peak_attendance": 125
  }
}
```

#### Data Requirements
- **Hour**: Time in HH:MM format (08:00 to 17:00)
- **Attendance**: Count of electors who attended at this hour
- **Votes**: Count of electors who voted at this hour
- **Target**: Expected attendance per hour (total_electors / 10 hours)
- **Sort**: Ascending by hour
- **Note**: votes ≤ attendance (always)

#### Business Logic
1. Get election's committees
2. Filter attendance records by date
3. Extract hour from attended_at timestamp
4. Group by hour and count:
   - Attendance: All attendance records
   - Votes: Attendance records where elector has voted
5. Calculate target: (total_electors_in_election / 10) per hour
6. Return hours 08:00-17:00 (fill with 0 if no data)
7. Calculate summary metrics

---

### 3.4 Gender Distribution Chart

**Purpose:** Show demographic breakdown of electors by gender

#### Endpoint
```http
GET /api/elections/{election_id}/dashboard/electors/demographics
```

#### Query Parameters
None

#### Request Example
```http
GET /api/elections/1/dashboard/electors/demographics
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

#### Response Format
```json
{
  "status": "success",
  "data": {
    "total": 1234,
    "male": 678,
    "female": 556,
    "male_percentage": 54.9,
    "female_percentage": 45.1,
    "by_committee": [
      {
        "committee_id": 1,
        "committee_name": "Committee A",
        "male": 150,
        "female": 130
      },
      {
        "committee_id": 2,
        "committee_name": "Committee B",
        "male": 180,
        "female": 145
      }
      // ... more committees
    ],
    "by_family": [
      {
        "family_name": "Al-Ahmad",
        "count": 45,
        "male": 25,
        "female": 20
      },
      {
        "family_name": "Al-Sabah",
        "count": 38,
        "male": 20,
        "female": 18
      }
      // ... top 10 families
    ],
    "by_age": [
      {
        "age_group": "18-25",
        "count": 156,
        "male": 85,
        "female": 71
      },
      {
        "age_group": "26-35",
        "count": 298,
        "male": 165,
        "female": 133
      },
      {
        "age_group": "36-45",
        "count": 345,
        "male": 189,
        "female": 156
      },
      {
        "age_group": "46-55",
        "count": 278,
        "male": 152,
        "female": 126
      },
      {
        "age_group": "56+",
        "count": 157,
        "male": 87,
        "female": 70
      }
    ]
  },
  "meta": {
    "election_id": 1,
    "total_committees": 15,
    "total_families": 89,
    "last_updated": "2025-11-04T15:30:00Z"
  }
}
```

#### Data Requirements
- **Total**: Count of all active electors
- **Male/Female**: Count by gender
- **Percentages**: Rounded to 1 decimal place
- **By Committee**: All committees with counts
- **By Family**: Top 10 families by elector count
- **By Age**: Age groups (if birth date available, else empty array)

#### Business Logic
1. Get all electors for election's committees
2. Filter only active electors (is_active=True)
3. Count total and by gender
4. Calculate percentages
5. Group by committee and count gender
6. Group by family_name, count total and by gender
7. Sort families by count descending, take top 10
8. (Optional) Calculate age from birth_date if available
9. Return comprehensive demographics

---

## 4. Database Queries

### 4.1 Guarantees Trend Query

```python
from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from datetime import datetime, timedelta
from apps.guarantees.models import Guarantee

def get_guarantees_trend(user, period='30days'):
    """
    Get daily guarantee trend data.
    
    Args:
        user: Current user
        period: Time period ('7days', '30days', '90days', 'all')
    
    Returns:
        QuerySet with date, strong, medium, weak counts
    """
    # Calculate date range
    end_date = datetime.now().date()
    
    if period == '7days':
        start_date = end_date - timedelta(days=7)
    elif period == '30days':
        start_date = end_date - timedelta(days=30)
    elif period == '90days':
        start_date = end_date - timedelta(days=90)
    else:  # 'all'
        start_date = None
    
    # Base query
    queryset = Guarantee.objects.filter(user=user)
    
    # Apply date filter
    if start_date:
        queryset = queryset.filter(created_at__date__gte=start_date)
    
    # Group by date and count by status
    data = queryset.annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        strong=Count('id', filter=Q(status='STRONG')),
        medium=Count('id', filter=Q(status='MEDIUM')),
        weak=Count('id', filter=Q(status='WEAK')),
        total=Count('id')
    ).order_by('date')
    
    return data
```

### 4.2 Group Performance Query

```python
from django.db.models import Count, Q, Max
from apps.guarantees.models import GuaranteeGroup, Guarantee
from django.utils import timezone
from datetime import timedelta

def get_group_performance(user, status_filter='all'):
    """
    Get performance metrics for guarantee groups.
    
    Args:
        user: Current user
        status_filter: 'active', 'inactive', 'pending', or 'all'
    
    Returns:
        List of group performance data
    """
    groups = GuaranteeGroup.objects.filter(user=user).annotate(
        guarantees_count=Count('guarantees'),
        strong_count=Count('guarantees', filter=Q(guarantees__status='STRONG')),
        medium_count=Count('guarantees', filter=Q(guarantees__status='MEDIUM')),
        weak_count=Count('guarantees', filter=Q(guarantees__status='WEAK')),
        last_activity=Max('guarantees__created_at')
    )
    
    # Calculate derived fields
    seven_days_ago = timezone.now() - timedelta(days=7)
    
    results = []
    for group in groups:
        # Determine status
        if group.guarantees_count == 0:
            group_status = 'pending'
        elif group.last_activity and group.last_activity >= seven_days_ago:
            group_status = 'active'
        else:
            group_status = 'inactive'
        
        # Apply filter
        if status_filter != 'all' and group_status != status_filter:
            continue
        
        # Calculate conversion rate
        conversion_rate = 0
        if group.guarantees_count > 0:
            conversion_rate = round(
                (group.strong_count / group.guarantees_count) * 100, 
                1
            )
        
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
```

### 4.3 Hourly Attendance Query

```python
from django.db.models import Count, Q
from django.db.models.functions import ExtractHour
from apps.attendees.models import Attendance
from apps.voting.models import Vote
from datetime import datetime

def get_hourly_attendance(election_id, date=None):
    """
    Get hourly attendance breakdown.
    
    Args:
        election_id: Election ID
        date: Date string (YYYY-MM-DD) or None for today
    
    Returns:
        List of hourly attendance data
    """
    if date:
        target_date = datetime.strptime(date, '%Y-%m-%d').date()
    else:
        target_date = datetime.now().date()
    
    # Get committees for this election
    from apps.elections.models import Committee
    committees = Committee.objects.filter(election_id=election_id)
    
    # Get attendance for the date
    attendance_qs = Attendance.objects.filter(
        committee__in=committees,
        attended_at__date=target_date
    ).annotate(
        hour=ExtractHour('attended_at')
    )
    
    # Group by hour and count
    hourly_data = attendance_qs.values('hour').annotate(
        attendance_count=Count('id')
    ).order_by('hour')
    
    # Get vote counts per hour
    # Assuming Vote model has timestamp and elector reference
    votes_qs = Vote.objects.filter(
        committee__in=committees,
        created_at__date=target_date
    ).annotate(
        hour=ExtractHour('created_at')
    )
    
    hourly_votes = votes_qs.values('hour').annotate(
        vote_count=Count('id')
    ).order_by('hour')
    
    # Create hour map (08:00 to 17:00)
    hour_map = {hour: {'attendance': 0, 'votes': 0} for hour in range(8, 18)}
    
    # Fill attendance data
    for item in hourly_data:
        if 8 <= item['hour'] <= 17:
            hour_map[item['hour']]['attendance'] = item['attendance_count']
    
    # Fill vote data
    for item in hourly_votes:
        if 8 <= item['hour'] <= 17:
            hour_map[item['hour']]['votes'] = item['vote_count']
    
    # Calculate target
    total_electors = sum(c.electors.filter(is_active=True).count() for c in committees)
    target_per_hour = round(total_electors / 10)  # 10 hours
    
    # Format result
    result = []
    for hour in range(8, 18):
        result.append({
            'hour': f"{hour:02d}:00",
            'attendance': hour_map[hour]['attendance'],
            'votes': hour_map[hour]['votes'],
            'target': target_per_hour
        })
    
    return result
```

### 4.4 Gender Demographics Query

```python
from django.db.models import Count, Q
from apps.electors.models import Elector
from apps.elections.models import Committee

def get_elector_demographics(election_id):
    """
    Get demographic breakdown of electors.
    
    Args:
        election_id: Election ID
    
    Returns:
        Dict with comprehensive demographic data
    """
    # Get committees for this election
    committees = Committee.objects.filter(election_id=election_id)
    
    # Get all active electors
    electors = Elector.objects.filter(
        committee__in=committees,
        is_active=True
    )
    
    # Overall counts
    total = electors.count()
    male_count = electors.filter(gender='MALE').count()
    female_count = electors.filter(gender='FEMALE').count()
    
    male_percentage = round((male_count / total * 100), 1) if total > 0 else 0
    female_percentage = round((female_count / total * 100), 1) if total > 0 else 0
    
    # By committee
    by_committee = []
    for committee in committees:
        committee_electors = electors.filter(committee=committee)
        by_committee.append({
            'committee_id': committee.id,
            'committee_name': committee.name,
            'male': committee_electors.filter(gender='MALE').count(),
            'female': committee_electors.filter(gender='FEMALE').count()
        })
    
    # By family (top 10)
    by_family = electors.values('family_name').annotate(
        count=Count('id'),
        male=Count('id', filter=Q(gender='MALE')),
        female=Count('id', filter=Q(gender='FEMALE'))
    ).order_by('-count')[:10]
    
    by_family_list = [
        {
            'family_name': item['family_name'],
            'count': item['count'],
            'male': item['male'],
            'female': item['female']
        }
        for item in by_family
    ]
    
    # By age (placeholder - implement if birth_date field exists)
    by_age = []
    # If you have birth_date field:
    # from datetime import date
    # today = date.today()
    # age_groups = [
    #     ('18-25', 18, 25),
    #     ('26-35', 26, 35),
    #     ('36-45', 36, 45),
    #     ('46-55', 46, 55),
    #     ('56+', 56, 150)
    # ]
    # for group_name, min_age, max_age in age_groups:
    #     ... calculate based on birth_date
    
    return {
        'total': total,
        'male': male_count,
        'female': female_count,
        'male_percentage': male_percentage,
        'female_percentage': female_percentage,
        'by_committee': by_committee,
        'by_family': by_family_list,
        'by_age': by_age
    }
```

---

## 5. Implementation Steps

### Step 1: Create Serializers

**File:** `backend/apps/elections/serializers/dashboard_serializers.py`

```python
"""
Dashboard API Serializers
"""
from rest_framework import serializers


class GuaranteeTrendSerializer(serializers.Serializer):
    """Serializer for guarantee trend data."""
    date = serializers.DateField()
    strong = serializers.IntegerField()
    medium = serializers.IntegerField()
    weak = serializers.IntegerField()
    total = serializers.IntegerField()


class GroupPerformanceSerializer(serializers.Serializer):
    """Serializer for group performance data."""
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
    """Serializer for hourly attendance data."""
    hour = serializers.CharField()
    attendance = serializers.IntegerField()
    votes = serializers.IntegerField()
    target = serializers.IntegerField()


class ElectorDemographicsSerializer(serializers.Serializer):
    """Serializer for elector demographics."""
    total = serializers.IntegerField()
    male = serializers.IntegerField()
    female = serializers.IntegerField()
    male_percentage = serializers.FloatField()
    female_percentage = serializers.FloatField()
    by_committee = serializers.ListField()
    by_family = serializers.ListField()
    by_age = serializers.ListField()
```

### Step 2: Create Views

**File:** `backend/apps/elections/views/dashboard_views.py`

```python
"""
Dashboard API Views
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from apps.elections.models import Election
from apps.elections.serializers.dashboard_serializers import (
    GuaranteeTrendSerializer,
    GroupPerformanceSerializer,
    HourlyAttendanceSerializer,
    ElectorDemographicsSerializer
)
# Import your query functions from section 4
from apps.elections.utils.dashboard_queries import (
    get_guarantees_trend,
    get_group_performance,
    get_hourly_attendance,
    get_elector_demographics
)


class GuaranteesTrendView(APIView):
    """
    GET /api/elections/{election_id}/dashboard/guarantees/trends
    
    Query Parameters:
        - period: '7days', '30days', '90days', 'all' (default: '30days')
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, election_id):
        # Verify election exists and user has access
        election = get_object_or_404(Election, id=election_id)
        
        # Get period parameter
        period = request.query_params.get('period', '30days')
        
        # Validate period
        if period not in ['7days', '30days', '90days', 'all']:
            return Response(
                {'error': 'Invalid period. Must be: 7days, 30days, 90days, or all'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get data
        data = get_guarantees_trend(request.user, period)
        
        # Serialize
        serializer = GuaranteeTrendSerializer(data, many=True)
        
        # Calculate metadata
        total_guarantees = sum(item['total'] for item in serializer.data)
        start_date = serializer.data[0]['date'] if serializer.data else None
        end_date = serializer.data[-1]['date'] if serializer.data else None
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'period': period,
                'start_date': start_date,
                'end_date': end_date,
                'total_days': len(serializer.data),
                'total_guarantees': total_guarantees
            }
        })


class GroupPerformanceView(APIView):
    """
    GET /api/elections/{election_id}/dashboard/groups/performance
    
    Query Parameters:
        - status: 'active', 'inactive', 'pending', 'all' (default: 'all')
        - sort_by: 'name', 'guarantees_desc', 'conversion_desc' (default: 'guarantees_desc')
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, election_id):
        # Verify election exists
        election = get_object_or_404(Election, id=election_id)
        
        # Get parameters
        status_filter = request.query_params.get('status', 'all')
        sort_by = request.query_params.get('sort_by', 'guarantees_desc')
        
        # Get data
        data = get_group_performance(request.user, status_filter)
        
        # Apply sorting
        if sort_by == 'name':
            data.sort(key=lambda x: x['name'])
        elif sort_by == 'guarantees_desc':
            data.sort(key=lambda x: x['guarantees_count'], reverse=True)
        elif sort_by == 'conversion_desc':
            data.sort(key=lambda x: x['conversion_rate'], reverse=True)
        
        # Serialize
        serializer = GroupPerformanceSerializer(data, many=True)
        
        # Calculate metadata
        total_guarantees = sum(item['guarantees_count'] for item in serializer.data)
        active_count = sum(1 for item in serializer.data if item['status'] == 'active')
        avg_conversion = sum(item['conversion_rate'] for item in serializer.data) / len(serializer.data) if serializer.data else 0
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'total_groups': len(serializer.data),
                'active_groups': active_count,
                'total_guarantees': total_guarantees,
                'average_conversion_rate': round(avg_conversion, 1)
            }
        })


class HourlyAttendanceView(APIView):
    """
    GET /api/elections/{election_id}/dashboard/attendance/hourly
    
    Query Parameters:
        - date: 'YYYY-MM-DD' (default: today)
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, election_id):
        # Verify election exists
        election = get_object_or_404(Election, id=election_id)
        
        # Get date parameter
        date_str = request.query_params.get('date', None)
        
        # Get data
        data = get_hourly_attendance(election_id, date_str)
        
        # Serialize
        serializer = HourlyAttendanceSerializer(data, many=True)
        
        # Calculate metadata
        total_attendance = sum(item['attendance'] for item in serializer.data)
        total_votes = sum(item['votes'] for item in serializer.data)
        total_target = sum(item['target'] for item in serializer.data)
        
        attendance_pct = round((total_attendance / total_target * 100), 1) if total_target > 0 else 0
        voting_pct = round((total_votes / total_attendance * 100), 1) if total_attendance > 0 else 0
        
        # Find peak hour
        peak_item = max(serializer.data, key=lambda x: x['attendance']) if serializer.data else None
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'date': date_str or datetime.now().date().isoformat(),
                'total_attendance': total_attendance,
                'total_votes': total_votes,
                'total_target': total_target,
                'attendance_percentage': attendance_pct,
                'voting_percentage': voting_pct,
                'peak_hour': peak_item['hour'] if peak_item else None,
                'peak_attendance': peak_item['attendance'] if peak_item else 0
            }
        })


class ElectorDemographicsView(APIView):
    """
    GET /api/elections/{election_id}/dashboard/electors/demographics
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, election_id):
        # Verify election exists
        election = get_object_or_404(Election, id=election_id)
        
        # Get data
        data = get_elector_demographics(election_id)
        
        # Serialize
        serializer = ElectorDemographicsSerializer(data)
        
        return Response({
            'status': 'success',
            'data': serializer.data,
            'meta': {
                'election_id': election_id,
                'total_committees': len(data['by_committee']),
                'total_families': len(data['by_family']),
                'last_updated': datetime.now().isoformat()
            }
        })
```

### Step 3: Create Query Utilities

**File:** `backend/apps/elections/utils/dashboard_queries.py`

```python
"""
Dashboard Query Utilities

Contains all database query logic for dashboard APIs.
"""
# Copy all the query functions from Section 4 here
# (get_guarantees_trend, get_group_performance, get_hourly_attendance, get_elector_demographics)
```

### Step 4: Update URLs

**File:** `backend/apps/elections/urls.py`

```python
from django.urls import path
from apps.elections.views.dashboard_views import (
    GuaranteesTrendView,
    GroupPerformanceView,
    HourlyAttendanceView,
    ElectorDemographicsView
)

urlpatterns = [
    # ... existing election URLs ...
    
    # Dashboard endpoints
    path(
        'elections/<int:election_id>/dashboard/guarantees/trends',
        GuaranteesTrendView.as_view(),
        name='dashboard-guarantees-trends'
    ),
    path(
        'elections/<int:election_id>/dashboard/groups/performance',
        GroupPerformanceView.as_view(),
        name='dashboard-groups-performance'
    ),
    path(
        'elections/<int:election_id>/dashboard/attendance/hourly',
        HourlyAttendanceView.as_view(),
        name='dashboard-attendance-hourly'
    ),
    path(
        'elections/<int:election_id>/dashboard/electors/demographics',
        ElectorDemographicsView.as_view(),
        name='dashboard-electors-demographics'
    ),
]
```

### Step 5: Test Endpoints

Run Django development server and test each endpoint:

```bash
# Start server
python manage.py runserver

# Test guarantees trend
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://127.0.0.1:8000/api/elections/1/dashboard/guarantees/trends?period=30days"

# Test group performance
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://127.0.0.1:8000/api/elections/1/dashboard/groups/performance"

# Test hourly attendance
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://127.0.0.1:8000/api/elections/1/dashboard/attendance/hourly?date=2025-11-04"

# Test demographics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://127.0.0.1:8000/api/elections/1/dashboard/electors/demographics"
```

---

## 6. Response Format Standards

### 6.1 Success Response

All successful responses follow this format:

```json
{
  "status": "success",
  "data": { ... },
  "meta": { ... }
}
```

- **status**: Always "success"
- **data**: Main response data (array or object)
- **meta**: Metadata about the response (counts, dates, etc.)

### 6.2 Error Response

```json
{
  "status": "error",
  "error": "Error message",
  "details": { ... }
}
```

- **status**: Always "error"
- **error**: Human-readable error message
- **details**: Additional error information (optional)

### 6.3 HTTP Status Codes

- **200 OK**: Success
- **400 Bad Request**: Invalid parameters
- **401 Unauthorized**: Not authenticated
- **403 Forbidden**: No permission
- **404 Not Found**: Election not found
- **500 Internal Server Error**: Server error

---

## 7. Performance Optimization

### 7.1 Database Indexing

Ensure these indexes exist:

```python
# In models
class Guarantee:
    class Meta:
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['group']),
        ]

class Attendance:
    class Meta:
        indexes = [
            models.Index(fields=['committee', 'attended_at']),
            models.Index(fields=['-attended_at']),
        ]

class Elector:
    class Meta:
        indexes = [
            models.Index(fields=['committee', 'gender']),
            models.Index(fields=['family_name']),
        ]
```

### 7.2 Caching Strategy

Implement caching for expensive queries:

```python
from django.core.cache import cache
from django.utils.encoding import force_str

class GuaranteesTrendView(APIView):
    def get(self, request, election_id):
        period = request.query_params.get('period', '30days')
        
        # Create cache key
        cache_key = f'dashboard:guarantees:{request.user.id}:{period}'
        
        # Try to get from cache
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
        
        # Get fresh data
        data = get_guarantees_trend(request.user, period)
        # ... process data ...
        
        response_data = {
            'status': 'success',
            'data': serializer.data,
            'meta': { ... }
        }
        
        # Cache for 5 minutes
        cache.set(cache_key, response_data, 300)
        
        return Response(response_data)
```

### 7.3 Query Optimization

- **Use select_related()** for foreign keys:
  ```python
  Guarantee.objects.select_related('user', 'group', 'elector')
  ```

- **Use prefetch_related()** for reverse foreign keys:
  ```python
  GuaranteeGroup.objects.prefetch_related('guarantees')
  ```

- **Use only()** to limit fields:
  ```python
  Elector.objects.only('koc_id', 'gender', 'family_name')
  ```

- **Use aggregate()** instead of Python loops:
  ```python
  from django.db.models import Count
  groups.annotate(guarantee_count=Count('guarantees'))
  ```

### 7.4 Pagination

For large datasets, implement pagination:

```python
from rest_framework.pagination import PageNumberPagination

class DashboardPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class GroupPerformanceView(APIView):
    pagination_class = DashboardPagination
    
    def get(self, request, election_id):
        # ... get data ...
        
        # Apply pagination
        paginator = self.pagination_class()
        paginated_data = paginator.paginate_queryset(data, request)
        
        serializer = GroupPerformanceSerializer(paginated_data, many=True)
        
        return paginator.get_paginated_response(serializer.data)
```

---

## 8. Testing

### 8.1 Unit Tests

**File:** `backend/apps/elections/tests/test_dashboard_views.py`

```python
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.elections.models import Election
from apps.guarantees.models import Guarantee, GuaranteeGroup
from apps.electors.models import Elector

User = get_user_model()


class DashboardAPITestCase(TestCase):
    def setUp(self):
        """Set up test data."""
        # Create user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        # Create election
        self.election = Election.objects.create(
            name='Test Election 2025',
            date='2025-11-10'
        )
        
        # Create API client
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_guarantees_trend_endpoint(self):
        """Test guarantees trend API."""
        # Create test guarantees
        # ... create test data ...
        
        # Make request
        response = self.client.get(
            f'/api/elections/{self.election.id}/dashboard/guarantees/trends',
            {'period': '30days'}
        )
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'success')
        self.assertIn('data', response.data)
        self.assertIn('meta', response.data)
    
    def test_group_performance_endpoint(self):
        """Test group performance API."""
        # Create test groups and guarantees
        # ... create test data ...
        
        response = self.client.get(
            f'/api/elections/{self.election.id}/dashboard/groups/performance'
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data['data'], list)
    
    def test_hourly_attendance_endpoint(self):
        """Test hourly attendance API."""
        # Create test attendance records
        # ... create test data ...
        
        response = self.client.get(
            f'/api/elections/{self.election.id}/dashboard/attendance/hourly'
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['data']), 10)  # 10 hours
    
    def test_demographics_endpoint(self):
        """Test demographics API."""
        # Create test electors
        # ... create test data ...
        
        response = self.client.get(
            f'/api/elections/{self.election.id}/dashboard/electors/demographics'
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('male', response.data['data'])
        self.assertIn('female', response.data['data'])
```

### 8.2 Run Tests

```bash
# Run all dashboard tests
python manage.py test apps.elections.tests.test_dashboard_views

# Run with coverage
coverage run --source='.' manage.py test apps.elections.tests.test_dashboard_views
coverage report

# Run specific test
python manage.py test apps.elections.tests.test_dashboard_views.DashboardAPITestCase.test_guarantees_trend_endpoint
```

---

## 9. Deployment Checklist

### Pre-Deployment

- [ ] All unit tests passing
- [ ] Database migrations applied
- [ ] Indexes created for performance
- [ ] Caching configured
- [ ] CORS settings updated for frontend domain
- [ ] Environment variables set
- [ ] API documentation updated

### Deployment Steps

1. **Apply Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Create Indexes**
   ```bash
   python manage.py sqlmigrate elections 0001 | grep INDEX
   ```

3. **Update Frontend .env**
   ```bash
   # In frontend/.env
   VITE_USE_MOCK_DASHBOARD=false
   ```

4. **Restart Services**
   ```bash
   sudo systemctl restart gunicorn
   sudo systemctl restart nginx
   ```

5. **Test in Production**
   ```bash
   # Test each endpoint with production URL
   curl -H "Authorization: Bearer TOKEN" \
     "https://your-domain.com/api/elections/1/dashboard/guarantees/trends"
   ```

### Post-Deployment

- [ ] Monitor error logs
- [ ] Check response times
- [ ] Verify cache hit rates
- [ ] Test with real user accounts
- [ ] Document any issues
- [ ] Create runbook for common problems

---

## 10. Troubleshooting

### Common Issues

#### Issue: Slow Query Performance
**Solution:**
1. Check database indexes
2. Use Django Debug Toolbar to analyze queries
3. Add caching
4. Optimize aggregations

#### Issue: 404 Errors
**Solution:**
1. Verify URL patterns in `urls.py`
2. Check election_id is valid
3. Ensure user has permission

#### Issue: Empty Data
**Solution:**
1. Check database has data
2. Verify user ownership (guarantees)
3. Check date filters
4. Inspect query logic

#### Issue: Frontend Not Calling APIs
**Solution:**
1. Check `.env` has `VITE_USE_MOCK_DASHBOARD=false`
2. Restart frontend dev server
3. Check browser console for errors
4. Verify CORS settings

---

## 11. Additional Resources

### Documentation
- Django ORM: https://docs.djangoproject.com/en/4.2/topics/db/queries/
- Django REST Framework: https://www.django-rest-framework.org/
- PostgreSQL Performance: https://www.postgresql.org/docs/current/performance-tips.html

### Tools
- Django Debug Toolbar: https://django-debug-toolbar.readthedocs.io/
- Postman: For API testing
- pgAdmin: For database inspection

---

## 12. Support & Questions

For questions or issues:
1. Check this documentation first
2. Review Django logs: `logs/django.log`
3. Check PostgreSQL logs
4. Review frontend console errors
5. Ask team for help

---

**Document Version:** 1.0  
**Last Updated:** November 4, 2025  
**Maintained By:** Backend Development Team

✅ **Ready to Implement!** Follow the steps in order and your dashboard will be fully functional with real data.

