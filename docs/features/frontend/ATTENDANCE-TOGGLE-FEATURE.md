# Attendance Toggle Feature - Electors Tab

## 🎯 **Objective**

Add a toggle switch in the Electors tab to include/exclude attendance data, allowing users to focus on elector demographics and counts without attendance metrics.

---

## ✨ **Feature Overview**

### **Toggle Switch**
- **Location**: Above "Teams & Areas Analysis" section in Electors tab
- **Default State**: OFF (attendance disabled) - Focus on elector data
- **Label**: "Show Attendance" / "Show Elector Data"
- **Description**: Shows context about what's being displayed

### **Behavior**

**When Attendance is OFF (Default):**
- ✅ Charts show **elector counts** instead of attendance percentages
- ✅ Heatmap displays total electors per team/area
- ✅ Bar chart shows elector counts (not percentages)
- ✅ Table shows only: Code, Name, Total Electors, Male, Female
- ✅ Table hides: Attended, Attendance %, Status columns
- ✅ Filtered view shows elector counts with gender breakdown
- ✅ No progress bars (attendance-specific)
- ✅ Stats show average elector count (not percentages)

**When Attendance is ON:**
- ✅ Charts show **attendance percentages**
- ✅ All attendance metrics visible
- ✅ Status indicators based on attendance thresholds
- ✅ Full table with all columns
- ✅ Progress bars for attendance visualization

---

## 🔧 **Implementation Details**

### **1. DashboardView.tsx Changes**

**Added State:**
```typescript
const [showAttendanceInElectors, setShowAttendanceInElectors] = useState(false);
```

**Toggle UI:**
```typescript
<FormControlLabel
  control={
    <Switch
      checked={showAttendanceInElectors}
      onChange={(e) => setShowAttendanceInElectors(e.target.checked)}
      color="primary"
    />
  }
  label={<Typography variant="body2">
    {showAttendanceInElectors ? 'Show Attendance' : 'Show Elector Data'}
  </Typography>}
/>
```

**Props Passed:**
```typescript
<PerformanceAnalysisViews
  teams={teamsData}
  areas={areasData}
  height={400}
  metricLabel={showAttendanceInElectors ? 'Attendance' : 'Electors'}
  showAttendance={showAttendanceInElectors}
/>
```

### **2. PerformanceAnalysisViews.tsx Changes**

**New Prop:**
```typescript
interface PerformanceAnalysisViewsProps {
  teams: PerformanceItem[];
  areas: PerformanceItem[];
  height?: number;
  metricLabel?: string;
  showAttendance?: boolean; // NEW
}
```

**Helper Function:**
```typescript
const getDisplayValue = (item: PerformanceItem): number => {
  return showAttendance 
    ? (item.attendancePercentage || 0) 
    : (item.totalElectors || 0);
};

const displayLabel = showAttendance ? metricLabel : 'Electors';
```

**Sort Field Reset:**
```typescript
useEffect(() => {
  if (!showAttendance && (sortField === 'attended' || sortField === 'attendancePercentage')) {
    setSortField('totalElectors');
  }
}, [showAttendance, sortField]);
```

---

## 📊 **View-Specific Changes**

### **Heatmap View**
- **Value**: Uses `getDisplayValue()` instead of `attendancePercentage`
- **Tooltip**: Shows elector count or attendance % based on toggle
- **Sorting**: Top 10 by elector count when attendance OFF

### **Bar Chart View**
- **Data**: Shows elector counts instead of percentages
- **Colors**: Different thresholds (≥100 green, ≥50 yellow, <50 red)
- **Labels**: Numbers instead of percentages
- **Tooltip**: Shows elector breakdown when attendance OFF

### **Filtered View**
- **Progress Bar**: Only shown when attendance ON
- **Chips**: Show elector count + gender breakdown when attendance OFF
- **Sort Options**: Hides "Attended" and "Attendance %" when attendance OFF

### **Table View**
- **Columns**: Conditionally shows/hides attendance columns
- **Hidden when OFF**: Attended, Attendance %, Status columns
- **Shown when OFF**: Code, Name, Total Electors, Male, Female

---

## 📈 **Stats Calculation**

### **When Attendance ON:**
```typescript
avg: Average attendance percentage (0-100%)
high: Count of teams/areas with ≥80% attendance
low: Count of teams/areas with <50% attendance
```

### **When Attendance OFF:**
```typescript
avg: Average elector count (no % sign)
high: Count of teams/areas with ≥100 electors
low: Count of teams/areas with <10 electors
```

---

## 🎨 **UI/UX Flow**

