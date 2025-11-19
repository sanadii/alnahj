# PartyCard Component - Usage Guide

## 🎯 **Features**

1. ✅ **Independent Candidates Support** - Special styling for candidates without party affiliation
2. ✅ **Expandable Card** - Click to show/hide candidate list
3. ✅ **Responsive Design** - Adapts to different screen sizes
4. ✅ **Smooth Animations** - Collapse/expand transitions
5. ✅ **Hover Effects** - Interactive visual feedback

---

## 📚 **Basic Usage**

### **1. Regular Political Party**

```tsx
import { PartyCard } from './cards';

const party = {
  id: 1,
  name: 'Democratic Party',
  color: '#1976d2',
  candidateCount: 5
};

const candidates = [
  { id: 1, name: 'John Smith', number: 1, status: 'Active' },
  { id: 2, name: 'Jane Doe', number: 2, status: 'Active' },
  { id: 3, name: 'Bob Johnson', number: 3, status: 'Active' },
  { id: 4, name: 'Alice Williams', number: 4, status: 'Active' },
  { id: 5, name: 'Charlie Brown', number: 5, status: 'Active' }
];

<PartyCard party={party} candidates={candidates} totalCandidates={50} />
```

---

### **2. Independent Candidates**

```tsx
import { PartyCard } from './cards';

const independentParty = {
  id: 'independent',
  name: 'Independent',
  color: '#757575',
  candidateCount: 3,
  isIndependent: true  // ⭐ This flag triggers special styling
};

const independentCandidates = [
  { id: 101, name: 'Michael Anderson', number: 10 },
  { id: 102, name: 'Sarah Martinez', number: 11 },
  { id: 103, name: 'David Lee', number: 12 }
];

<PartyCard 
  party={independentParty} 
  candidates={independentCandidates} 
  totalCandidates={50} 
/>
```

**Special Features for Independents:**
- ✅ Square icon instead of circle
- ✅ User icon displayed in badge
- ✅ "Independent" chip badge
- ✅ Different subtitle text
- ✅ Same expandable functionality

---

## 🔧 **Component Props**

### **PartyCardProps**

```typescript
interface PartyCardProps {
  party: {
    id: number | string;
    name: string;
    color: string;                  // Hex color code (e.g., '#1976d2')
    candidateCount?: number;        // Optional if using candidates array
    isIndependent?: boolean;        // Flag for independent styling
  };
  candidates?: Candidate[];          // List of candidates (optional)
  totalCandidates: number;          // Total across all parties (for percentage)
}
```

### **Candidate Interface**

```typescript
interface Candidate {
  id: number | string;
  name: string;
  number?: number;                   // Candidate number (shows in avatar)
  status?: string;                   // Optional status text
}
```

---

## 📊 **Integration with DashboardView**

### **Example: Update DashboardView to use enhanced PartyCard**

```tsx
// In DashboardView.tsx

const partiesWithCandidates = parties.map(party => ({
  ...party,
  candidates: candidates.filter(c => c.partyId === party.id)
}));

// Add independent candidates
const independentCandidates = candidates.filter(c => !c.partyId || c.partyId === null);

if (independentCandidates.length > 0) {
  partiesWithCandidates.push({
    id: 'independent',
    name: 'Independent',
    color: '#757575',
    candidateCount: independentCandidates.length,
    isIndependent: true,
    candidates: independentCandidates
  });
}

// Render
<Grid container spacing={2}>
  {partiesWithCandidates.map((party) => (
    <Grid key={party.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <PartyCard 
        party={party} 
        candidates={party.candidates} 
        totalCandidates={totalCandidates} 
      />
    </Grid>
  ))}
</Grid>
```

---

## 🎨 **Styling Differences**

### **Regular Party vs Independent**

| Feature | Regular Party | Independent |
|---------|---------------|-------------|
| **Icon Shape** | Circle | Square |
| **Icon Content** | Solid color | User icon |
| **Badge** | None | "Independent" chip |
| **Subtitle** | "Political Party" | "Independent Candidates" |
| **Behavior** | Same | Same |

---

## 🖱️ **Interactive Features**

### **1. Click to Expand/Collapse**

- **Action:** Click anywhere on the card
- **Result:** Reveals/hides candidate list
- **Visual Feedback:**
  - Border color changes to party color when expanded
  - Smooth collapse/expand animation (300ms)
  - Chevron icon rotates

