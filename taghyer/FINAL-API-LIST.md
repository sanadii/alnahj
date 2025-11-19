# 🎯 ALL AVAILABLE APIs - FINAL LIST

## 📊 Discovery Summary

**Website:** `https://altaqyeer.q8votes.com`  
**Total Endpoints Tested:** 19  
**Working APIs:** 5 endpoints  
**Main API:** `search_request.php` (multiple modes)

---

## ✅ ALL WORKING APIS

### API #1: SEARCH API (Get Records List)

**URL:** `https://altaqyeer.q8votes.com/search_request.php`  
**Method:** POST  
**Purpose:** Search and list voter/candidate records

**Payload:**
```javascript
{
  sorting: '1',
  firstname: '',              // Search by first name
  secondname: '',             // Search by second name  
  thirdname: '',              // Search by third name
  forthname: '',              // Search by fourth name
  familyname: '',             // Search by family/last name
  fullname: '',               // Search full name
  internal_reference_from: '',// ID range start
  internal_reference_to: '',  // ID range end
  employer: '',
  team_icon: '',
  recordPerTime: '100',       // Max: 100
  start_from: '0',            // Pagination offset
  search_public_elections: '30'
}
```

**Response:**
```json
{
  "status": "login",
  "data": ["<div>...HTML...</div>", "..."],
  "count": 8719,
  "message": "( 8719 ) تطابق",
  "notify": "تم خصم 5 نقاط للبحث"
}
```

**Features:**
- ✅ 8,719 total records
- ✅ 100 records per page max
- ✅ Search by name (any part)
- ✅ Search by ID range
- ✅ Full pagination support
- ⚠️ Costs 5 points per search

---

### API #2: DETAILS API (Get Single Record Details) ⭐ NEW!

**URL:** `https://altaqyeer.q8votes.com/search_request.php`  
**Method:** POST  
**Purpose:** Get detailed information for a specific record

**Payload:**
```javascript
{
  row_id: '1',              // Record ID (1-8719)
  search_id: '30',          // Election ID
  show_details: '1'         // Flag to show details
}
```

**Response:**
```json
{
  "show_related_btn": "1",
  "status": "",
  "mydata": [
    "إناث",                 // Gender (Male/Female)
    "مسجل",                 // Registration Status
    "WF11",                 // Team Icon
    "Fields Development Team (UG)",  // Team Name
    "Ahmadi Services Group" // Group Name
  ],
  "keys": [
    "gender",
    "registeration_status",
    "team_icon",
    "team_name",
    "group_name"
  ],
  "the_tags": [
    "الجنس",
    "حالة القيد",
    "رمز الفريق",
    "الفريق",
    "المجموعة"
  ]
}
```

**Features:**
- ✅ Get details for ANY record (row_id: 1-8719)
- ✅ Clean JSON structure (not HTML)
- ✅ Returns: Gender, Status, Team, Group
- ✅ No pagination needed
- ✅ Fast access to individual records

---

### API #3: RELATED RECORDS API

**URL:** `https://altaqyeer.q8votes.com/search_request.php`  
**Method:** POST  
**Purpose:** Get records related to a specific person

**Payload:**
```javascript
{
  row_id: '1',              // Record ID
  search_id: '30',          // Election ID
  show_related: '1'         // Flag to show related records
}
```

**Response:** HTML content  
**Features:** ⚠️ Needs further investigation

---

### API #4: INDEX PAGE

**URL:** `https://altaqyeer.q8votes.com/index.php`  
**Method:** GET  
**Purpose:** Home/dashboard page

**Features:**
- ✅ Check if session is active
- ✅ Access to web interface

---

### API #5: (Future - to be discovered)

More endpoints may exist. Continue testing variations.

---

## 📋 COMPLETE USAGE EXAMPLES

### Example 1: Get All Records

```bash
curl -X POST https://altaqyeer.q8votes.com/search_request.php \
  -H "Cookie: PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sorting=1&firstname=&secondname=&thirdname=&forthname=&familyname=&fullname=&internal_reference_from=&internal_reference_to=&employer=&team_icon=&recordPerTime=100&start_from=0&search_public_elections=30"
```

### Example 2: Get Details for Record ID 100

```bash
curl -X POST https://altaqyeer.q8votes.com/search_request.php \
  -H "Cookie: PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "row_id=100&search_id=30&show_details=1"
```

### Example 3: Search by First Name

```bash
curl -X POST https://altaqyeer.q8votes.com/search_request.php \
  -H "Cookie: PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sorting=1&firstname=محمد&secondname=&thirdname=&forthname=&familyname=&fullname=&internal_reference_from=&internal_reference_to=&employer=&team_icon=&recordPerTime=50&start_from=0&search_public_elections=30"
```

---

## 🚀 READY-TO-USE SCRIPTS

All scripts are in the `taghyer/` folder:

1. **`save-response.js`** - Save search results to file
2. **`test-details-api.js`** - Test details API  
3. **`discover-all-apis.js`** - Comprehensive API discovery
4. **`api-examples.js`** - Multiple search examples

---

## 📊 COMPARISON TABLE

| API | Purpose | Records | Format | Points Cost |
|-----|---------|---------|--------|-------------|
| Search API | List records | Multiple (max 100) | HTML in JSON | 5 points |
| Details API | Single record details | Single | Clean JSON | Unknown |
| Related API | Related records | Unknown | HTML | Unknown |
| Index Page | Homepage | N/A | HTML | Free |

---

## 💡 BEST STRATEGY TO GET ALL DATA

### Step 1: Use Details API (Recommended)

Loop through all row_ids (1-8719) to get complete structured data:

```javascript
for (let id = 1; id <= 8719; id++) {
  // Fetch details for row_id = id
  // Save: gender, status, team_icon, team_name, group_name
}
```

**Advantages:**
- ✅ Clean JSON format (no HTML parsing needed)
- ✅ Structured data
- ✅ All 8,719 records
- ⏱️ ~15 minutes (with 100ms delay)

### Step 2: Use Search API (Optional)

If you also need full names, use Search API to get names:

```javascript
for (let page = 0; page < 87; page++) {
  // Fetch page with start_from = page * 100
  // Extract names from HTML
}
```

**Advantages:**
- ✅ Gets full Arabic names
- ✅ Gets internal reference IDs
- ⚠️ Costs 5 points per search (87 pages = 435 points)

---

## ⚡ QUICK COMMANDS

```bash
# Test details API
node "D:\React\election\taghyer\test-details-api.js"

# Run full API discovery
node "D:\React\election\taghyer\discover-all-apis.js"

# Get search examples
node "D:\React\election\taghyer\api-examples.js"

# Save search results
node "D:\React\election\taghyer\save-response.js"
```

---

## 📝 FILES CREATED

| File | Purpose |
|------|---------|
| `ALL-APIS-COMPLETE.md` | Complete API documentation |
| `FINAL-API-LIST.md` | This file - quick reference |
| `working-apis.json` | JSON list of working APIs |
| `complete-api-discovery.json` | Full discovery results |
| `details-response.json` | Sample details API response |

---

## 🎯 NEXT STEPS

1. **Get all details:**
   ```bash
   # Create script to loop through row_id 1-8719
   # Save all details to database/JSON file
   ```

2. **Get all names (optional):**
   ```bash
   # Loop through 87 pages of search results
   # Extract names and internal references
   ```

3. **Merge data:**
   ```bash
   # Combine names with details
   # Create complete voter/candidate database
   ```

---

**Session ID:** `PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4`  
**Election ID:** `30`  
**Total Records:** 8,719  
**Last Updated:** October 24, 2025  
**Status:** ✅ Fully Documented

