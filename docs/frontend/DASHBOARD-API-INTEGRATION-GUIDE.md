# Dashboard API Integration Guide

**Version**: 1.0  
**Last Updated**: November 3, 2025

---

## 📡 Overview

This guide provides complete API specifications for integrating real data into the Election Dashboard. All endpoints and data formats are documented for backend developers.

---

## 🗺️ API Endpoints Required

### 1. Guarantee Statistics
**Purpose**: Provide aggregate statistics for guarantees

```http
GET /api/elections/{electionId}/guarantees/stats
```

**Response**:
```typescript
{
  "total": number,           // Total guarantees
  "strong": number,          // Strong guarantees count
  "medium": number,          // Medium guarantees count
  "weak": number,            // Weak guarantees count
  "pendingFollowUp": number, // Guarantees pending follow-up
  "overdue": number         // Overdue guarantees
}
```

**Example**:
```json
{
  "total": 450,
  "strong": 280,
  "medium": 120,
  "weak": 50,
  "pendingFollowUp": 35,
  "overdue": 12
}
```

**Usage in Dashboard**:
- Top statistics card (Guarantees)
- Guarantees tab summary cards
- Guarantees Overview Mini-Card in Election tab

---

### 2. Guarantee Groups Performance
**Purpose**: Provide performance metrics for guarantee groups

```http
GET /api/elections/{electionId}/guarantees/groups/performance
```

**Response**:
```typescript
{
  "groups": GuaranteeGroup[]
}

interface GuaranteeGroup {
  id: number;
  name: string;
  color: string;            // Hex color (#FF5733)
  totalGuarantees: number;
  strongCount: number;
  mediumCount: number;
  weakCount: number;
  attendanceRate: number;   // 0-100
  votingRate: number;       // 0-100
  conversionRate: number;   // 0-100
}
```

**Example**:
```json
{
  "groups": [
    {
      "id": 1,
      "name": "Downtown Team",
      "color": "#1976d2",
      "totalGuarantees": 120,
      "strongCount": 80,
      "mediumCount": 30,
      "weakCount": 10,
      "attendanceRate": 85.5,
      "votingRate": 92.3,
      "conversionRate": 78.9
    },
    {
      "id": 2,
      "name": "Suburban Group",
      "color": "#388e3c",
      "totalGuarantees": 95,
      "strongCount": 60,
      "mediumCount": 25,
      "weakCount": 10,
      "attendanceRate": 78.2,
      "votingRate": 88.7,
      "conversionRate": 69.3
    }
  ]
}
```

**Usage in Dashboard**:
- GroupPerformanceTable component in Guarantees tab

---

### 3. Guarantee Trend Data
**Purpose**: Provide time-series data for guarantee collection trends

```http
GET /api/elections/{electionId}/guarantees/trend?period={period}
```

**Query Parameters**:
- `period`: "7d" | "30d" | "90d" | "all"

**Response**:
```typescript
{
  "data": TrendDataPoint[]
}

interface TrendDataPoint {
  date: string;        // ISO 8601 format
  strong: number;
  medium: number;
  weak: number;
  total: number;
}
```

**Example**:
```json
{
  "data": [
    {
      "date": "2025-10-01",
      "strong": 45,
      "medium": 20,
      "weak": 10,
      "total": 75
    },
    {
      "date": "2025-10-08",
      "strong": 92,
      "medium": 45,
      "weak": 18,
      "total": 155
    },
    {
      "date": "2025-10-15",
      "strong": 145,
      "medium": 75,
      "weak": 28,
      "total": 248
    }
  ]
}
```

**Usage in Dashboard**:
- GuaranteesTrendChart component in Guarantees tab

---

### 4. Hourly Attendance Data
**Purpose**: Provide attendance breakdown by hour for election day

```http
GET /api/elections/{electionId}/attendance/hourly?date={date}
```

**Query Parameters**:
- `date`: Date in YYYY-MM-DD format (defaults to today)

**Response**:
```typescript
{
  "data": HourlyData[]
}

interface HourlyData {
  hour: string;        // "08:00", "09:00", etc.
  count: number;       // New attendees in this hour
  cumulative: number;  // Total attendees up to this hour
}
```

