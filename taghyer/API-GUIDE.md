# API Usage Guide - altaqyeer.q8votes.com

## 🌐 Available API

Based on exploration, there is **ONE main working API endpoint**:

```
https://altaqyeer.q8votes.com/search_request.php
```

**Method:** POST  
**Content-Type:** application/x-www-form-urlencoded  
**Authentication:** Session ID (PHPSESSID cookie)

---

## 📋 API Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `sorting` | string | Sort order (1 = default) | `"1"` |
| `firstname` | string | First name search | `"محمد"` |
| `secondname` | string | Second name search | `"علي"` |
| `thirdname` | string | Third name search | `"احمد"` |
| `forthname` | string | Fourth name search | `"حسن"` |
| `familyname` | string | Family/last name search | `"ابراهيم"` |
| `fullname` | string | Full name search | `"محمد علي احمد"` |
| `internal_reference_from` | string | Start of ID range | `"80000"` |
| `internal_reference_to` | string | End of ID range | `"85000"` |
| `employer` | string | Employer filter | `""` |
| `team_icon` | string | Team icon filter | `""` |
| `recordPerTime` | string | Records per page (max 100) | `"100"` |
| `start_from` | string | Pagination offset | `"0"` |
| `search_public_elections` | string | Election ID | `"30"` |

---

## 📝 Usage Examples

### 1. Get All Records (Paginated)

```javascript
const payload = {
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
  start_from: '0',  // Page 1
  search_public_elections: '30'
};
```

**Next page:** Change `start_from` to `'100'`, `'200'`, etc.

### 2. Search by First Name

```javascript
const payload = {
  sorting: '1',
  firstname: 'محمد',  // ← Search for "محمد"
  secondname: '',
  thirdname: '',
  forthname: '',
  familyname: '',
  fullname: '',
  internal_reference_from: '',
  internal_reference_to: '',
  employer: '',
  team_icon: '',
  recordPerTime: '50',
  start_from: '0',
  search_public_elections: '30'
};
```

### 3. Search by Family Name

```javascript
const payload = {
  sorting: '1',
  firstname: '',
  secondname: '',
  thirdname: '',
  forthname: '',
  familyname: 'احمد',  // ← Search for family name "احمد"
  fullname: '',
  internal_reference_from: '',
  internal_reference_to: '',
  employer: '',
  team_icon: '',
  recordPerTime: '50',
  start_from: '0',
  search_public_elections: '30'
};
```

### 4. Search by Full Name

```javascript
const payload = {
  sorting: '1',
  firstname: '',
  secondname: '',
  thirdname: '',
  forthname: '',
  familyname: '',
  fullname: 'علي محمد احمد',  // ← Full name search
  internal_reference_from: '',
  internal_reference_to: '',
  employer: '',
  team_icon: '',
  recordPerTime: '50',
  start_from: '0',
  search_public_elections: '30'
};
```

### 5. Search by Internal Reference Range

```javascript
const payload = {
  sorting: '1',
  firstname: '',
  secondname: '',
  thirdname: '',
  forthname: '',
  familyname: '',
  fullname: '',
  internal_reference_from: '80000',  // ← Start range
  internal_reference_to: '85000',    // ← End range
  employer: '',
  team_icon: '',
  recordPerTime: '100',
  start_from: '0',
  search_public_elections: '30'
};
```

---

## 🔄 Response Format

```json
{
  "status": "login",
  "data": [
    "<div id='1' class='student dob__0'>...</div>",
    "<div id='2' class='student dob__0'>...</div>"
  ],
  "message": "<h3>( 8719 ) تطابق </h3>",
  "search_details": {
    "firstname": "",
    "secondname": "",
    "thirdname": "",
    "forthname": "",
    "familyname": ""
  },
  "sorting": "1",
  "query2": "SELECT * FROM public_elections WHERE...",
  "count": 8719,
  "notify": "<div class='alert alert-success'>تم خصم 5 نقاط للبحث</div>"
}
```

### Response Fields

- **`status`**: Always `"login"` if authenticated
- **`data`**: Array of HTML-formatted records
- **`count`**: Total number of matching records
- **`message`**: HTML message with total count
- **`notify`**: Points deduction notice (5 points per search)

---

## 📦 Ready-to-Use Scripts

### 1. `save-response.js`
Fetch data and save to JSON file
```bash
node save-response.js
```

### 2. `api-examples.js`
Run multiple search scenarios
```bash
node api-examples.js
```

### 3. `explore-apis.js`
Discover other potential endpoints
```bash
node explore-apis.js
```

---

## 💡 Tips & Best Practices

### Pagination
- Total records: **8,719**
- Max per page: **100**
- Total pages: **~87 pages**

To get all data:
```javascript
for (let page = 0; page < 87; page++) {
  const start_from = page * 100;
  // Fetch with start_from...
}
```

### Points System
- Each search costs **5 points**
- Plan your searches efficiently
- Use specific filters to reduce searches

### Session Management
- Session ID: `PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4`
- May expire after inactivity
- Update if API returns authentication errors

### Rate Limiting
- Add delays between requests (500ms-1s recommended)
- Example: `await new Promise(r => setTimeout(r, 1000));`

---

## 🚫 Non-Working Endpoints

These endpoints were tested but returned 404 or 500 errors:

- ❌ `search_details.php` (500 Error)
- ❌ `get_record.php` (404)
- ❌ `statistics.php` (404)
- ❌ `elections_list.php` (404)
- ❌ `user_info.php` (404)

---

## 📊 Data Structure in HTML Response

Each record contains:
- **Internal Reference ID**: `<span class='internal_reference d-none' id='80575'>`
- **Full Name**: `<p id='_هيا_1' class='lead text-center public_elections'>هيا عبدالعزيز صالح ابا الخيل</p>`
- **Record Index**: `<div id='1' class='student dob__0'>`

Extract with regex:
```javascript
const refMatch = html.match(/internal_reference d-none' id='(\d+)'/);
const nameMatch = html.match(/class='lead text-center public_elections'>(.*?)<\/p>/);
```

---

## 🛠️ Advanced Usage

### Download All Records

```javascript
async function downloadAllRecords() {
  const totalPages = Math.ceil(8719 / 100);
  const allRecords = [];
  
  for (let page = 0; page < totalPages; page++) {
    const payload = {
      // ... standard payload
      recordPerTime: '100',
      start_from: String(page * 100),
    };
    
    const response = await fetch(url, { /* ... */ });
    const data = await response.json();
    allRecords.push(...data.data);
    
    console.log(`Downloaded page ${page + 1}/${totalPages}`);
    await new Promise(r => setTimeout(r, 1000)); // 1s delay
  }
  
  return allRecords;
}
```

---

## 📞 Support

For issues or questions:
1. Check session ID is valid
2. Ensure payload format is correct
3. Verify network connectivity
4. Check points balance

---

**Last Updated:** October 24, 2025

