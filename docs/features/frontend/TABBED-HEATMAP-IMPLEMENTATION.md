# Tabbed Performance Heatmap Implementation

## 🎯 **Objective**

Transform the Committee Attendance Heatmap into a tabbed heatmap with **Teams** and **Areas** views.

---

## ✨ **What Was Changed**

### **1. New Component: `TabbedPerformanceHeatmap.tsx`**

Created a flexible, reusable heatmap component with tabs for different data views.

**Features:**
- ✅ **Two Tabs**: Teams and Areas
- ✅ **Dynamic Data**: Accepts separate data for teams and areas
- ✅ **Visual Indicators**: Shows count badges on tabs (e.g., "Teams (3)")
- ✅ **Performance Metrics**: Displays average, high performers, low performers
- ✅ **Color-Coded Heatmap**: Green gradient (darker = better performance)
- ✅ **Interactive Tooltips**: Hover to see details
- ✅ **Export Functionality**: Download as PNG
- ✅ **Flexible Metric Label**: Can be "Attendance", "Performance", "Completion", etc.

**Props:**
```typescript
interface TabbedPerformanceHeatmapProps {
  teams: HeatmapItem[];      // Team data
  areas: HeatmapItem[];      // Area data
  height?: number;           // Chart height (default: 300)
  metricLabel?: string;      // Metric name (default: "Performance")
}

interface HeatmapItem {
  code: string;              // Short code (e.g., "M-TEAM", "M1")
  name: string;              // Full name
  percentage: number;        // Performance percentage (0-100)
  metadata?: string;         // Optional extra info for tooltip
}
```

---

## 📊 **Data Structure**

### **Teams Tab**
Groups committees by gender to create teams:

```typescript
const teamsData = [
  {
    code: 'M-TEAM',
    name: 'Male Team',
    percentage: 85.5,                    // Aggregated attendance %
    metadata: '2 committees'
  },
  {
    code: 'F-TEAM',
    name: 'Female Team',
    percentage: 78.2,
    metadata: '1 committees'
  },
  {
    code: 'X-TEAM',
    name: 'Mixed Team',
    percentage: 92.0,
    metadata: '1 committees'
  }
];
```

**Logic:**
- Filters committees by gender (MALE, FEMALE, MIXED)
- Aggregates total electors and attendance per gender
- Calculates attendance percentage: `(totalAttendance / totalElectors) * 100`
- Shows number of committees in each team

### **Areas Tab**
Each committee becomes an "area":

```typescript
const areasData = [
  {
    code: 'M1',
    name: 'Committee M1',
    percentage: 82.5,                    // Committee attendance %
    metadata: 'MALE - 1250 electors'
  },
  {
    code: 'F1',
    name: 'Committee F1',
    percentage: 78.2,
    metadata: 'FEMALE - 980 electors'
  },
  // ... more committees
];
```

**Logic:**
- Maps each committee directly
- Calculates attendance percentage: `(attendanceCount / electorCount) * 100`
- Shows gender and elector count in metadata

---

## 🎨 **Visual Design**

### **Tabs**
```
┌─────────────────────────────────────────┐
│  👥 Teams (3)  │  🗺️ Areas (4)         │
├─────────────────────────────────────────┤
│                                         │
│  [Heatmap Content]                      │
│                                         │
└─────────────────────────────────────────┘
```

- **Icons**: 
  - Teams: `IconUsers` (👥)
  - Areas: `IconMap` (🗺️)
- **Badges**: Show count of items
- **Disabled State**: If no data for a tab, it's disabled

### **Heatmap Header**
```
Teams Attendance Heatmap                    Avg: 85.2%  [3 High] [0 Low] 📥
Visual overview of attendance rates - darker green is better
```

### **Heatmap Grid**
```
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│92.0%│ │85.5%│ │78.2%│ │  -  │ │  -  │
│M-TEAM││F-TEAM│X-TEAM│ │     │ │     │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘
```

**Grid Layout:**
- 5 columns per row
- Green color gradient: 0% (white) → 100% (dark green)
- Thresholds:
  - **High Performers**: ≥ 80%
  - **Low Performers**: < 50%