**Example**:
```json
{
  "data": [
    {
      "hour": "08:00",
      "count": 45,
      "cumulative": 45
    },
    {
      "hour": "09:00",
      "count": 120,
      "cumulative": 165
    },
    {
      "hour": "10:00",
      "count": 180,
      "cumulative": 345
    },
    {
      "hour": "11:00",
      "count": 210,
      "cumulative": 555
    },
    {
      "hour": "12:00",
      "count": 95,
      "cumulative": 650
    }
  ]
}
```

**Usage in Dashboard**:
- HourlyAttendanceChart component in Attendance tab

---

### 5. Elector Demographics
**Purpose**: Provide demographic breakdown of electors

```http
GET /api/elections/{electionId}/electors/demographics
```

**Response**:
```typescript
{
  "maleCount": number;
  "femaleCount": number;
  "totalFamilies": number;
  "avgFamilySize": number;
  "ageDistribution": AgeGroup[];
}

interface AgeGroup {
  range: string;      // "18-25", "26-35", etc.
  count: number;
}
```

**Example**:
```json
{
  "maleCount": 548,
  "femaleCount": 452,
  "totalFamilies": 285,
  "avgFamilySize": 3.5,
  "ageDistribution": [
    {
      "range": "18-25",
      "count": 120
    },
    {
      "range": "26-35",
      "count": 280
    },
    {
      "range": "36-45",
      "count": 310
    },
    {
      "range": "46-55",
      "count": 190
    },
    {
      "range": "56+",
      "count": 100
    }
  ]
}
```

**Usage in Dashboard**:
- GenderDistributionChart component in Electors tab
- Electors summary cards

---

### 6. Real-Time Dashboard Updates (WebSocket)
**Purpose**: Push real-time updates to dashboard

```
WebSocket: ws://api.example.com/elections/{electionId}/realtime
```

**Message Types**:

#### Attendance Update
```typescript
{
  "type": "attendance_update",
  "data": {
    "committeeId": string,
    "newCount": number,
    "timestamp": string  // ISO 8601
  }
}
```

#### Vote Update
```typescript
{
  "type": "vote_update",
  "data": {
    "committeeId": string,
    "newCount": number,
    "timestamp": string
  }
}
```

#### Guarantee Update
```typescript
{
  "type": "guarantee_update",
  "data": {
    "groupId": number,
    "type": "strong" | "medium" | "weak",
    "change": number,  // +1, -1, etc.
    "timestamp": string
  }
}
```

**Connection Example**:
```typescript
import { useWebSocket } from 'hooks/dashboard/useRealTimeUpdates';

const { isConnected, send } = useWebSocket(
  `ws://api.example.com/elections/${electionId}/realtime`,
  (message) => {
    // Handle incoming message
    console.log('Received:', message);
    
    switch (message.type) {
      case 'attendance_update':
        updateAttendanceData(message.data);
        break;
      case 'vote_update':
        updateVoteData(message.data);
        break;
      case 'guarantee_update':
        updateGuaranteeData(message.data);
        break;
    }
  }
);
```

---

## 🔧 Frontend Integration

### Step 1: Create API Service

**File**: `frontend/src/services/dashboardApi.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const dashboardApi = {
  // Guarantee Statistics
  async getGuaranteeStats(electionId: number) {
    const response = await axios.get(`${API_BASE_URL}/elections/${electionId}/guarantees/stats`);
    return response.data;
  },

  // Guarantee Groups Performance
  async getGuaranteeGroupsPerformance(electionId: number) {
    const response = await axios.get(`${API_BASE_URL}/elections/${electionId}/guarantees/groups/performance`);
    return response.data.groups;
  },

  // Guarantee Trend
  async getGuaranteeTrend(electionId: number, period: '7d' | '30d' | '90d' | 'all') {
    const response = await axios.get(`${API_BASE_URL}/elections/${electionId}/guarantees/trend`, {
      params: { period }
    });
    return response.data.data;
  },

  // Hourly Attendance
  async getHourlyAttendance(electionId: number, date?: string) {
    const response = await axios.get(`${API_BASE_URL}/elections/${electionId}/attendance/hourly`, {
      params: date ? { date } : {}
    });
    return response.data.data;
  },

  // Elector Demographics
  async getElectorDemographics(electionId: number) {
    const response = await axios.get(`${API_BASE_URL}/elections/${electionId}/electors/demographics`);
    return response.data;
  }
};
```

---

### Step 2: Update DashboardView Component

**File**: `frontend/src/views/election/components/DashboardView.tsx`

```typescript
import { useEffect, useState } from 'react';
import { dashboardApi } from 'services/dashboardApi';
import { useRealTimeUpdates } from 'hooks/dashboard/useRealTimeUpdates';

