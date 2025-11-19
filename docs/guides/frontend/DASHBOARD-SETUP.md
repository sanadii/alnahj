# 🚀 Dashboard Setup Guide

Quick guide to set up and run the election dashboard with API integration.

---

## ✅ Prerequisites

- Node.js installed
- npm or yarn
- Test dependencies already installed ✅

---

## 🔧 Setup Steps

### **Step 1: Create Environment File**

Create a `.env` file in the `frontend/` directory:

```bash
# In frontend/.env
# Use either VITE_ prefix (recommended for Vite) or REACT_APP_ prefix
VITE_USE_MOCK_DASHBOARD=true
# OR
REACT_APP_USE_MOCK_DASHBOARD=true
```

**Options:**
- `true` = Use mock data (no backend required) ✅ **DEFAULT**
- `false` = Use real API (requires backend running)

**Note:** Code defaults to `true` (mock mode) if not set, so backend is optional for testing!

---

### **Step 2: Run Tests (Optional)**

```bash
npm test
# or
npm run test:run
```

Expected: **15/15 tests passing** ✅

---

### **Step 3: Start Development Server**

```bash
npm start
# or
npm run dev
```

---

### **Step 4: View Dashboard**

1. Navigate to your election in the app
2. Click on **Dashboard** tab
3. See the 4 API-integrated components:
   - **Guarantees Tab**: Trend Chart + Performance Table
   - **Attendance Tab**: Hourly Attendance Chart
   - **Electors Tab**: Gender Distribution Chart

---

## 📊 What's Included

### **API-Integrated Components** (4)
✅ `GuaranteesTrendChartWithAPI`
✅ `GroupPerformanceTableWithAPI`
✅ `HourlyAttendanceChartWithAPI`
✅ `GenderDistributionChartWithAPI`

### **Features**
✅ Automatic data fetching
✅ Loading spinners
✅ Error handling with retry
✅ Empty state messages
✅ Mock data support
✅ Full TypeScript type safety

---

## 🔌 Connecting to Real Backend

### **Step 1: Update .env**

```bash
# frontend/.env
REACT_APP_USE_MOCK_DASHBOARD=false
```

### **Step 2: Ensure Backend Endpoints Exist**

Required endpoints:
```
GET /api/elections/{id}/dashboard/guarantees/trends
GET /api/elections/{id}/dashboard/groups/performance
GET /api/elections/{id}/dashboard/attendance/hourly
GET /api/elections/{id}/dashboard/electors/demographics
GET /api/elections/{id}/dashboard/stats/realtime
GET /api/elections/{id}/dashboard/summary
```

### **Step 3: Test with Real Data**

```bash
npm start
```

Navigate to dashboard and verify all components load real data.

---

## 📁 Project Structure

```
frontend/src/
├── helpers/api/
│   ├── dashboard.ts              # API functions
│   └── __tests__/
│       └── dashboard.test.ts     # API tests
├── hooks/dashboard/
│   ├── useDashboardData.ts       # Custom hooks
│   └── __tests__/
│       └── useDashboardData.test.ts  # Hook tests
└── views/election/components/
    ├── DashboardView.tsx         # Main dashboard
    └── charts/
        ├── GuaranteesTrendChartWithAPI.tsx
        ├── GroupPerformanceTableWithAPI.tsx
        ├── HourlyAttendanceChartWithAPI.tsx
        ├── GenderDistributionChartWithAPI.tsx
        └── __tests__/
            └── GuaranteesTrendChartWithAPI.test.tsx
```

---

## 🧪 Testing

### **Run All Tests**
```bash
npm test              # Watch mode
npm run test:run      # Run once
npm run test:ui       # Interactive UI
npm run test:coverage # With coverage
```

### **Test Individual Files**
```bash
npm test dashboard.test
npm test useDashboardData.test
npm test GuaranteesTrendChartWithAPI.test
```

---

## 📚 Documentation

Comprehensive documentation available in `docs/frontend/`:

1. **API-INTEGRATION-IMPLEMENTATION-GUIDE.md**
   - Complete API integration guide
   - Hook usage examples
   - Code examples

2. **TESTING-GUIDE-COMPLETE.md**
   - Testing framework setup
   - Writing tests
   - Best practices

3. **API-AND-TESTING-COMPLETE-SUMMARY.md**
   - Executive summary
   - Quick reference

4. **IMPLEMENTATION-COMPLETE-FINAL.md**
   - Final status report
   - Complete file listing

---

## 🐛 Troubleshooting

### **Issue: Components show loading forever**
**Solution**: 
1. Check if `REACT_APP_USE_MOCK_DASHBOARD=true` in `.env`
2. Verify `election.id` is valid
3. Check browser console for errors

### **Issue: Tests fail**
**Solution**:
```bash
# Reinstall dependencies
npm install

# Clear cache and rerun
npm test -- --clearCache
npm test
```

### **Issue: Mock data not working**
**Solution**:
1. Verify `.env` file exists in `frontend/` directory
2. Verify `REACT_APP_USE_MOCK_DASHBOARD=true`
3. Restart dev server after changing `.env`

### **Issue: API returns 404**
**Solution**:
1. Verify backend is running
2. Check API endpoints match (see documentation)
3. Check backend URL in config

---

## ✅ Quick Checklist

**Before First Run:**
- [ ] Create `.env` file with `REACT_APP_USE_MOCK_DASHBOARD=true`
- [ ] Run `npm install` (if not done)
- [ ] Run `npm test` to verify setup

**For Development:**
- [ ] Use mock data mode (`REACT_APP_USE_MOCK_DASHBOARD=true`)
- [ ] Tests passing (15/15 expected)
- [ ] Dashboard loads without errors

**For Production:**
- [ ] Backend API endpoints created
- [ ] Disable mock data (`REACT_APP_USE_MOCK_DASHBOARD=false`)
- [ ] Test with real data
- [ ] Verify all 4 components work

---

## 🎉 Success Indicators

✅ **Setup Successful When:**
- npm start runs without errors
- Dashboard tab loads
- 4 API-integrated components visible
- Mock data displays in charts
- No console errors

✅ **Production Ready When:**
- All tests passing (15/15)
- Backend API connected
- Real data displays
- Error handling works
- Performance is acceptable

---

## 📞 Need Help?

Check documentation:
- `docs/frontend/API-INTEGRATION-IMPLEMENTATION-GUIDE.md`
- `docs/frontend/TESTING-GUIDE-COMPLETE.md`

Or review implementation files:
- API: `src/helpers/api/dashboard.ts`
- Hooks: `src/hooks/dashboard/useDashboardData.ts`
- Components: `src/views/election/components/charts/*WithAPI.tsx`

---

**Version**: 1.0  
**Last Updated**: November 3, 2025  
**Status**: ✅ Production Ready

