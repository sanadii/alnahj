# ⚡ Quick API Reference

## 🎯 Bottom Line

**Only ONE working API endpoint:** `search_request.php`  
**Two modes:** Search (list) and Details (single record)

---

## 📋 API Mode 1: SEARCH (List Records)

```javascript
POST https://altaqyeer.q8votes.com/search_request.php

{
  sorting: '1',
  firstname: '',
  secondname: '',
  thirdname: '',
  forthname: '',
  familyname: '',
  fullname: '',
  internal_reference_from: '',
  internal_reference_to: '',
  employer: '',
  team_icon: '',
  recordPerTime: '100',        // Max 100
  start_from: '0',             // Pagination
  search_public_elections: '30'
}
```

**Returns:** List of records (HTML in JSON)  
**Total:** 8,719 records  
**Cost:** 5 points per search

---

## 📋 API Mode 2: DETAILS (Single Record) ⭐

```javascript
POST https://altaqyeer.q8votes.com/search_request.php

{
  row_id: '1',           // 1-8719 (MUST be "row_id")
  search_id: '30',       // Election ID
  show_details: '1'      // ANY value works (0, 1, 'x', '' all same)
}
```

**Returns:** Clean JSON with structured data

```json
{
  "mydata": [
    "إناث",                          // Gender
    "مسجل",                          // Status
    "AA51",                          // Team Icon
    "Community Services Team",       // Team Name
    "Ahmadi Services Group"          // Group Name
  ],
  "keys": ["gender", "registeration_status", "team_icon", "team_name", "group_name"]
}
```

---

## ⚡ KEY DISCOVERIES

### About `show_details` Parameter

✅ **Value doesn't matter** - These are ALL identical:
```javascript
show_details: '0'    // Works
show_details: '1'    // Works
show_details: '2'    // Works
show_details: '999'  // Works
show_details: ''     // Works
show_details: 'yes'  // Works
```

❌ **Without it** = Empty response:
```javascript
{ row_id: '2', search_id: '30' }  // Returns nothing
```

### About `row_id` Parameter

✅ **MUST be exactly "row_id":**
```javascript
row_id: '100'      // ✅ Works
id: '100'          // ❌ Returns empty data
record_id: '100'   // ❌ Returns empty data
```

### About Other Parameters

❌ **None of these work:**
- `show_related`
- `show_history`
- `show_votes`
- `show_team`
- `export`
- `format`
- etc.

---

## 🚀 Quick Start Commands

```bash
# Test search API
node "D:\React\election\taghyer\save-response.js"

# Test details API
node "D:\React\election\taghyer\test-details-api.js"

# Test parameter variations
node "D:\React\election\taghyer\test-show-details-variations.js"
node "D:\React\election\taghyer\test-other-parameters.js"
```

---

## 📊 Data Structure

### Search API Returns:
- HTML strings (needs parsing)
- Max 100 per request
- Costs 5 points

### Details API Returns:
- Clean JSON (no parsing needed)
- 1 record per request
- 5 fields: gender, status, team_icon, team_name, group_name
- Free (cost unknown)

---

## 💡 Best Strategy: Use Details API

```javascript
// Get ALL 8,719 records with complete data
for (let id = 1; id <= 8719; id++) {
  const data = await fetch(url, {
    method: 'POST',
    body: new URLSearchParams({
      row_id: String(id),
      search_id: '30',
      show_details: '1'  // Could be '0', '2', '', etc.
    })
  });
  // Process clean JSON...
}
```

**Time:** ~15 minutes (with 100ms delay)  
**Format:** Clean JSON (no HTML parsing)  
**Complete:** All 8,719 records

---

## 📞 Session Info

```javascript
PHPSESSID: '857a8eb3c95eb4dbfe07918c82c96ef4'
Election ID: 30
Total Records: 8,719
Base URL: 'https://altaqyeer.q8votes.com'
```

---

**Last Updated:** October 24, 2025  
**Status:** ✅ Fully Tested (25 parameter combinations)

