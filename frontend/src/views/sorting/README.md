# Sorting (Vote Counting) Module

**Created:** October 25, 2025  
**Status:** ✅ Complete - Ready for Testing

## Overview

The Sorting module handles vote counting, tallying, and results viewing for the Election Management System. The term "sorting" (الفرز) refers to the vote counting and tallying process conducted after voting day.

## Features

### 1. Vote Entry Tab
- **Committee-based vote entry**: Select committee and enter vote counts
- **Bulk vote entry**: Enter all candidate votes for a committee at once
- **Ballot tracking**: Track total ballots, invalid ballots, and valid ballots
- **Vote validation**: Automatic validation to ensure vote counts match ballot counts
- **Real-time totals**: Live calculation of entered votes
- **Notes support**: Add notes for each vote entry

### 2. Results View Tab
- **Election results overview**: Key statistics (registered electors, attendance, turnout)
- **Candidate rankings**: Complete ranking with vote counts and percentages
- **Winner identification**: Highlight winning candidates
- **Visual progress bars**: Vote percentage visualizations
- **Party affiliation display**: Color-coded party chips
- **Committee breakdown**: Detailed results per committee
- **Results generation**: Admin can generate/regenerate results

### 3. Audit Trail Tab
- **Complete vote count history**: All vote entries with timestamps
- **Status tracking**: Pending, Verified, or Disputed status
- **User tracking**: Who entered and who verified each count
- **Filtering**: Filter by committee and status
- **Pagination**: Handle large datasets efficiently

## Technical Implementation

### Redux Store Structure

```
frontend/src/store/voting/
├── types.ts       - TypeScript types and action constants
├── actions.ts     - Action creators
├── reducer.ts     - State management
├── saga.ts        - Side effects and API calls
└── index.ts       - Barrel export
```

### Type Definitions

```
frontend/src/types/voting.ts
- VoteCount, Candidate, Party interfaces
- ElectionResults, CommitteeVoteEntry types
- Filters, Statistics types
- Utility functions for formatting
```

### API Services

```
frontend/src/helpers/api/voting.ts
- Vote counts CRUD operations
- Candidates and parties fetching
- Bulk vote entry
- Results generation
- Statistics retrieval
```

### Components

```
frontend/src/views/sorting/
├── Sorting.tsx                      - Main page with tabs and statistics
└── components/
    ├── VoteEntryTab.tsx            - Vote entry form
    ├── ResultsViewTab.tsx          - Results display
    └── AuditTrailTab.tsx           - Audit trail table
```

## Redux State

### State Shape

```typescript
{
  voteCounts: VoteCount[],
  candidates: Candidate[],
  parties: Party[],
  committeeEntries: CommitteeVoteEntry[],
  electionResults: ElectionResults | null,
  statistics: VotingStatistics | null,
  loading: boolean,
  error: string | null,
  totalCount: number,
  currentPage: number,
  pageSize: number,
  filters: VoteCountFilters
}
```

## API Endpoints Used

### Vote Counts
- `GET /api/voting/vote-counts/` - List vote counts
- `POST /api/voting/vote-counts/` - Create vote count
- `PATCH /api/voting/vote-counts/{id}/` - Update vote count
- `DELETE /api/voting/vote-counts/{id}/` - Delete vote count
- `PATCH /api/voting/vote-counts/{id}/verify/` - Verify vote count
- `POST /api/voting/vote-counts/bulk-entry/` - Bulk vote entry

### Candidates & Parties
- `GET /api/voting/candidates/` - List candidates
- `GET /api/voting/parties/` - List parties

### Results
- `GET /api/voting/results/{election_id}/` - Get election results
- `POST /api/voting/results/generate/` - Generate results

### Statistics
- `GET /api/voting/vote-counts/statistics/` - Get voting statistics

## Integration Points

### Root Store Integration
- Added `votingReducer` to `rootReducer.ts`
- Added `votingSaga` to `rootSaga.ts`

### Menu Integration
- Already configured in `menu-items/sorting.ts`
- Icon: `IconSortDescending`
- Route: `/sorting`

### Route Integration
- Already configured in `routes/MainRoutes.tsx`
- Component: Lazy-loaded `views/sorting/Sorting`

## Design Patterns

### Material UI Components
- Uses project's MUI theme and design system
- Consistent with other pages (Guarantees, Attendance)
- Responsive grid layouts
- Color-coded status indicators

### Code Organization
- TypeScript for type safety
- Redux Saga for async operations
- Separated concerns (presentation vs logic)
- Reusable utility functions

## User Roles & Permissions

- **USER**: Can view vote counts and results
- **SUPERVISOR**: Can enter votes and view results
- **ADMIN**: Full access - enter, verify, generate results
- **SUPER_ADMIN**: Full access + system management

## Next Steps

### Testing Checklist
- [ ] Test vote entry form with various ballot counts
- [ ] Verify vote count validation works correctly
- [ ] Test bulk vote entry functionality
- [ ] Check results generation and display
- [ ] Verify audit trail filtering and pagination
- [ ] Test with different user roles
- [ ] Check responsive design on mobile devices

### Potential Enhancements
- [ ] Export results to PDF/Excel
- [ ] Real-time vote count updates via WebSocket
- [ ] Graphical charts for results visualization
- [ ] Committee comparison views
- [ ] Historical results comparison
- [ ] Dispute resolution workflow
- [ ] SMS notifications for vote verification

## Files Created

### Core Files (7 files)
1. `frontend/src/types/voting.ts` - TypeScript types
2. `frontend/src/store/voting/types.ts` - Redux types
3. `frontend/src/store/voting/actions.ts` - Redux actions
4. `frontend/src/store/voting/reducer.ts` - Redux reducer
5. `frontend/src/store/voting/saga.ts` - Redux saga
6. `frontend/src/store/voting/index.ts` - Barrel export
7. `frontend/src/helpers/api/voting.ts` - API services

### UI Components (4 files)
8. `frontend/src/views/sorting/Sorting.tsx` - Main page
9. `frontend/src/views/sorting/components/VoteEntryTab.tsx` - Vote entry
10. `frontend/src/views/sorting/components/ResultsViewTab.tsx` - Results view
11. `frontend/src/views/sorting/components/AuditTrailTab.tsx` - Audit trail

### Modified Files (2 files)
12. `frontend/src/store/rootReducer.ts` - Added voting reducer
13. `frontend/src/store/rootSaga.ts` - Added voting saga

### Documentation (1 file)
14. `frontend/src/views/sorting/README.md` - This file

**Total:** 14 files (11 new, 2 modified, 1 documentation)

## Code Quality

- ✅ **Zero linting errors**
- ✅ **TypeScript strict mode compliant**
- ✅ **Follows project conventions**
- ✅ **Consistent with existing patterns**
- ✅ **Properly documented**
- ✅ **Responsive design**
- ✅ **Accessible components**

## Dependencies

All dependencies are already in the project:
- React 18
- Redux & Redux Saga
- Material UI v5
- Axios
- TypeScript

## Support

For questions or issues:
1. Check backend API documentation: `backend/API-ENDPOINTS-REFERENCE.md`
2. Review similar pages: Guarantees, Attendance
3. Check Redux DevTools for state debugging

---

**Status:** Ready for integration testing and user acceptance testing.