### **Default State (Attendance OFF)**
```
┌─────────────────────────────────────────┐
│ Teams & Areas Analysis    [Toggle: OFF] │
│ Viewing elector counts and demographics │
├─────────────────────────────────────────┤
│ [Charts showing elector counts]         │
│ [Table with Code, Name, Total, M, F]    │
└─────────────────────────────────────────┘
```

### **When Toggle ON**
```
┌─────────────────────────────────────────┐
│ Teams & Areas Analysis    [Toggle: ON]  │
│ Viewing attendance performance metrics  │
├─────────────────────────────────────────┤
│ [Charts showing attendance %]           │
│ [Table with all columns + Status]       │
└─────────────────────────────────────────┘
```

---

## ✅ **Benefits**

### **For Users**
✅ **Focus on Data**: Electors tab shows elector demographics  
✅ **Attendance Tab**: Can still access attendance metrics  
✅ **Cleaner View**: No attendance clutter when not needed  
✅ **Better Performance**: Charts show meaningful data immediately  

### **For Analysis**
✅ **Demographics First**: Primary focus on elector data  
✅ **Attendance Separate**: Attendance metrics in dedicated tab  
✅ **Clear Separation**: Each tab has clear purpose  
✅ **Flexible**: Can toggle if needed  

---

## 📁 **Files Modified**

1. ✅ `frontend/src/views/election/components/DashboardView.tsx`
   - Added `showAttendanceInElectors` state
   - Added toggle UI component
   - Updated `PerformanceAnalysisViews` props

2. ✅ `frontend/src/views/election/components/charts/PerformanceAnalysisViews.tsx`
   - Added `showAttendance` prop
   - Added `getDisplayValue()` helper
   - Updated all 4 views (Heatmap, Chart, Filter, Table)
   - Updated stats calculation
   - Updated sorting logic
   - Updated tooltips and labels

---

## 🎯 **Use Cases**

### **Use Case 1: Pre-Election Analysis**
**Scenario**: Election hasn't started, need to review elector distribution
- ✅ Toggle OFF (default)
- ✅ See elector counts by team/area
- ✅ Analyze demographics without attendance noise
- ✅ Focus on data distribution

### **Use Case 2: Election Day**
**Scenario**: Election is active, need to track attendance
- ✅ Toggle ON
- ✅ See attendance percentages
- ✅ Monitor performance metrics
- ✅ Track participation rates

### **Use Case 3: Post-Election Analysis**
**Scenario**: Reviewing both elector data and attendance patterns
- ✅ Can toggle between views
- ✅ Compare demographics vs attendance
- ✅ Identify correlations

---

## 🧪 **Testing Checklist**

### **Toggle Functionality**
- [ ] Toggle switches between states
- [ ] Label changes correctly
- [ ] Description text updates
- [ ] State persists when switching tabs

### **Heatmap View**
- [ ] Shows elector counts when OFF
- [ ] Shows attendance % when ON
- [ ] Tooltips show correct data
- [ ] Top 10 sorting works correctly

### **Bar Chart View**
- [ ] Shows elector numbers when OFF
- [ ] Shows percentages when ON
- [ ] Colors apply correct thresholds
- [ ] Labels format correctly

### **Filtered View**
- [ ] Progress bars hidden when OFF
- [ ] Chips show elector data when OFF
- [ ] Sort options update correctly
- [ ] Cards display proper information

### **Table View**
- [ ] Attendance columns hidden when OFF
- [ ] All columns visible when ON
- [ ] Sorting works correctly
- [ ] Data displays properly

---

## 📊 **Comparison: Before vs After**

| Aspect | Before | After |
|--------|--------|-------|
| **Electors Tab Focus** | Mixed (attendance + data) | Pure elector data (default) |
| **Charts Display** | Always attendance % | Elector counts (toggle OFF) |
| **Table Columns** | Always all columns | Conditional (attendance OFF = fewer) |
| **User Control** | None | Toggle switch |
| **Purpose** | Unclear | Clear separation |

---

## 🎉 **Summary**

**Feature**: Toggle switch to include/exclude attendance in Electors tab  
**Default**: Attendance OFF (focus on elector data)  
**Benefit**: Clear separation of concerns, better UX  

**Electors Tab**: 
- ✅ Focuses on elector demographics and counts
- ✅ Attendance optional (toggle ON if needed)
- ✅ Cleaner, more focused interface

**Attendance Tab** (Future):
- ✅ Can use the same component with `showAttendance={true}`
- ✅ Dedicated space for attendance metrics
- ✅ Clear separation of concerns

---

**Status:** ✅ **Complete**  
**Default State:** Attendance OFF (elector data focus)  
**User Control:** Toggle switch available  

---

**The Electors tab now focuses on elector data analysis, with attendance as an optional toggle!** 🎊


