# ✅ Dashboard Integration Checklist

**Step-by-step checklist for connecting frontend dashboard to backend APIs**

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  DashboardView.tsx                                               │
│    ↓                                                             │
│  Components with API Integration:                                │
│    • GuaranteesTrendChartWithAPI                                │
│    • GroupPerformanceTableWithAPI                               │
│    • HourlyAttendanceChartWithAPI                               │
│    • GenderDistributionChartWithAPI                             │
│    ↓                                                             │
│  Custom Hooks (useDashboardData.ts):                            │
│    • useGuaranteesTrend()                                       │
│    • useGroupPerformance()                                      │
│    • useHourlyAttendance()                                      │
│    • useElectorDemographics()                                   │
│    ↓                                                             │
│  API Service (dashboard.ts):                                     │
│    • getGuaranteesTrend()                                       │
│    • getGroupPerformance()                                      │
│    • getHourlyAttendance()                                      │
│    • getElectorDemographics()                                   │
└─────────────────────────────────────────────────────────────────┘
                             ↓ HTTP
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND (Django)                           │
├─────────────────────────────────────────────────────────────────┤
│  URLs (elections/urls.py):                                       │
│    • /api/elections/{id}/dashboard/guarantees/trends           │
│    • /api/elections/{id}/dashboard/groups/performance          │
│    • /api/elections/{id}/dashboard/attendance/hourly           │
│    • /api/elections/{id}/dashboard/electors/demographics       │
│    ↓                                                             │
│  Views (dashboard_views.py):                                     │
│    • GuaranteesTrendView                                        │
│    • GroupPerformanceView                                       │
│    • HourlyAttendanceView                                       │
│    • ElectorDemographicsView                                    │
│    ↓                                                             │
│  Query Functions (dashboard_queries.py):                        │
│    • get_guarantees_trend()                                     │
│    • get_group_performance()                                    │
│    • get_hourly_attendance()                                    │
│    • get_elector_demographics()                                 │
│    ↓                                                             │
│  Serializers (dashboard_serializers.py):                        │
│    • GuaranteeTrendSerializer                                   │
│    • GroupPerformanceSerializer                                 │
│    • HourlyAttendanceSerializer                                 │
│    • ElectorDemographicsSerializer                              │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                         │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                                                         │
│    • guarantees (Guarantee model)                               │
│    • guarantee_groups (GuaranteeGroup model)                    │
│    • attendance (Attendance model)                              │
│    • electors (Elector model)                                   │
│    • elections (Election model)                                 │
│    • committees (Committee model)                               │
│    • voting (Vote model)                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Component Mapping

| Frontend Component | API Hook | API Endpoint | Backend View | Query Function |
|-------------------|----------|--------------|--------------|----------------|
| `GuaranteesTrendChartWithAPI` | `useGuaranteesTrend` | `/dashboard/guarantees/trends` | `GuaranteesTrendView` | `get_guarantees_trend` |
| `GroupPerformanceTableWithAPI` | `useGroupPerformance` | `/dashboard/groups/performance` | `GroupPerformanceView` | `get_group_performance` |
| `HourlyAttendanceChartWithAPI` | `useHourlyAttendance` | `/dashboard/attendance/hourly` | `HourlyAttendanceView` | `get_hourly_attendance` |
| `GenderDistributionChartWithAPI` | `useElectorDemographics` | `/dashboard/electors/demographics` | `ElectorDemographicsView` | `get_elector_demographics` |

---

## ✅ Implementation Checklist

### Phase 1: Backend Setup (Backend Developer)

#### Step 1.1: Create Serializers ⏱️ 5 min
- [ ] Create file: `backend/apps/elections/serializers/dashboard_serializers.py`
- [ ] Copy serializer code from quick reference
- [ ] Import required modules
- [ ] Verify no syntax errors

#### Step 1.2: Create Query Functions ⏱️ 15 min
- [ ] Create file: `backend/apps/elections/utils/dashboard_queries.py`
- [ ] Implement `get_guarantees_trend()`
- [ ] Implement `get_group_performance()`
- [ ] Implement `get_hourly_attendance()`
- [ ] Implement `get_elector_demographics()`
- [ ] Test each function in Django shell

#### Step 1.3: Create Views ⏱️ 10 min
- [ ] Create file: `backend/apps/elections/views/dashboard_views.py`
- [ ] Implement `GuaranteesTrendView`
- [ ] Implement `GroupPerformanceView`
- [ ] Implement `HourlyAttendanceView`
- [ ] Implement `ElectorDemographicsView`
- [ ] Add proper error handling

#### Step 1.4: Update URLs ⏱️ 2 min
- [ ] Open `backend/apps/elections/urls.py`
- [ ] Import new views
- [ ] Add 4 new URL patterns
- [ ] Verify URL pattern syntax