const DashboardView: React.FC<DashboardViewProps> = ({ election, /* ... */ }) => {
  // State for API data
  const [guaranteeStats, setGuaranteeStats] = useState(mockGuaranteeStats);
  const [guaranteeGroups, setGuaranteeGroups] = useState<GuaranteeGroup[]>([]);
  const [hourlyAttendance, setHourlyAttendance] = useState<HourlyData[]>([]);
  const [electorDemographics, setElectorDemographics] = useState<any>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, groups, hourly, demographics] = await Promise.all([
          dashboardApi.getGuaranteeStats(election.id),
          dashboardApi.getGuaranteeGroupsPerformance(election.id),
          dashboardApi.getHourlyAttendance(election.id),
          dashboardApi.getElectorDemographics(election.id)
        ]);

        setGuaranteeStats(stats);
        setGuaranteeGroups(groups);
        setHourlyAttendance(hourly);
        setElectorDemographics(demographics);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [election.id]);

  // Optional: Enable real-time updates
  const { isLive } = useRealTimeUpdates(
    async () => {
      const stats = await dashboardApi.getGuaranteeStats(election.id);
      setGuaranteeStats(stats);
      return stats;
    },
    { enabled: true, interval: 30 }
  );

  // Use the state in components
  return (
    <Box sx={{ p: 3 }}>
      {/* ... */}
      
      {/* In Guarantees Tab */}
      <GroupPerformanceTable groups={guaranteeGroups} />
      
      {/* In Attendance Tab */}
      <HourlyAttendanceChart data={hourlyAttendance} />
      
      {/* In Electors Tab */}
      {electorDemographics && (
        <GenderDistributionChart 
          maleCount={electorDemographics.maleCount} 
          femaleCount={electorDemographics.femaleCount} 
        />
      )}
    </Box>
  );
};
```

---

### Step 3: Uncomment Components in DashboardView

Once API is integrated, uncomment these lines in `DashboardView.tsx`:

#### Guarantees Tab (lines ~840, ~843):
```typescript
<GroupPerformanceTable groups={guaranteeGroups} />
<GuaranteesTrendChart data={guaranteeTrendData} />
```

#### Attendance Tab (line ~868):
```typescript
<HourlyAttendanceChart data={hourlyAttendance} />
```

#### Electors Tab (line ~933):
```typescript
<GenderDistributionChart 
  maleCount={electorDemographics.maleCount} 
  femaleCount={electorDemographics.femaleCount} 
/>
```

---

## 🧪 Testing API Integration

### Mock Data Setup (for development)

**File**: `frontend/src/services/__mocks__/dashboardApi.ts`

```typescript
export const mockGuaranteeStats = {
  total: 450,
  strong: 280,
  medium: 120,
  weak: 50,
  pendingFollowUp: 35,
  overdue: 12
};

export const mockGuaranteeGroups = [
  {
    id: 1,
    name: "Downtown Team",
    color: "#1976d2",
    totalGuarantees: 120,
    strongCount: 80,
    mediumCount: 30,
    weakCount: 10,
    attendanceRate: 85.5,
    votingRate: 92.3,
    conversionRate: 78.9
  },
  // ... more groups
];

export const mockHourlyAttendance = [
  { hour: "08:00", count: 45, cumulative: 45 },
  { hour: "09:00", count: 120, cumulative: 165 },
  { hour: "10:00", count: 180, cumulative: 345 },
  // ... more hours
];

