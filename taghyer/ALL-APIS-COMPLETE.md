# 🎯 Complete API Reference - altaqyeer.q8votes.com

## 📊 Summary

**Tested:** 19 endpoints  
**Working:** 5 APIs  
**Main Endpoint:** `search_request.php` (with multiple modes)

---

## ✅ Working APIs

### 1. **Search API** - Get Records List

**Endpoint:** `https://altaqyeer.q8votes.com/search_request.php`  
**Method:** POST  
**Content-Type:** application/x-www-form-urlencoded

#### Parameters

```javascript
{
  sorting: '1',                    // Sort order
  firstname: '',                   // First name filter
  secondname: '',                  // Second name filter
  thirdname: '',                   // Third name filter
  forthname: '',                   // Fourth name filter
  familyname: '',                  // Family name filter
  fullname: '',                    // Full name search
  internal_reference_from: '',     // ID range start
  internal_reference_to: '',       // ID range end
  employer: '',                    // Employer filter
  team_icon: '',                   // Team icon filter
  recordPerTime: '100',            // Records per page (max 100)
  start_from: '0',                 // Pagination offset
  search_public_elections: '30'    // Election ID
}
```

#### Response Format

```json
{
  "status": "login",
  "data": [
    "<div id='1' class='student'>...HTML...</div>",
    "<div id='2' class='student'>...HTML...</div>"
  ],
  "message": "<h3>( 8719 ) تطابق </h3>",
  "count": 8719,
  "notify": "<div>تم خصم 5 نقاط للبحث</div>"
}
```

#### Features
- ✅ Search 8,719 total records
- ✅ Filter by name (first, second, third, fourth, family)
- ✅ Filter by ID range
- ✅ Pagination support (100 records max per request)
- ✅ Full text search
- ⚠️ Costs 5 points per search

---

### 2. **Details API** - Get Single Record Details ⭐ NEW

**Endpoint:** `https://altaqyeer.q8votes.com/search_request.php`  
**Method:** POST  
**Content-Type:** application/x-www-form-urlencoded

#### Parameters

```javascript
{
  row_id: '1',           // Record ID (1-8719)
  search_id: '30',       // Election/Search ID
  show_details: '1'      // Flag to show details
}
```

#### Response Format

```json
{
  "show_related_btn": "1",
  "status": "",
  "mydata": [
    "إناث",                          // Gender
    "مسجل",                          // Registration Status
    "WF11",                          // Team Icon
    "Fields Development Team (UG)",  // Team Name
    ""                               // Group Name
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

#### Data Fields

| Key | Arabic Label | Example Value |
|-----|-------------|---------------|
| `gender` | الجنس | إناث / ذكور |
| `registeration_status` | حالة القيد | مسجل |
| `team_icon` | رمز الفريق | WF11, CK11, AA51 |
| `team_name` | الفريق | Fields Development Team |
| `group_name` | المجموعة | Ahmadi Services Group |

#### Features
- ✅ Get detailed info for ANY record (row_id: 1-8719)
- ✅ Returns structured data (not HTML)
- ✅ Shows team/group assignments
- ✅ Gender and registration status
- ✅ No pagination needed

---

### 3. **Related Records API** - Get Related Entries

**Endpoint:** `https://altaqyeer.q8votes.com/search_request.php`  
**Method:** POST  
**Content-Type:** application/x-www-form-urlencoded

#### Parameters

```javascript
{
  row_id: '1',          // Record ID
  search_id: '30',      // Election/Search ID
  show_related: '1'     // Flag to show related records
}
```

#### Response Format

Returns HTML content (structure TBD - needs further testing)

#### Features
- ✅ Get records related to a specific person
- ⚠️ Response format needs investigation

---

### 4. **Index/Home Page** - Website Entry Point

**Endpoint:** `https://altaqyeer.q8votes.com/index.php`  
**Method:** GET

#### Response
Full HTML page (login page or dashboard if authenticated)

#### Features
- ✅ Check session validity
- ✅ Access web interface

---

## 📋 Complete Usage Examples

### Example 1: Get All Records (Page 1)

```javascript
const response = await fetch('https://altaqyeer.q8votes.com/search_request.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4'
  },
  body: new URLSearchParams({
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
    recordPerTime: '100',
    start_from: '0',
    search_public_elections: '30'
  })
});

const data = await response.json();
console.log(`Total: ${data.count}, Returned: ${data.data.length}`);
```

### Example 2: Get Details for Specific Record

```javascript
const response = await fetch('https://altaqyeer.q8votes.com/search_request.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4'
  },
  body: new URLSearchParams({
    row_id: '100',
    search_id: '30',
    show_details: '1'
  })
});

const details = await response.json();
console.log('Gender:', details.mydata[0]);
console.log('Status:', details.mydata[1]);
console.log('Team:', details.mydata[3]);
```

