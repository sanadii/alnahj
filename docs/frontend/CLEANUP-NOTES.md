# Project Cleanup Notes

**Date**: November 2, 2025  
**Status**: Cleanup in Progress 🧹

---

## 🔍 Issues Found

### 1. FormFields Component - FIXED ✅

**Problem**: 
- `frontend/src/shared/components/forms/FormFields.tsx` was from another project (booking/salon management)
- Imported `clientsSelector` which doesn't exist in election management system
- Used Reactstrap, Syncfusion, and other libraries not used in this project
- Caused runtime error: "The requested module does not provide an export named 'clientsSelector'"

**Solution**:
- Replaced with stub component that prevents import errors
- Added clear warnings that it needs proper implementation

**Status**: ✅ **FIXED** - Error resolved, but needs proper implementation

---

### 2. Settings Directory - Needs Review ⚠️

**Location**: `frontend/src/views/settings/`

**Problem**:
Contains extensive code from a salon/booking management system including:
- Services management
- Staff management  
- Business locations
- Calendar settings
- Roster management
- Stock management
- Promotions, rewards, gift vouchers
- And much more...

**Files That May Not Belong**:
- `services/` - Entire directory (salon services)
- `staff/` - Staff management (not election staff)
- `sales/` - Discounts, vouchers, packages
- `stock/` - Inventory management
- `business/` - Business details, locations
- `calendar/` - Calendar settings, waitlist
- `resources/` - Resource management
- Many HTML template files

**Used By**:
- `services/ServiceModal.tsx` imports the problematic `FormFields`
- Various other components in settings directory

**Recommendation**:
Determine which settings are needed for election management system:
- ✅ **Keep**: User settings, authentication, system config
- ❌ **Remove**: Salon-specific features (services, staff, stock, calendar bookings, etc.)

**Status**: ⚠️ **NEEDS REVIEW**

---

### 3. Unused Selectors - Potential Issue ⚠️

**Files Using Non-Election Selectors**:

```typescript
// From settings directory:
- settingsSelector (used in multiple files)
- staffSelector (used in StaffList.tsx, StaffForm.tsx)
- servicesSelector (used in ServiceFormPage.tsx)
- businessDetailsSelector (used in multiple files)
```

**Current Valid Selectors** (from `frontend/src/selectors/index.ts`):
```typescript
✅ authSelector
✅ userSelector
✅ usersSelector
✅ electionsSelector
✅ committeesSelector
✅ guaranteesSelector
✅ attendanceSelector
✅ votingSelector
```

**Status**: ⚠️ **NEEDS REVIEW** - Settings selectors may not exist

---

## 🎯 Recommended Cleanup Actions

### Immediate (High Priority)

1. ✅ **Fix FormFields** - DONE
   - Replaced with stub to prevent crashes
   
2. **Audit Settings Directory**
   - Review each subdirectory
   - Identify which are needed for election system
   - Remove or move salon/booking specific code

3. **Check Selector Usage**
   - Verify all imported selectors exist
   - Remove references to non-existent selectors
   - Update components to use correct selectors

### Short Term

4. **Implement Proper FormFields** (if needed)
   - Use Material-UI instead of Reactstrap
   - Create election-specific form fields
   - Follow existing component patterns

5. **Clean Up Routes**
   - Remove routes to salon/booking features
   - Keep only election-relevant routes

6. **Remove Unused Dependencies**
   - Check package.json for booking/salon specific packages
   - Remove if not used elsewhere

### Long Term

7. **Complete Settings Refactor**
   - Create election-specific settings structure
   - Implement only needed features
   - Remove all salon/booking code

---

## 📋 Cleanup Checklist

### Phase 1: Critical Fixes
- [x] Fix FormFields component (stub created)
- [ ] Audit settings directory
- [ ] Verify all selector imports
- [ ] Remove broken imports

### Phase 2: Settings Cleanup
- [ ] Identify needed settings pages
- [ ] Remove salon-specific code
- [ ] Update routes
- [ ] Test remaining functionality

### Phase 3: Deep Clean
- [ ] Remove unused dependencies
- [ ] Clean up HTML template files
- [ ] Remove duplicate/backup files
- [ ] Update documentation

---

## 🗂️ Files to Review/Remove

### Definitely Remove (Salon/Booking Specific)

```
frontend/src/views/settings/
├── services/ (entire directory - salon services)
├── staff/ (salon staff management)
├── sales/ (discounts, vouchers, packages)
├── stock/ (inventory management)
├── business/ (business locations, details)
├── calendar/ (waitlist, calendar booking)
├── resources/ (resource management)
├── html/ (all HTML templates)
└── Many individual files (Roster, Promote, OnlineBooking, etc.)
```

### Review Before Removing

```
frontend/src/views/settings/
├── Administration.tsx (might be useful for election admin)
├── Notifications.tsx (might be useful)
└── integrations/ (might be useful)
```

---

## 🚨 Immediate Impact

**Error Fixed**: ✅  
The runtime error about `clientsSelector` is now resolved. The application should run without crashes.

**Warnings Added**: ⚠️  
Components will show clear warnings about stub implementations so developers know what needs work.

---

## 📞 Next Steps

1. **Test the application** to ensure no more selector errors
2. **Review settings directory** with team to determine what's needed
3. **Create tickets** for proper FormFields implementation (if needed)
4. **Schedule cleanup sprint** to remove salon/booking code

---

**Created By**: AI Assistant  
**Date**: November 2, 2025  
**Status**: Initial cleanup complete, further review needed

---

*This is a living document. Update as cleanup progresses.*

