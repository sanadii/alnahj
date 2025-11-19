# Dynamic Party Grid Sizing

## 🎯 **Feature: Responsive Column Layout**

**Purpose:** Automatically adjust party card column sizes based on the total number of parties (including independent) for optimal layout.

---

## 📊 **Sizing Logic**

### **Column Size Rules**

```typescript
Total Parties → Grid Columns (xs/sm/md/lg)

1 party  → 12/12/6/6   (Half width on md+)
2 parties → 12/6/6/6   (Half width each on sm+)
3 parties → 12/6/4/4   (Third width on md+)
4 parties → 12/6/4/3   (Quarter width on lg)
5+ parties → 12/6/4/3  (Quarter width on lg)
```

### **Breakpoint Sizes**
- **xs** (0-600px): Mobile - All full width
- **sm** (600-900px): Tablet - 2 columns max
- **md** (900-1200px): Small desktop - 2-3 columns
- **lg** (1200px+): Large desktop - 2-4 columns

---

## 🎨 **Visual Examples**

### **1 Party (+ Independent if exists)**
```
┌─────────────────────┐  ┌─────────────────────┐
│                     │  │                     │
│    Party A (50%)    │  │  Independent (50%)  │
│                     │  │                     │
└─────────────────────┘  └─────────────────────┘

Desktop: 2 columns (6 cols each)
Mobile: 1 column (12 cols)
```

### **2 Parties (+ Independent if exists)**
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│          │  │          │  │          │
│ Party A  │  │ Party B  │  │Independent│
│          │  │          │  │          │
└──────────┘  └──────────┘  └──────────┘

Desktop: 3 columns (4 cols each = 50% for 2 parties)
Tablet: 2 columns
Mobile: 1 column
```

### **3 Parties (+ Independent if exists)**
```
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│        │  │        │  │        │  │        │
│Party A │  │Party B │  │Party C │  │  Ind.  │
│        │  │        │  │        │  │        │
└────────┘  └────────┘  └────────┘  └────────┘

Desktop (md): 3 per row (4 cols each)
Desktop (lg): 3 per row (4 cols each)
Tablet: 2 per row
Mobile: 1 per row
```

### **4+ Parties (+ Independent if exists)**
```
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│Party │  │Party │  │Party │  │Party │
│  A   │  │  B   │  │  C   │  │  D   │
└──────┘  └──────┘  └──────┘  └──────┘
┌──────┐
│ Ind. │
└──────┘

Desktop (lg): 4 per row (3 cols each)
Desktop (md): 3 per row
Tablet: 2 per row
Mobile: 1 per row
```

---

## 💻 **Implementation**

### **Dynamic Column Calculator**

```typescript
const getColumnSize = React.useMemo(() => {
  const totalParties = allParties.length;

  // Dynamic column sizing based on total number of parties
  if (totalParties === 1) return { xs: 12, sm: 12, md: 6, lg: 6 };
  if (totalParties === 2) return { xs: 12, sm: 6, md: 6, lg: 6 };
  if (totalParties === 3) return { xs: 12, sm: 6, md: 4, lg: 4 };
  if (totalParties === 4) return { xs: 12, sm: 6, md: 4, lg: 3 };
  if (totalParties >= 5) return { xs: 12, sm: 6, md: 4, lg: 3 };

  // Default fallback
  return { xs: 12, sm: 6, md: 4, lg: 3 };
}, [allParties.length]);
```

### **Usage in Grid**

```typescript
<Grid container spacing={2}>
  {allParties.map((party: any) => (
    <Grid key={party.id} size={getColumnSize}>
      <PartyCard 
        party={party} 
        candidates={party.candidates || []}
        totalCandidates={totalCandidates}
        expanded={expandAllCandidates}
      />
    </Grid>
  ))}
</Grid>
```

---

## 📐 **Column Math**

### **Grid System (12 columns total)**

| Parties | xs (mobile) | sm (tablet) | md (desktop) | lg (large) |
|---------|-------------|-------------|--------------|------------|
| **1**   | 12 (100%)   | 12 (100%)   | 6 (50%)      | 6 (50%)    |
| **2**   | 12 (100%)   | 6 (50%)     | 6 (50%)      | 6 (50%)    |
| **3**   | 12 (100%)   | 6 (50%)     | 4 (33%)      | 4 (33%)    |
| **4**   | 12 (100%)   | 6 (50%)     | 4 (33%)      | 3 (25%)    |
| **5+**  | 12 (100%)   | 6 (50%)     | 4 (33%)      | 3 (25%)    |

### **Cards Per Row**

| Parties | xs | sm | md | lg |
|---------|----|----|----|----|
| **1**   | 1  | 1  | 2  | 2  |
| **2**   | 1  | 2  | 2  | 2  |
| **3**   | 1  | 2  | 3  | 3  |
| **4**   | 1  | 2  | 3  | 4  |
| **5+**  | 1  | 2  | 3  | 4  |

---

## 🎯 **Benefits**

### **1. Better Space Utilization**
- **1-2 parties**: Larger cards, more readable
- **3-4 parties**: Balanced layout
- **5+ parties**: Compact grid, all visible

### **2. Responsive Design**
- **Mobile**: Always 1 column (full width)
- **Tablet**: 2 columns max
- **Desktop**: Scales from 2 to 4 columns

### **3. Automatic Adjustment**
- Adds independent party → Recalculates automatically
- Changes party count → Updates layout instantly
- No manual configuration needed

---

## 📱 **Screen Size Examples**

### **Mobile (< 600px)**
```
┌─────────────────┐
│    Party A      │
└─────────────────┘
┌─────────────────┐
│    Party B      │
└─────────────────┘
┌─────────────────┐
│  Independent    │
└─────────────────┘
```
**All parties stack vertically**

### **Tablet (600-900px)**
```
┌────────┐  ┌────────┐
│Party A │  │Party B │
└────────┘  └────────┘
┌────────┐
│  Ind.  │
└────────┘
```
**2 columns max**

### **Desktop MD (900-1200px)**
```
┌──────┐  ┌──────┐  ┌──────┐
│Party │  │Party │  │Party │
│  A   │  │  B   │  │  C   │
└──────┘  └──────┘  └──────┘
┌──────┐
│ Ind. │
└──────┘
```
**3 columns for 3+ parties**

### **Desktop LG (1200px+)**
```
┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
│  A  │  │  B  │  │  C  │  │ Ind │
└─────┘  └─────┘  └─────┘  └─────┘
```
**4 columns for 4+ parties**

---

## 🔍 **Edge Cases Handled**

### **Only Independent (No Political Parties)**
```typescript
// allParties = [{ id: 'independent', ... }]
// totalParties = 1
// Result: md: 6, lg: 6 (half width)

┌─────────────────────┐
│                     │
│  Independent (100%) │
│                     │
└─────────────────────┘
```

### **No Independent Candidates**
```typescript
// allParties = [Party A, Party B]
// totalParties = 2
// Result: md: 6, lg: 6 (half width each)

┌────────────┐  ┌────────────┐
│  Party A   │  │  Party B   │
└────────────┘  └────────────┘
```

### **Many Parties (6+)**
```typescript
// allParties = [P1, P2, P3, P4, P5, P6, Independent]
// totalParties = 7
// Result: lg: 3 (4 per row)

Row 1: [P1] [P2] [P3] [P4]
Row 2: [P5] [P6] [Ind]
```

---

## ✅ **Testing Checklist**

### **Different Party Counts**
- [ ] 1 party (no independent)
- [ ] 1 party + independent
- [ ] 2 parties
- [ ] 2 parties + independent
- [ ] 3 parties
- [ ] 3 parties + independent
- [ ] 4+ parties

### **Screen Sizes**
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Small desktop (1024px)
- [ ] Large desktop (1920px)

### **Layout Quality**
- [ ] Cards don't overflow
- [ ] Equal heights in same row
- [ ] Proper spacing
- [ ] Readable on all sizes

---

## 🎨 **Customization**

### **Adjust Breakpoints**

To change when columns change:
```typescript
if (totalParties === 1) return { xs: 12, sm: 12, md: 8, lg: 6 };
//                                                  ↑ Adjust here
```

### **Add More Rules**

For specific party counts:
```typescript
if (totalParties === 5) return { xs: 12, sm: 6, md: 4, lg: 2.4 };
if (totalParties === 6) return { xs: 12, sm: 6, md: 3, lg: 2 };
```

---

## 📊 **Performance**

### **Memoization**
```typescript
const getColumnSize = React.useMemo(() => {
  // Calculation only runs when allParties.length changes
  // Prevents unnecessary re-calculations
}, [allParties.length]);
```

### **Benefits**
- ✅ No re-calculation on every render
- ✅ Efficient dependency tracking
- ✅ Instant layout updates

---

## 🎯 **Summary**

**Feature:** Dynamic responsive grid layout  
**Input:** Total number of parties (including independent)  
**Output:** Optimal column sizes for all screen sizes  

**Breakpoint Strategy:**
- Mobile: Always 1 column
- Tablet: 2 columns max
- Desktop: 2-4 columns based on count

**Implementation:** Single memoized calculator function  
**Result:** Perfect layout for 1-10+ parties automatically

---

**Status:** ✅ Implemented  
**File:** `DashboardView.tsx`  
**Lines:** 184-196 (calculator), 399 (usage)  
**Dependencies:** allParties.length

🎉 **Grid now adapts perfectly to any number of parties!**


