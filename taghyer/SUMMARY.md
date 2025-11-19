# 📊 API Discovery Summary

## ✅ What We Found

### Working API Endpoint: `search_request.php`

**Base URL:** `https://altaqyeer.q8votes.com/search_request.php`

This is the **ONLY working API** on the website. It's a powerful search endpoint that allows you to:

---

## 🔍 Search Capabilities

| Search Type | Total Results | Example |
|-------------|---------------|---------|
| **All Records** | 8,719 records | Get everything (paginated) |
| **By First Name** (محمد) | 897 matches | Search first name field |
| **By Family Name** (احمد) | 48 matches | Search last name field |
| **By Full Name** | 176 matches | Search complete name |
| **By ID Range** | 89 matches | Filter by internal reference |

---

## 📦 Available Files & Scripts

### Core Scripts

1. **`save-response.js`** ⭐ RECOMMENDED
   - Fetches data and saves to JSON file
   - Usage: `node taghyer/save-response.js`
   - Output: `response-TIMESTAMP.json` + `response-summary.json`

2. **`api-examples.js`** 📚 DEMO
   - Demonstrates 6 different search scenarios
   - Usage: `node "D:\React\election\taghyer\api-examples.js"`
   - Shows capabilities of the API

3. **`explore-apis.js`** 🔍 DISCOVERY
   - Tests potential endpoints
   - Usage: `node "D:\React\election\taghyer\explore-apis.js"`
   - Result: Only `search_request.php` works

### Support Files

4. **`api-request.js`** - Console-only display (no save)
5. **`api-request.ts`** - TypeScript version
6. **`api-request.py`** - Python version (requires Python)
7. **`api-request.html`** - Browser version (CORS blocked)

### Documentation

8. **`API-GUIDE.md`** - Complete API documentation
9. **`README.md`** - Quick start guide
10. **`SUMMARY.md`** - This file

---

## 💡 Key Findings

### Authentication
- ✅ Uses session cookie: `PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4`
- ⚠️ May expire - update if needed

### Data Structure
- **Total records:** 8,719
- **Max per request:** 100 records
- **Data format:** HTML-formatted strings (needs parsing)
- **Each record has:**
  - Internal reference ID
  - Full name (Arabic)
  - Additional details link (costs 5 points)

### Points System
- Each search costs **5 points**
- Deducted automatically per request
- Plan searches efficiently

### Pagination
- Use `start_from` parameter
- Page 1: `start_from: '0'`
- Page 2: `start_from: '100'`
- Page 3: `start_from: '200'`
- Total pages: ~87 (8719 ÷ 100)

---

## 🚀 Quick Start Commands

```bash
# Get all data (first 100 records) and save
node "D:\React\election\taghyer\save-response.js"

# See all search examples
node "D:\React\election\taghyer\api-examples.js"

# Explore other endpoints (optional)
node "D:\React\election\taghyer\explore-apis.js"
```

---

## 📝 Sample Use Cases

### 1. Download All Records

Modify `save-response.js` to loop through all pages:

```javascript
for (let page = 0; page < 87; page++) {
  payload.start_from = String(page * 100);
  // fetch and save...
}
```

### 2. Search Specific Person

```javascript
payload.firstname = 'محمد';
payload.familyname = 'احمد';
// fetch...
```

### 3. Get Records by ID Range

```javascript
payload.internal_reference_from = '80000';
payload.internal_reference_to = '85000';
// fetch...
```

---

## ❌ Non-Working Endpoints

These were tested but returned errors:

| Endpoint | Status | Notes |
|----------|--------|-------|
| `search_details.php` | 500 Error | Details link in HTML (needs different params?) |
| `get_record.php` | 404 | Not found |
| `statistics.php` | 404 | Not found |
| `elections_list.php` | 404 | Not found |
| `user_info.php` | 404 | Not found |

---

## 🎯 Next Steps

1. **To get data:**
   ```bash
   node "D:\React\election\taghyer\save-response.js"
   ```

2. **To search by name:**
   - Edit `save-response.js`
   - Change `firstname`, `secondname`, or `familyname` fields
   - Run script

3. **To get all 8,719 records:**
   - Create a loop script
   - Iterate through all 87 pages
   - Add 1-second delay between requests
   - Estimated time: ~2 minutes

4. **To parse HTML data:**
   - Use regex or HTML parser
   - Extract: internal_reference, fullname
   - Convert to clean JSON/CSV

---

## 📊 Statistics

- ✅ **API Endpoints Tested:** 6
- ✅ **Working Endpoints:** 1
- ✅ **Total Records Available:** 8,719
- ✅ **Search Types Available:** 5+ (name, ID range, full text)
- ✅ **Cost Per Search:** 5 points

---

## 📞 Need Help?

1. Check `API-GUIDE.md` for detailed documentation
2. Review `api-examples.js` for usage patterns
3. Ensure session ID is valid
4. Verify payload format matches examples

---

**Created:** October 24, 2025  
**Status:** ✅ Complete & Working