### **Tooltip (on hover)**
```
┌──────────────────────────┐
│  M-TEAM - Male Team      │
│  Attendance: 85.5%       │
│  2 committees            │
└──────────────────────────┘
```

---

## 🔄 **Integration in Dashboard**

### **Updated `DashboardView.tsx`**

**Imports:**
```typescript
import { TabbedPerformanceHeatmap } from './charts';
```

**Data Preparation:**
```typescript
// Prepare Teams and Areas data for heatmap
const teamsData = React.useMemo(() => {
  // Group committees by gender to create "teams"
  const maleTeam = committees
    .filter((c: any) => c.gender === 'MALE')
    .reduce((acc: any, c: any) => {
      acc.totalElectors += c.electorCount || 0;
      acc.totalAttendance += c.attendanceCount || 0;
      return acc;
    }, { totalElectors: 0, totalAttendance: 0 });

  // ... similar for female and mixed teams

  const teams = [];
  if (maleTeam.totalElectors > 0) {
    teams.push({
      code: 'M-TEAM',
      name: 'Male Team',
      percentage: (maleTeam.totalAttendance / maleTeam.totalElectors) * 100,
      metadata: `${maleCommittees} committees`
    });
  }
  // ... similar for other teams
  return teams;
}, [committees, maleCommittees, femaleCommittees, mixedCommittees]);

const areasData = React.useMemo(() => {
  // Transform committees into "areas"
  return committees.map((c: any) => ({
    code: c.code,
    name: c.name,
    percentage: c.electorCount > 0 ? (c.attendanceCount / c.electorCount) * 100 : 0,
    metadata: `${c.gender} - ${c.electorCount} electors`
  }));
}, [committees]);
```

**Usage in Electors Tab:**
```typescript
{/* Teams and Areas Performance Heatmap */}
<TabbedPerformanceHeatmap
  teams={teamsData}
  areas={areasData}
  height={300}
  metricLabel="Attendance"
/>
```

---

## 📊 **Example Output**

### **Teams Tab**
```
Teams Attendance Heatmap           Avg: 85.2%  [2 High] [0 Low] 📥
Visual overview of attendance rates - darker green is better

┌─────────┐ ┌─────────┐ ┌─────────┐
│  92.0%  │ │  85.5%  │ │  78.2%  │
│ X-TEAM  │ │ M-TEAM  │ │ F-TEAM  │
│  Mixed  │ │  Male   │ │ Female  │
└─────────┘ └─────────┘ └─────────┘
```

### **Areas Tab**
```
Areas Attendance Heatmap           Avg: 82.1%  [3 High] [0 Low] 📥
Visual overview of attendance rates - darker green is better

┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ 85%  │ │ 82%  │ │ 78%  │ │ 84%  │
│  M1  │ │  M2  │ │  F1  │ │ 3312 │
└──────┘ └──────┘ └──────┘ └──────┘
```

---

## 🎯 **Use Cases**

### **Teams View**
- **Purpose**: High-level overview of performance by team type
- **Best For**: 
  - Executive summaries
  - Quick gender-based performance comparison
  - Team lead dashboards
- **Shows**: Aggregated performance across gender groups

### **Areas View**
- **Purpose**: Detailed view of each committee
- **Best For**:
  - Committee-level analysis
  - Identifying specific underperforming areas
  - Detailed operational reports
- **Shows**: Individual committee performance

---

## 🔧 **Customization Options**

### **Change Metric Label**
```typescript
<TabbedPerformanceHeatmap
  teams={teamsData}
  areas={areasData}
  metricLabel="Completion"  // Changes "Attendance" to "Completion"
/>
```

### **Adjust Height**
```typescript
<TabbedPerformanceHeatmap
  teams={teamsData}
  areas={areasData}
  height={400}  // Taller chart
/>
```

### **Custom Data**
You can pass any data that matches the `HeatmapItem` interface:
```typescript
const customTeams = [
  {
    code: 'NORTH',
    name: 'North Region',
    percentage: 88.5,
    metadata: '5 districts'
  },
  // ...
];
```

---

## 📁 **Files Changed**