export const dashboardApi = {
  async getGuaranteeStats() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGuaranteeStats), 500);
    });
  },
  
  async getGuaranteeGroupsPerformance() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGuaranteeGroups), 500);
    });
  },
  
  async getHourlyAttendance() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockHourlyAttendance), 500);
    });
  }
};
```

---

## 🛠️ Backend Implementation Checklist

### Database Schema
- [ ] Guarantees table with status field (STRONG/MEDIUM/WEAK)
- [ ] GuaranteeGroups table with group details
- [ ] Attendance logs with timestamp
- [ ] Elector demographics fields

### API Endpoints
- [ ] GET /api/elections/{id}/guarantees/stats
- [ ] GET /api/elections/{id}/guarantees/groups/performance
- [ ] GET /api/elections/{id}/guarantees/trend
- [ ] GET /api/elections/{id}/attendance/hourly
- [ ] GET /api/elections/{id}/electors/demographics

### WebSocket (Optional)
- [ ] WebSocket server setup
- [ ] Real-time event broadcasting
- [ ] Connection authentication
- [ ] Message queue for reliability

### Caching
- [ ] Redis cache for frequently accessed stats
- [ ] Cache invalidation on data updates
- [ ] TTL configuration

### Performance
- [ ] Database indexing on key fields
- [ ] Query optimization
- [ ] Rate limiting on endpoints
- [ ] Pagination for large datasets

---

## 📊 Data Validation

### Frontend Validation

All components include built-in validation:

```typescript
// Example from GroupPerformanceTable
if (groups.length === 0) {
  return (
    <Paper>
      <Typography>No guarantee groups data available</Typography>
    </Paper>
  );
}
```

### Backend Validation

Recommended validation on backend:

```python
# Example in Python/FastAPI
from pydantic import BaseModel, validator

class GuaranteeStats(BaseModel):
    total: int
    strong: int
    medium: int
    weak: int
    pending_follow_up: int
    overdue: int

    @validator('total')
    def total_must_match_sum(cls, v, values):
        if 'strong' in values and 'medium' in values and 'weak' in values:
            sum_parts = values['strong'] + values['medium'] + values['weak']
            if v != sum_parts:
                raise ValueError('total must equal sum of strong, medium, and weak')
        return v
```

---

## 🔐 Security Considerations

### Authentication
- All endpoints require authentication
- Use JWT tokens or session-based auth
- Validate election access permissions

### Authorization
- Check user has access to specific election
- Verify role permissions (admin, operator, viewer)

### Rate Limiting
- Implement rate limiting per user/IP
- WebSocket connection limits
- Prevent DoS attacks

### Data Sanitization
- Sanitize all inputs
- Validate date formats
- Check ID parameters exist

---

## 📈 Performance Optimization

### Backend
- Database query optimization
- Indexes on frequently queried fields
- Caching with Redis
- Connection pooling
- Async processing for heavy operations

### Frontend
- React.memo for expensive components
- useMemo for calculations
- Debounce real-time updates
- Lazy loading for charts
- Virtual scrolling for tables

---

## 🐛 Error Handling

### Frontend Error Handling

```typescript
try {
  const stats = await dashboardApi.getGuaranteeStats(election.id);
  setGuaranteeStats(stats);
} catch (error) {
  console.error('Error fetching guarantee stats:', error);
  // Show toast notification
  toast.error('Failed to load guarantee statistics');
  // Fallback to mock data or cached data
  setGuaranteeStats(mockGuaranteeStats);
}
```

### Backend Error Responses

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Election with ID 123 not found",
    "details": {}
  }
}
```

---

## ✅ Integration Checklist

### Phase 1: Setup
- [ ] Create `services/dashboardApi.ts`
- [ ] Set up environment variables
- [ ] Configure axios base URL
- [ ] Create mock data for testing

### Phase 2: API Development
- [ ] Implement backend endpoints
- [ ] Add database migrations
- [ ] Create API tests
- [ ] Document API specs

### Phase 3: Frontend Integration
- [ ] Import API service in DashboardView
- [ ] Add state management for API data
- [ ] Uncomment chart components
- [ ] Add loading states
- [ ] Add error handling

### Phase 4: Testing
- [ ] Test with mock data
- [ ] Test with real API
- [ ] Test error scenarios
- [ ] Test loading states
- [ ] Performance testing

### Phase 5: Real-Time (Optional)
- [ ] Set up WebSocket server
- [ ] Implement WebSocket hook
- [ ] Test real-time updates
- [ ] Add reconnection logic

---

## 📞 Support & Resources

### Documentation
- [Dashboard Implementation Status](./DASHBOARD-IMPLEMENTATION-STATUS.md)
- [Dashboard Enhancement Guide](./DASHBOARD-ENHANCEMENT-COMPLETE-GUIDE.md)
- [Dashboard Charts Quick Start](./DASHBOARD-CHARTS-QUICK-START.md)

### Component References
- `GroupPerformanceTable`: Line 220 in GroupPerformanceTable.tsx
- `HourlyAttendanceChart`: Line 140 in HourlyAttendanceChart.tsx
- `GenderDistributionChart`: Line 130 in GenderDistributionChart.tsx

---

**Integration Status**: Ready for API Development  
**Last Updated**: November 3, 2025  
**Version**: 1.0


