# Quick Start: Phase 3 - Guarantee System

**Test the guarantee collection system in 10 minutes!**

---

## 📋 Prerequisites

Make sure Phase 1 & 2 are setup:
- ✅ Backend running
- ✅ User authenticated
- ✅ Electors imported

---

## 🚀 Quick Test (5 minutes)

### Step 1: Run Migrations

```powershell
cd backend
python manage.py makemigrations guarantees
python manage.py migrate
```

### Step 2: Login

```http
POST http://localhost:8000/api/auth/login/
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "your_password"
}
```

Copy the `access` token.

### Step 3: Create Custom Groups

```http
POST http://localhost:8000/api/guarantees/groups/
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "name": "Close Friends",
    "color": "#FF5722",
    "description": "People I know very well",
    "order": 1
}
```

```http
POST http://localhost:8000/api/guarantees/groups/
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "name": "Family",
    "color": "#4CAF50",
    "order": 2
}
```

### Step 4: Search for Elector

```http
GET http://localhost:8000/api/guarantees/search-elector/?query=khalifah
Authorization: Bearer <your_token>
```

Pick an elector from the results.

### Step 5: Add Guarantee

```http
POST http://localhost:8000/api/guarantees/
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "elector": "84698",
    "status": "STRONG",
    "group": 1,
    "quick_note": "University friend, very reliable"
}
```

### Step 6: Add Note

```http
POST http://localhost:8000/api/guarantees/{id}/add-note/
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "content": "Called today. Confirmed attendance. Will bring 3 friends.",
    "is_important": true
}
```

### Step 7: View Statistics

```http
GET http://localhost:8000/api/guarantees/statistics/
Authorization: Bearer <your_token>
```

---

## ✨ Advanced Features (5 minutes)

### Bulk Update

Add more guarantees, then:

```http
POST http://localhost:8000/api/guarantees/bulk-update/
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "guarantee_ids": [1, 2, 3, 4],
    "status": "STRONG",
    "group_id": 1
}
```

### Schedule Follow-up

```http
PUT http://localhost:8000/api/guarantees/{id}/
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "follow_up_required": true,
    "follow_up_date": "2025-11-15"
}
```

### Get Follow-ups

```http
GET http://localhost:8000/api/guarantees/follow-ups/
Authorization: Bearer <your_token>
```

### View History

```http
GET http://localhost:8000/api/guarantees/{id}/history/
Authorization: Bearer <your_token>
```

### Team Dashboard (Supervisor/Admin)

```http
GET http://localhost:8000/api/guarantees/team/statistics/
Authorization: Bearer <your_token>
```

---

## 📊 What to Verify

### ✅ Checklist

- [ ] Can create custom groups
- [ ] Can search electors (excludes duplicates)
- [ ] Can add guarantee
- [ ] Cannot add duplicate guarantee
- [ ] Can update status (quick update works)
- [ ] Can assign to group
- [ ] Can add notes
- [ ] Can schedule follow-up
- [ ] Follow-up list shows pending
- [ ] Statistics show correct counts
- [ ] History shows all actions
- [ ] Bulk update works
- [ ] Team dashboard (supervisor/admin)

---

## 🎨 Expected Results

### Personal Statistics
```json
{
    "total_guarantees": 5,
    "strong_count": 3,
    "medium_count": 1,
    "weak_count": 1,
    "by_group": [
        {
            "group__name": "Close Friends",
            "group__color": "#FF5722",
            "count": 3
        }
    ],
    "by_committee": [...],
    "follow_ups_pending": 1,
    "follow_ups_overdue": 0
}
```

### Guarantee History
```json
[
    {
        "action": "CREATED",
        "user_name": "Admin User",
        "description": "Created guarantee from Khalifah Al-Loughani",
        "created_at": "2025-10-24T10:00:00Z"
    },
    {
        "action": "STATUS_CHANGED",
        "user_name": "Admin User",
        "description": "Status changed from MEDIUM to STRONG",
        "created_at": "2025-10-24T10:05:00Z"
    },
    {
        "action": "NOTE_ADDED",
        "user_name": "Admin User",
        "description": "Added note",
        "created_at": "2025-10-24T10:10:00Z"
    }
]
```

---

## 🐛 Troubleshooting

### Cannot Add Guarantee: "Already exists"

**Problem**: Trying to add same elector twice.

**Solution**: Each elector can only be added once per user. Search for different elector.

### Group Validation Error

**Problem**: Trying to assign guarantee to someone else's group.

**Solution**: Only use your own groups. Create new group if needed.

### Empty Search Results

**Problem**: Search elector returns empty.

**Solution**: 
- Make sure electors are imported
- Try different search term
- Check if already in your list (excluded from search)

---

## 📱 Test Scenarios

### Scenario 1: Personal Organization

1. Create 3-5 groups with different colors
2. Add 10-20 guarantees
3. Assign them to different groups
4. Change some statuses to Strong/Medium/Weak
5. View statistics - see distribution

### Scenario 2: Follow-up Management

1. Add several guarantees
2. Mark some for follow-up with dates
3. View follow-up list
4. Set some dates in the past (overdue)
5. Get overdue list
6. Update after "contact"

### Scenario 3: Team Monitoring (Supervisor)

1. Create a supervisor user
2. Assign regular users to supervisor
3. Regular users add guarantees
4. Supervisor views team statistics
5. Compare team member performance

### Scenario 4: Notes & History

1. Add guarantee
2. Add multiple notes
3. Change status several times
4. Move between groups
5. View complete history
6. Verify all actions logged

---

## 🎯 Success Criteria

If all of these work, Phase 3 is successfully setup:

- ✅ Can create and manage groups
- ✅ Can add guarantees
- ✅ Duplicate prevention works
- ✅ Status tracking works
- ✅ Notes system works
- ✅ History logging works
- ✅ Follow-up system works
- ✅ Search & filter works
- ✅ Bulk operations work
- ✅ Statistics accurate
- ✅ Team dashboard (supervisor)

---

## 🎉 Next Steps

Once Phase 3 is tested:

1. **Use the system** - Add real guarantees
2. **Test with team** - Multiple users
3. **Collect feedback** - UI/UX improvements
4. **Move to Phase 4** - Reports & Analytics

---

## 📚 Documentation

- **Full API Docs**: `backend/apps/guarantees/README.md`
- **Phase 3 Summary**: `backend/PHASE-3-SUMMARY.md`
- **Implementation Plan**: `docs/project/backend-implementation-plan.md`

---

**Ready to test!** 🚀

**Document Version**: 1.0  
**Last Updated**: October 2025