#### Step 1.5: Test Backend ⏱️ 10 min
- [ ] Run server: `python manage.py runserver`
- [ ] Test with curl or Postman
- [ ] Verify response format matches specification
- [ ] Check for errors in Django logs

**Backend Phase 1 Total:** ~42 minutes

---

### Phase 2: Frontend Integration (Frontend Developer)

#### Step 2.1: Update Environment ⏱️ 1 min
- [ ] Open `frontend/.env`
- [ ] Change `VITE_USE_MOCK_DASHBOARD=false`
- [ ] Save file

#### Step 2.2: Restart Frontend ⏱️ 1 min
- [ ] Stop dev server (Ctrl+C)
- [ ] Run: `npm start`
- [ ] Wait for server to start

#### Step 2.3: Test Integration ⏱️ 5 min
- [ ] Navigate to election in browser
- [ ] Click Dashboard tab
- [ ] Verify Guarantees Trend Chart loads
- [ ] Verify Group Performance Table loads
- [ ] Verify Hourly Attendance Chart loads
- [ ] Verify Gender Distribution Chart loads
- [ ] Check browser console for errors

**Frontend Phase 2 Total:** ~7 minutes

---

### Phase 3: Verification & Testing (Both Teams)

#### Step 3.1: Functional Testing ⏱️ 10 min
- [ ] **Guarantees Trend Chart:**
  - [ ] Loads without errors
  - [ ] Shows real data (not mock)
  - [ ] Period filter works (7d, 30d, 90d)
  - [ ] Export buttons work
  - [ ] Chart interactions work

- [ ] **Group Performance Table:**
  - [ ] Shows user's groups
  - [ ] Displays correct counts
  - [ ] Conversion rate calculated correctly
  - [ ] Status badge shows correct color
  - [ ] Sorting works

- [ ] **Hourly Attendance Chart:**
  - [ ] Shows attendance by hour
  - [ ] Date picker works
  - [ ] Displays target line
  - [ ] Real-time updates (if applicable)

- [ ] **Gender Distribution Chart:**
  - [ ] Shows male/female percentages
  - [ ] Pie chart renders correctly
  - [ ] Committee breakdown shows
  - [ ] Family breakdown shows (top 10)

#### Step 3.2: Error Handling Testing ⏱️ 5 min
- [ ] Test with no data (new election)
- [ ] Test with invalid election ID
- [ ] Test without authentication
- [ ] Verify error messages display
- [ ] Check loading states work

#### Step 3.3: Performance Testing ⏱️ 5 min
- [ ] Check initial load time (<2 seconds)
- [ ] Verify no duplicate API calls
- [ ] Check network tab for efficiency
- [ ] Test with large datasets

**Phase 3 Total:** ~20 minutes

---

### Phase 4: Optimization (Optional, Both Teams)

#### Step 4.1: Backend Optimization ⏱️ 15 min
- [ ] Add database indexes (see full guide)
- [ ] Implement query caching
- [ ] Use select_related/prefetch_related
- [ ] Monitor query count with Django Debug Toolbar

#### Step 4.2: Frontend Optimization ⏱️ 10 min
- [ ] Verify useMemo usage in components
- [ ] Check for unnecessary re-renders
- [ ] Test with React DevTools Profiler

**Phase 4 Total:** ~25 minutes

---

## 🧪 Testing Matrix

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Load dashboard with real election data | All 4 components render with data | ⬜ |
| Change guarantee trend period filter | Chart updates with filtered data | ⬜ |
| Sort group performance table | Table re-orders correctly | ⬜ |
| Select different date in attendance | Chart shows data for selected date | ⬜ |
| Test with election with no data | Shows "No data" message | ⬜ |
| Test without authentication | Returns 401 error | ⬜ |
| Test with invalid election ID | Returns 404 error | ⬜ |
| Export chart as PNG | Downloads PNG file | ⬜ |
| Export data as CSV | Downloads CSV file | ⬜ |
| Responsive design (mobile) | Components adapt to screen size | ⬜ |

---

## 🔍 Data Validation Checklist

### Guarantees Trend Data
- [ ] Date format: `YYYY-MM-DD`
- [ ] strong + medium + weak = total
- [ ] All counts ≥ 0
- [ ] Data sorted by date ascending

### Group Performance Data
- [ ] Conversion rate = (strong_count / guarantees_count) × 100
- [ ] Status logic correct:
  - [ ] `pending` = 0 guarantees
  - [ ] `active` = activity in last 7 days
  - [ ] `inactive` = no activity in 7+ days
- [ ] Leader name matches user

### Hourly Attendance Data
- [ ] Hour format: `HH:MM` (08:00 to 17:00)
- [ ] votes ≤ attendance (always)
- [ ] 10 data points (08:00 to 17:00)
- [ ] Target calculated correctly