1. ✅ **Created**: `frontend/src/views/election/components/charts/TabbedPerformanceHeatmap.tsx` (230 lines)
2. ✅ **Modified**: `frontend/src/views/election/components/charts/index.ts`
   - Added export for `TabbedPerformanceHeatmap`
3. ✅ **Modified**: `frontend/src/views/election/components/DashboardView.tsx`
   - Added import for `TabbedPerformanceHeatmap`
   - Added `teamsData` and `areasData` computation
   - Replaced `CommitteeAttendanceHeatmap` with `TabbedPerformanceHeatmap` in Electors tab

---

## 🧪 **Testing Checklist**

### **Functionality**
- [ ] Navigate to Dashboard → Electors tab
- [ ] Heatmap displays with two tabs: Teams and Areas
- [ ] Teams tab shows aggregated data by gender
- [ ] Areas tab shows individual committee data
- [ ] Can switch between tabs
- [ ] Disabled tabs are grayed out when no data

### **Visual**
- [ ] Tab badges show correct counts (e.g., "Teams (3)")
- [ ] Heatmap cells use green color gradient
- [ ] Darker green represents higher percentages
- [ ] Summary chips show Avg, High, Low counts
- [ ] Export button is visible

### **Interactivity**
- [ ] Hover over cells shows tooltip with details
- [ ] Tooltip displays code, name, percentage, metadata
- [ ] Clicking export button downloads PNG
- [ ] Tab switching is smooth

### **Data Accuracy**
- [ ] Teams percentages match calculated values
- [ ] Areas percentages match committee attendance
- [ ] High performers count (≥80%) is correct
- [ ] Low performers count (<50%) is correct
- [ ] Average percentage is accurate

---

## 🎨 **Color Scheme**

### **Heatmap Gradient**
- **0-20%**: Very light green (#e8f5e9)
- **20-40%**: Light green (#c8e6c9)
- **40-60%**: Medium green (#81c784)
- **60-80%**: Green (#66bb6a)
- **80-100%**: Dark green (#43a047)

### **Performance Indicators**
- **High (≥80%)**: Green chip
- **Average**: Blue chip (avg percentage)
- **Low (<50%)**: Red chip

---

## 🚀 **Future Enhancements**

### **Potential Additions**
1. **More Tab Options**:
   - Candidates tab
   - Guarantees tab
   - Voting results tab

2. **Drill-Down**:
   - Click on team to see constituent committees
   - Click on area to see detailed stats

3. **Filters**:
   - Filter by date range
   - Filter by performance threshold

4. **Comparison Mode**:
   - Compare teams side by side
   - Show trend over time

5. **Custom Teams**:
   - Allow users to define custom team groupings
   - Save team configurations

---

## 📊 **Benefits**

### **For Users**
✅ **Flexible Views**: Switch between high-level teams and detailed areas  
✅ **Better Insights**: See both aggregated and granular performance  
✅ **Quick Navigation**: Tab interface is intuitive and fast  
✅ **Visual Clarity**: Color-coded heatmap makes patterns obvious  
✅ **Export Ready**: Download for reports and presentations

### **For Developers**
✅ **Reusable Component**: Can be used elsewhere with different data  
✅ **Type-Safe**: Full TypeScript support  
✅ **Customizable**: Flexible props for different metrics  
✅ **Maintainable**: Clean, well-documented code  
✅ **Extensible**: Easy to add more tabs or features

---

## 🎉 **Summary**

The new `TabbedPerformanceHeatmap` component replaces the single Committee Attendance Heatmap with a more flexible, tabbed interface that provides:

1. **Teams View**: Aggregated performance by gender-based teams
2. **Areas View**: Detailed performance by individual committees

**Key Features:**
- 🎯 Dual-view interface (Teams/Areas)
- 📊 Visual heatmap with green gradient
- 📈 Performance indicators (Avg, High, Low)
- 🎨 Interactive tooltips
- 📥 Export functionality
- ⚡ Optimized with React.useMemo

**Impact:** Transforms a single-purpose heatmap into a versatile, multi-view performance dashboard that serves both high-level and detailed analysis needs.

---

**Status:** ✅ Complete and Ready for Testing  
**Location:** Dashboard → Electors Tab  
**Component:** `TabbedPerformanceHeatmap`