### **2. Expand/Collapse Button**

- **Location:** Top right corner
- **Action:** Click button (stops propagation)
- **Tooltip:** "Show candidates" / "Hide candidates"
- **Icon:** ChevronDown (collapsed) / ChevronUp (expanded)

### **3. Hover Effects**

- **Card Hover:**
  - Lifts up (-4px transform)
  - Border color changes to party color
  - Shadow increases
  
- **Candidate Row Hover:**
  - Background color changes
  - Border color changes to party color
  - Slides right (4px transform)

---

## 📱 **Responsive Behavior**

### **Grid Sizing**

```tsx
<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
  <PartyCard ... />
</Grid>
```

- **xs (mobile):** 1 column (full width)
- **sm (tablet):** 2 columns
- **md (desktop):** 3 columns
- **lg (large):** 4 columns

### **Card Height**

- Cards use `height: '100%'` to maintain equal heights in grid
- Expands vertically when candidate list is shown
- Smooth height transition with animation

---

## 🎯 **Use Cases**

### **1. Election Dashboard**
Display all parties with their candidates, including independents.

### **2. Party Comparison**
Compare candidate counts and see who's running for each party.

### **3. Candidate Browsing**
Quick way to view all candidates grouped by party.

### **4. Independent Candidates**
Special handling for candidates without party affiliation.

---

## 🔍 **Example Scenarios**

### **Scenario 1: No Candidates Data**

```tsx
// Only candidate count, no detailed list
const party = {
  id: 1,
  name: 'Republican Party',
  color: '#d32f2f',
  candidateCount: 8
};

<PartyCard party={party} totalCandidates={50} />
```

**Result:** 
- Card shows candidate count
- Click expands to show: "Candidate details not loaded"
- Can still see statistics

---

### **Scenario 2: Empty Party**

```tsx
const party = {
  id: 2,
  name: 'Green Party',
  color: '#4caf50',
  candidateCount: 0
};

<PartyCard party={party} totalCandidates={50} />
```

**Result:**
- Card displays "0 candidates"
- No expand/collapse button (disabled)
- Card is not clickable
- No hover transform effect

---

### **Scenario 3: Many Candidates**

```tsx
const party = {
  id: 3,
  name: 'Liberal Party',
  color: '#9c27b0',
  candidateCount: 15
};

const candidates = [...]; // 15 candidates

<PartyCard party={party} candidates={candidates} totalCandidates={50} />
```

**Result:**
- Shows "15 candidates"
- Scrollable list when expanded (if needed)
- All candidates displayed with numbers

---

## 🎨 **Customization**

### **Custom Colors for Independents**

```tsx
const independentParty = {
  id: 'ind',
  name: 'Independent',
  color: '#ff9800', // Orange instead of grey
  isIndependent: true
};
```

### **Auto-detect Independent**

The component automatically detects independent parties by name:

```tsx
const party = {
  id: 'ind',
  name: 'independent', // lowercase works too
  color: '#757575'
  // isIndependent flag not needed - auto-detected!
};
```

---

## ⚡ **Performance Tips**

1. **Memoize Candidate Lists:**
   ```tsx
   const partyCandidates = useMemo(
     () => candidates.filter(c => c.partyId === party.id),
     [candidates, party.id]
   );
   ```

2. **Virtual Scrolling** (for 50+ candidates):
   Consider using `react-window` for large candidate lists

3. **Lazy Loading:**
   Load candidate details only when card is expanded

---

## 🐛 **Troubleshooting**

### **Issue: Card not expanding**

**Solution:** Ensure `candidateCount > 0` or `candidates.length > 0`

### **Issue: Independent styling not showing**

**Solution:** Set `isIndependent: true` or ensure party name is "Independent" (case-insensitive)

### **Issue: Candidates not displaying**

**Solution:** Check that `candidates` array is properly formatted with required fields (`id`, `name`)

---

## 📦 **Import**

```tsx
import { PartyCard, type Candidate } from './cards';
```

---

**Component Status:** ✅ Production Ready  
**Last Updated:** November 5, 2025  
**Features Added:**
- Independent candidates support
- Expandable candidate list
- Click to expand/collapse
- Smooth animations