### Gender Demographics Data
- [ ] male + female = total
- [ ] male_percentage + female_percentage ≈ 100%
- [ ] by_committee includes all committees
- [ ] by_family sorted by count descending
- [ ] by_family limited to top 10

---

## 🐛 Common Issues & Solutions

### Issue: Frontend shows 404 errors

**Symptoms:**
- Dashboard loads but shows "No data"
- Browser console shows 404 errors
- Backend logs show no requests

**Solutions:**
1. ✅ Verify URLs in `urls.py` match exactly
2. ✅ Check backend server is running
3. ✅ Verify CORS settings allow frontend domain
4. ✅ Check `.env` has `VITE_USE_MOCK_DASHBOARD=false`
5. ✅ Restart both frontend and backend servers

---

### Issue: Frontend still shows mock data

**Symptoms:**
- Dashboard loads with data
- Data doesn't match database
- No API calls in network tab

**Solutions:**
1. ✅ Verify `.env` has `VITE_USE_MOCK_DASHBOARD=false`
2. ✅ Restart frontend dev server
3. ✅ Clear browser cache (Ctrl+Shift+R)
4. ✅ Check `useDashboardData.ts` USE_MOCK_DATA logic

---

### Issue: Backend returns empty arrays

**Symptoms:**
- API calls succeed (200 OK)
- Response is `{"status": "success", "data": []}`
- Database has data

**Solutions:**
1. ✅ Check database has data for this election
2. ✅ Verify user ownership (for guarantees)
3. ✅ Check date filters in queries
4. ✅ Test query functions in Django shell
5. ✅ Check is_active filters

---

### Issue: Slow performance

**Symptoms:**
- Dashboard takes >3 seconds to load
- Multiple similar queries in logs
- High CPU usage

**Solutions:**
1. ✅ Add database indexes (see full guide)
2. ✅ Implement caching
3. ✅ Use select_related() for foreign keys
4. ✅ Use prefetch_related() for reverse FKs
5. ✅ Reduce data payload (pagination)

---

## 📝 Sign-Off Checklist

### Backend Developer Sign-Off

- [ ] All 4 API endpoints implemented
- [ ] All endpoints return correct response format
- [ ] Error handling implemented
- [ ] Queries optimized with indexes
- [ ] Unit tests written and passing
- [ ] API documentation updated
- [ ] Code reviewed by peer
- [ ] Deployed to staging/production

**Backend Developer:** _________________ **Date:** _________

---

### Frontend Developer Sign-Off

- [ ] `.env` updated to use real APIs
- [ ] All 4 components render correctly
- [ ] Loading states work
- [ ] Error states display properly
- [ ] Export features work
- [ ] Responsive design verified
- [ ] Browser compatibility tested
- [ ] Code reviewed by peer

**Frontend Developer:** _________________ **Date:** _________

---

## 🚀 Go-Live Checklist

### Pre-Deployment
- [ ] All tests passing (backend)
- [ ] All components working (frontend)
- [ ] Performance acceptable (<2s load)
- [ ] Error handling tested
- [ ] Staging environment tested
- [ ] User acceptance testing complete

### Deployment
- [ ] Backend deployed
- [ ] Database migrations applied
- [ ] Frontend built and deployed
- [ ] Environment variables set
- [ ] CORS configured
- [ ] SSL certificates valid

### Post-Deployment
- [ ] Test in production
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify all endpoints accessible
- [ ] User feedback collected

---

## 📚 Documentation References

| Document | Purpose | Location |
|----------|---------|----------|
| **Backend Implementation Guide** | Detailed backend setup | `docs/frontend/DASHBOARD-BACKEND-IMPLEMENTATION-GUIDE.md` |
| **Quick Reference** | Fast implementation guide | `docs/frontend/DASHBOARD-BACKEND-QUICK-REFERENCE.md` |
| **API Endpoints Reference** | All API specs | `backend/API-ENDPOINTS-REFERENCE.md` |
| **Frontend Setup Guide** | Frontend configuration | `frontend/DASHBOARD-SETUP.md` |

---

## ⏱️ Total Implementation Time

| Phase | Duration |
|-------|----------|
| Backend Setup | ~42 min |
| Frontend Integration | ~7 min |
| Verification & Testing | ~20 min |
| **TOTAL (Required)** | **~69 min** |
| Optimization (Optional) | +25 min |
| **TOTAL (with Optimization)** | **~94 min** |

---

## 🎉 Success Criteria

Your dashboard integration is successful when:

✅ All 4 components load with real data  
✅ No console errors  
✅ No 404 API errors  
✅ Filters and interactions work  
✅ Export features functional  
✅ Loading states display correctly  
✅ Error states handle gracefully  
✅ Performance <2 seconds  
✅ Responsive on mobile  
✅ Data matches database  

---

**Ready to integrate? Follow the checklist step by step! 🚀**

**Last Updated:** November 4, 2025  
**Version:** 1.0

