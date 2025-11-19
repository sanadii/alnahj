# Attendance Module - Quick Start Guide

**Quick reference for using the attendance tracking system**

---

## 🚀 Getting Started

### Access the Module
1. Start the application: `npm start` (from frontend directory)
2. Login with your credentials
3. Navigate to **Attendance** in the sidebar menu

---

## 📱 Using the Interface

### Tab 1: Mark Attendance

**Quick Search & Mark:**
```
1. Enter KOC ID (e.g., "84698")
2. Press Enter or click "Search Elector"
3. Review elector details
4. (Optional) Add notes
5. Click "Mark Attended"
```

**Visual Feedback:**
- 🟢 **Green Card**: Elector found, ready to mark attendance
- 🟠 **Orange Card**: Elector already attended (shows timestamp)
- 🔴 **Red Alert**: Elector not found (walk-in suggestion)

**Tips:**
- Focus automatically on KOC ID field
- Press Enter to search (no need to click button)
- Form clears automatically after successful mark
- Committee code is optional (auto-detects from assignment)

### Tab 2: Attendance List

**View All Records:**
- Real-time list of all marked attendance
- Shows: KOC ID, Name, Committee, Time, Marked By, Type

**Search & Filter:**
- Search by KOC ID, name, or committee code
- Filter by Walk-in status
- Click refresh to update list

**Actions:**
- 🗑️ Delete (Admin only) - removes attendance record

### Tab 3: Statistics

**Committee Statistics:**
```
1. Select committee from dropdown
2. View real-time statistics:
   - Total Electors
   - Attended (with percentage)
   - Pending
   - Walk-ins
3. See hourly breakdown chart
```

**Metrics:**
- Progress bar shows attendance rate
- Color coding:
  - Green: ≥75%
  - Orange: 50-74%
  - Red: <50%

---

## 🎯 Common Workflows

### Workflow 1: Regular Elector Check-in
```
1. Tab: Mark Attendance
2. Enter: KOC ID
3. Verify: Name, Section, Committee
4. Click: "Mark Attended"
5. Done: Green success toast appears
```

### Workflow 2: Check Existing Attendance
```
1. Tab: Attendance List
2. Search: Enter KOC ID or name
3. View: Attendance timestamp and details
```

### Workflow 3: Monitor Committee Progress
```
1. Tab: Statistics
2. Select: Committee from dropdown
3. Monitor: Real-time attendance rate
4. Review: Hourly breakdown trends
```

### Workflow 4: Handle Already Attended
```
1. Search: KOC ID
2. Result: Orange card shows "Already Attended"
3. Info: See when they attended
4. Action: Inform elector, do not re-mark
```

---

## ⚠️ Important Notes

### Do's ✅
- ✅ Verify elector details before marking
- ✅ Add notes for special circumstances
- ✅ Check "Already Attended" status
- ✅ Refresh statistics periodically
- ✅ Use search to verify existing attendance

### Don'ts ❌
- ❌ Don't mark attendance without verification
- ❌ Don't delete records (admin use only)
- ❌ Don't re-mark already attended electors
- ❌ Don't skip committee verification
- ❌ Don't mark for wrong committee

---

## 🔑 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Search elector |
| `Tab` | Navigate fields |
| `Esc` | Clear search (future) |

---

## 🐛 Troubleshooting

### "Elector not found"
- **Check**: KOC ID spelling
- **Verify**: Elector in database
- **Option**: Walk-in elector flow (if supported)

### "Already attended"
- **Status**: Normal - elector already checked in
- **Info**: See timestamp of original attendance
- **Action**: No further action needed

### "Not assigned to this committee"
- **Issue**: Elector assigned to different committee
- **Fix**: Enter correct committee code or contact admin

### Loading forever
- **Check**: Network connection
- **Try**: Refresh page
- **Contact**: Support if persists

### Can't delete attendance
- **Reason**: Admin permission required
- **Solution**: Contact administrator

---

## 📊 Understanding Statistics

### Total Electors
- Count of all electors assigned to committee
- Includes both attended and pending

### Attended
- Number who have checked in
- Percentage of total electors
- Does NOT include walk-ins

### Pending
- Electors not yet attended
- Calculated: Total - Attended
- Updates in real-time

### Walk-ins
- Electors added on voting day
- Not in original committee list
- Tracked separately for reporting

### Hourly Breakdown
- Shows attendance by hour (8:00-17:00)
- Bar height indicates count
- Helps identify peak times

---

## 🔐 Permissions

| Action | User | Admin |
|--------|------|-------|
| Search Elector | ✅ | ✅ |
| Mark Attendance | ✅ | ✅ |
| View List | ✅ (Own committees) | ✅ (All) |
| View Statistics | ✅ (Own committees) | ✅ (All) |
| Delete Attendance | ❌ | ✅ |
| Refresh Statistics | ❌ | ✅ |

---

## 💡 Pro Tips

1. **Use Enter Key**: Faster than clicking search button
2. **Auto-complete**: System auto-fills committee from elector data
3. **Notes Field**: Use for special circumstances or issues
4. **Real-time Search**: List filters as you type
5. **Hourly Trends**: Check hourly breakdown to predict rush times
6. **Color Coding**: Quick visual status with color-coded chips
7. **Toast Messages**: Watch for success/error notifications
8. **Empty Committee**: Select committee in stats tab first

---

## 🔄 Data Refresh

### Automatic
- List refreshes after marking attendance
- Statistics cache: 5 minutes
- UI updates: Real-time

### Manual
- Click refresh icon in list view
- Admin can force refresh statistics
- Page reload: Full data refresh

---

## 📱 Mobile Usage

- ✅ Fully responsive design
- ✅ Touch-friendly buttons
- ✅ Optimized for tablets
- ✅ Works on smartphones
- ✅ Portrait and landscape modes

---

## 🆘 Support

**Issues?**
- Check network connection
- Verify login status
- Try page refresh
- Contact system administrator

**Feature Requests?**
- Submit through proper channels
- Document use case
- Suggest implementation

---

## 📚 Related Documentation

- **Full Implementation**: `ATTENDANCE-MODULE-IMPLEMENTATION.md`
- **Backend API**: `backend/apps/attendance/README.md`
- **User Manual**: Coming soon
- **Admin Guide**: Coming soon

---

**Last Updated**: October 25, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅

