# Parties and Candidates Import Summary

**Date:** November 5, 2025  
**Action:** Imported political parties and candidates from CSV files  
**Election:** KOC 2025 (ID: 1)

## Files Created

### 1. CSV Source Files

#### `parties.csv` (46 bytes)
- 2 political parties
- Encoding: UTF-8
- Columns: party_name

#### `candidates.csv` (1,843 bytes)
- 30 candidates total
- Encoding: UTF-8
- Columns: number, name, party

### 2. Management Commands

#### `create_party_candidate_csv.py`
- Django management command to generate CSV files from campaign posters
- Location: `apps/electors/management/commands/`
- Usage: `python manage.py create_party_candidate_csv`

#### `import_parties_candidates.py`
- Django management command to import parties and candidates into database
- Location: `apps/candidates/management/commands/`
- Usage: `python manage.py import_parties_candidates [--election-id ID] [--clear]`

## Import Results

### Database Update Summary:
- ✅ **Parties Created:** 2
- ✅ **Candidates Created:** 30
- ✅ **Errors:** 0

### Parties Imported:

1. **الإئتلاف (The Coalition)**
   - Party ID: 20
   - Color: #D32F2F (Red)
   - Candidates: 15
   - Numbers: 1-15

2. **التغيير (The Change)**
   - Party ID: 21
   - Color: #1976D2 (Blue)
   - Candidates: 15
   - Numbers: 16-30

## Candidates Breakdown

### الإئتلاف Candidates (1-15):
1. خالد محمد مبارك الخضير
2. نصار صنيتان فلاح المطيري
3. يوسف يعقوب بعضاء الكندي
4. فلاح سعد ناهي العازمي
5. مشعل عبد العزيز قائم العميري
6. أحمد جاسم الفيحان الشمري
7. م. سالم علي ابراهيم الكندي
8. محمد جلال الجلال السهلي
9. م. جابر مبارك العاده البغيلي
10. محمد محمود محمد الصباق
11. م. بالد محمد خفران العازمي
12. عبدالله يوسف حاجي الفيلكاوي
13. م. فيصل أحمد علي الكندي
14. حميد أحمد قربان حجي
15. نواف عبدالله التحاميل الفضلي

### التغيير Candidates (16-30):
16. سيف محمد القحطاني
17. أنس حسن الصميط
18. حسين علي العريان
19. حمد عدنان الكندري
20. عايض سفر الهاجري
21. حمد زكريا سالم السالم
22. محسن غازي بويابس
23. محمد احمد الرشيد
24. عبد الرحمن عبد العزيز الرشود
25. عبد الله صلاح الدرباس
26. محمد اسحاق الفيلكاوي
27. مصطفى عادل علوم
28. عبد العزيز عبد الله الكندري
29. محمد خلف الشيباني
30. صلاح الدين طعمة الشعري

## Database Schema

### Party Model
- `id`: Primary key
- `election`: Foreign key to Election
- `name`: Party name (varchar 200)
- `abbreviation`: Party abbreviation (varchar 20)
- `color`: Party color hex code (varchar 7)
- `description`: Party description (text)
- `is_active`: Boolean flag
- `created_at`, `updated_at`: Timestamps

### Candidate Model
- `id`: Primary key
- `election`: Foreign key to Election
- `name`: Candidate name (varchar 200)
- `candidate_number`: Ballot number (integer)
- `party`: Foreign key to Party (nullable)
- `party_affiliation`: Party name string (varchar 100)
- `is_active`: Boolean flag
- `created_at`, `updated_at`: Timestamps

## Import Process

### Step 1: CSV Generation
```bash
python manage.py create_party_candidate_csv
```
- Extracted data from campaign poster images
- Created `parties.csv` and `candidates.csv`
- Proper UTF-8 encoding for Arabic text

### Step 2: Database Import
```bash
python manage.py import_parties_candidates --clear
```
- Cleared existing parties and candidates (20 candidates, 5 parties)
- Imported 2 new parties
- Imported 30 new candidates
- Linked candidates to their respective parties

### Step 3: Verification
- All 30 candidates successfully imported
- All 2 parties successfully imported
- Candidate numbers: 1-30
- Party distribution: 15 candidates each

## Command Options

### `import_parties_candidates` Options:
- `--election-id ID`: Specify election ID (default: most recent)
- `--parties-file PATH`: Custom parties CSV path (default: files/parties.csv)
- `--candidates-file PATH`: Custom candidates CSV path (default: files/candidates.csv)
- `--clear`: Clear existing data before import

## Data Integrity

### Validations:
- ✅ Unique candidate numbers per election
- ✅ All candidates linked to valid parties
- ✅ All parties linked to valid election
- ✅ UTF-8 encoding for Arabic names
- ✅ Database constraints enforced

### Indexes:
- Election + candidate number (unique)
- Election + is_active
- Candidate name
- Party name

## Usage Examples

### Import new data:
```bash
python manage.py import_parties_candidates
```

### Import for specific election:
```bash
python manage.py import_parties_candidates --election-id 1
```

### Clear and re-import:
```bash
python manage.py import_parties_candidates --clear
```

### Generate CSV files:
```bash
python manage.py create_party_candidate_csv
```

## Files Location

- **CSV Files:** `backend/files/`
- **Management Commands:** `backend/apps/candidates/management/commands/`
- **Models:** `backend/apps/candidates/models.py`

## Notes

- Existing data was cleared before import to ensure clean state
- All candidates are active by default (`is_active=True`)
- Parties assigned default colors (Red for الإئتلاف, Blue for التغيير)
- Transaction-based import ensures data consistency
- Arabic text properly encoded in UTF-8

---

**Status:** ✅ Import completed successfully
**Next Steps:** Candidates and parties are ready for voting system integration

