# Quick Start: Phase 2 Testing

Follow these steps to set up and test Phase 2 (Election & Electors).

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configure Database (1 minute)

```powershell
# Copy environment template
copy .env.example .env

# Edit .env and set (minimum):
# SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(50))">
# DB_NAME=election_db
# DB_USER=postgres
# DB_PASSWORD=your_password

# Create database
createdb election_db
```

### Step 3: Run Migrations (1 minute)

```powershell
python manage.py makemigrations
python manage.py migrate
```

### Step 4: Create Superuser (1 minute)

```powershell
python manage.py createsuperuser
# Email: admin@example.com
# Password: (your choice)
```

### Step 5: Start Server

```powershell
python manage.py runserver
```

---

## 📝 Create Election & Committees

### Option A: Via Django Admin (Easiest)

1. Go to: http://localhost:8000/admin
2. Login with superuser
3. **Create Election**:
   - Click "Elections" → "Add Election"
   - Name: "KOC Election 2025"
   - Voting mode: "Both"
   - Status: "Setup"
   - Save

4. **Create Committees** (from your CSV):
   Extract unique committee codes from `koc-electors.csv`:
   - EK-II (Male)
   - FC#28 (Female)
   - ... (check your CSV for all unique codes)
   
   For each committee:
   - Click "Committees" → "Add Committee"
   - Election: Select the one you created
   - Code: "EK-II"
   - Name: "Committee EK-II"
   - Gender: "Male"
   - Save

### Option B: Via API (For developers)

```http
# 1. Login
POST http://localhost:8000/api/auth/login/
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "your_password"
}
```

Copy the `access` token from response.

```http
# 2. Create Election
POST http://localhost:8000/api/election/
Authorization: Bearer <your_access_token>
Content-Type: application/json

{
    "name": "KOC Election 2025",
    "voting_mode": "BOTH",
    "status": "SETUP",
    "max_candidates_per_ballot": 19
}
```

```http
# 3. Create Committee
POST http://localhost:8000/api/election/committees/
Authorization: Bearer <your_access_token>
Content-Type: application/json

{
    "election": 1,
    "code": "EK-II",
    "name": "Committee EK-II - Male",
    "gender": "MALE"
}
```

---

## 📥 Import Electors from CSV

### Important: Get Committee Codes First

Before importing, extract all unique committee codes from your CSV:

```powershell
# Quick way (PowerShell)
Import-Csv ..\docs\project\koc-electors.csv | Select-Object -Property Code -Unique | Sort-Object Code
```

Create a committee for each unique code.

### Import via API

Use Postman, Insomnia, or curl:

```http
POST http://localhost:8000/api/electors/import/
Authorization: Bearer <your_access_token>
Content-Type: multipart/form-data

file: <select ../docs/project/koc-electors.csv>
update_existing: false
```

**Response:**
```json
{
    "message": "Import completed successfully",
    "results": {
        "success": true,
        "total_rows": 979,
        "created": 975,
        "updated": 0,
        "skipped": 4,
        "errors": [],
        "warnings": []
    }
}
```

---

## 🧪 Test the System

### 1. Check Statistics

```http
GET http://localhost:8000/api/electors/statistics/
Authorization: Bearer <token>
```

### 2. Search by KOC ID

```http
GET http://localhost:8000/api/electors/search/?koc_id=84698
Authorization: Bearer <token>
```

**Expected Response:**
```json
[
    {
        "koc_id": "84698",
        "full_name": "Khalifah Yousef Al-Loughani",
        "name_first": "Khalifah",
        "name_last": "Al-Loughani",
        "name_before_last": "",
        "section": "GC-01/GC-02&HUB-III",
        "committee_code": "EK-II",
        "mobile": "99921622",
        ...
    }
]
```

### 3. Search by Name

```http
GET http://localhost:8000/api/electors/search/?name=Khalifah
Authorization: Bearer <token>
```

### 4. Search by Family Name

```http
GET http://localhost:8000/api/electors/search/?family_name=Al-Loughani
Authorization: Bearer <token>
```

### 5. Search by Committee

```http
GET http://localhost:8000/api/electors/search/?committee=EK-II
Authorization: Bearer <token>
```

### 6. Get Committee Electors

```http
GET http://localhost:8000/api/election/committees/1/electors/
Authorization: Bearer <token>
```

### 7. Test Attendance Integration

```http
# Search elector for attendance marking
GET http://localhost:8000/api/attendance/search-elector/?koc_id=84698&committee=EK-II
Authorization: Bearer <token>
```

**Response:**
```json
{
    "found": true,
    "data": {
        "koc_id": "84698",
        "full_name": "Khalifah Yousef Al-Loughani",
        "section": "GC-01/GC-02&HUB-III",
        "committee_code": "EK-II",
        "has_attended": false
    }
}
```

---

## 🎯 What to Verify

### ✅ Checklist

- [ ] Server starts without errors
- [ ] Can login to Django admin
- [ ] Can create election
- [ ] Can create committees
- [ ] CSV import succeeds
- [ ] Can search electors by KOC ID
- [ ] Can search electors by name
- [ ] Can search by family name
- [ ] Statistics show correct counts
- [ ] Attendance search finds electors
- [ ] Committee electors list works

---

## 🐛 Troubleshooting

### Import Fails: "Committee not found"

**Problem**: Electors have committee codes that don't exist yet.

**Solution**: 
1. Extract all unique committee codes from CSV
2. Create all committees first
3. Then import electors

### No Electors Found

**Problem**: Electors imported but search returns empty.

**Solution**:
- Check `is_active=True` in database
- Verify committees were assigned correctly
- Check Django admin to see if electors exist

### Migration Errors

**Problem**: Migrations fail due to dependencies.

**Solution**:
```powershell
# Delete all migrations (development only)
Remove-Item apps/*/migrations/0*.py

# Recreate migrations
python manage.py makemigrations
python manage.py migrate
```

---

## 📊 Expected Results

After successful import:

**Total Electors**: ~979  
**Committees**: 10-20 (depends on unique codes in CSV)  
**Search Results**: Fast (<500ms)  
**All APIs**: Working

---

## 🎉 Success!

If everything works, you're ready for **Phase 3: Guarantee System**!

**Next Steps**:
1. Test all search features
2. Verify attendance integration
3. Proceed to Phase 3 implementation

---

**Need Help?**
- Check `backend/PHASE-2-SUMMARY.md` for detailed documentation
- Review `backend/README.md` for general setup
- Check Django admin for data verification