### Example 3: Search by Name

```javascript
const response = await fetch('https://altaqyeer.q8votes.com/search_request.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4'
  },
  body: new URLSearchParams({
    sorting: '1',
    firstname: 'محمد',
    secondname: '',
    thirdname: '',
    forthname: '',
    familyname: 'احمد',
    fullname: '',
    internal_reference_from: '',
    internal_reference_to: '',
    employer: '',
    team_icon: '',
    recordPerTime: '50',
    start_from: '0',
    search_public_elections: '30'
  })
});

const results = await response.json();
console.log(`Found ${results.count} matches`);
```

---

## 🔧 Ready-to-Use Scripts

### Get All Details for All Records

```javascript
// get-all-details.js
const fs = require('fs');

async function getAllDetails() {
  const allDetails = [];
  
  for (let rowId = 1; rowId <= 8719; rowId++) {
    const response = await fetch('https://altaqyeer.q8votes.com/search_request.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4'
      },
      body: new URLSearchParams({
        row_id: String(rowId),
        search_id: '30',
        show_details: '1'
      })
    });
    
    const details = await response.json();
    
    const record = {
      row_id: rowId,
      gender: details.mydata[0],
      status: details.mydata[1],
      team_icon: details.mydata[2],
      team_name: details.mydata[3],
      group_name: details.mydata[4]
    };
    
    allDetails.push(record);
    
    if (rowId % 100 === 0) {
      console.log(`Progress: ${rowId}/8719`);
      // Save checkpoint
      fs.writeFileSync(`checkpoint-${rowId}.json`, JSON.stringify(allDetails, null, 2));
    }
    
    await new Promise(r => setTimeout(r, 100)); // 100ms delay
  }
  
  fs.writeFileSync('all-details-complete.json', JSON.stringify(allDetails, null, 2));
  console.log('✅ Complete!');
}

getAllDetails();
```

---

## ❌ Non-Working Endpoints (404 or 500 Errors)

| Endpoint | Status | Notes |
|----------|--------|-------|
| `search_details.php` | 500 | Internal error |
| `account.php` | 404 | Not found |
| `balance.php` | 404 | Not found |
| `points.php` | 404 | Not found |
| `dashboard.php` | 404 | Not found |
| `elections.php` | 404 | Not found |
| `election_info.php` | 404 | Not found |
| `record_info.php` | 404 | Not found |
| `export.php` | 404 | Not found |
| `api.php` | 404 | Not found |
| `teams.php` | 404 | Not found |
| `groups.php` | 404 | Not found |
| `stats.php` | 404 | Not found |

---

## 💡 Best Practices

### 1. Rate Limiting
Add delays between requests to avoid overloading the server:
```javascript
await new Promise(r => setTimeout(r, 100)); // 100ms delay
```

### 2. Error Handling
Always check response status:
```javascript
if (response.status === 200) {
  const data = await response.json();
} else {
  console.error('Failed:', response.status);
}
```

### 3. Session Management
- Session ID may expire
- Check `index.php` to verify session is active
- Update session cookie if needed

### 4. Data Extraction
For search results (HTML), use regex:
```javascript
const refMatch = html.match(/internal_reference d-none' id='(\d+)'/);
const nameMatch = html.match(/class='lead text-center public_elections'>(.*?)<\/p>/);
```

---

## 📊 API Comparison

| API | Purpose | Records | Format | Cost |
|-----|---------|---------|--------|------|
| **Search API** | List/search records | Multiple | HTML in JSON | 5 points |
| **Details API** | Get single record details | Single | Clean JSON | Unknown |
| **Related API** | Get related records | Multiple | HTML | Unknown |

---

## 🎯 Recommended Workflow

### To Get Complete Dataset:

1. **Get all record IDs** (using Search API):
   - Paginate through all 87 pages
   - Extract row_id from each record
   - Save list of IDs

2. **Get details for each record** (using Details API):
   - Loop through all row_ids (1-8719)
   - Fetch details for each
   - Save structured data

3. **Combine data**:
   - Merge search results (names) with details (metadata)
   - Create complete dataset

### Estimated Time:
- Search API: ~2 minutes (87 pages × 1s delay)
- Details API: ~15 minutes (8719 records × 100ms delay)
- **Total: ~17 minutes** for complete dataset

---

## 📞 Support

**Session ID:** `PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4`  
**Election ID:** `30`  
**Base URL:** `https://altaqyeer.q8votes.com`

---

**Last Updated:** October 24, 2025  
**Status:** ✅ Verified & Working  
**Total APIs Discovered:** 5 working endpoints

