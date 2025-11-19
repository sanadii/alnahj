# 🔌 altaqyeer.q8votes.com API Scripts

Complete toolkit to access and retrieve data from `https://altaqyeer.q8votes.com`

---

## 📚 Quick Links

- **[SUMMARY.md](SUMMARY.md)** - Complete overview of findings
- **[API-GUIDE.md](API-GUIDE.md)** - Detailed API documentation  
- **This file** - Quick start guide

---

## 🎯 Available API

**ONLY ONE working endpoint found:**

```
https://altaqyeer.q8votes.com/search_request.php
```

- **Total Records:** 8,719
- **Search Types:** By name, family name, full name, ID range, or get all
- **Cost:** 5 points per search
- **Max per request:** 100 records

---

## Usage

### ✅ Option 1: Run and Save Response (RECOMMENDED)
```bash
cd taghyer
node save-response.js
```
**Saves response to:**
- `response-TIMESTAMP.json` - Full API response
- `response-summary.json` - Quick summary

### ✅ Option 2: View in Console Only
```bash
cd taghyer
node api-request.js
```

### ✅ Option 2: Python (Alternative - if Python installed)
```bash
cd taghyer
python api-request.py
```

### ✅ Option 3: TypeScript
```bash
cd taghyer
npx ts-node api-request.ts
```

### ❌ Option 4: Browser (CORS Error)
⚠️ **Does not work** - The API blocks browser requests due to CORS policy.
Use Node.js or Python instead.

## Configuration

- **URL**: `https://altaqyeer.q8votes.com/search_request.php`
- **Session ID**: `PHPSESSID=857a8eb3c95eb4dbfe07918c82c96ef4`
- **Payload**: See scripts for full payload details

## Response

The scripts will output:
- HTTP status code
- Response headers
- Response body (JSON or text)
- Total count: 8,719 records
- Records per page: 100

## Example Output

```
Status: 200 OK
Content-Type: text/html; charset=UTF-8

Response contains:
- Array of HTML-formatted voter records
- Arabic names and internal references
- Total matches: 8719
- Points deducted: 5
```

