# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **camelCase API Convention** (2025-10-28)
  - Automatic camelCase ↔ snake_case conversion using `djangorestframework-camel-case`
  - JavaScript-friendly API for frontend integration
  - Comprehensive API conventions documentation
  - TypeScript interfaces match API responses exactly
  - See [CAMELCASE-API-IMPLEMENTATION.md](CAMELCASE-API-IMPLEMENTATION.md) for details
- **Material UI Delete Confirmation Dialog** (2025-10-28)
  - Replaced browser `window.confirm` with proper MUI Dialog
  - Better UX with warning alert and styled buttons
  - Shows loading state during deletion
  - Prevents accidental deletions
- Password reset functionality (in progress)
- Email verification (in progress)
- Integration tests

### Changed
- **API Response Format** (2025-10-28)
  - All API responses now use camelCase field names
  - Backend serializers continue using snake_case (no changes required)
  - Automatic conversion handled by Django middleware
- **TypeScript Type Definitions** (2025-10-28)
  - Updated `Party` and `Candidate` interfaces to use camelCase
  - Consistent with camelCase API convention throughout frontend
  - Better type safety and IntelliSense support
- Improved error messages
- Updated dependencies

### Documentation
- **Added** [API Conventions & Standards Guide](architecture/backend/02-API-CONVENTIONS.md) (2025-10-28)
  - Complete camelCase conversion documentation
  - Request/response examples
  - Best practices and troubleshooting
- **Updated** Backend Overview with API naming conventions
- **Updated** Documentation Index with API conventions references

### Fixed
- Login performance issues
- Election edit dialog now properly saves data to backend (camelCase compatibility)
- **API Endpoint Correction** (2025-10-28)
  - Fixed parties/candidates endpoint from `/api/voting/parties` to `/api/candidates/parties`
  - Updated API documentation to reflect correct endpoints
  - Frontend now uses correct endpoints matching backend implementation
- **Dialog and Store Updates** (2025-10-28)
  - Fixed PartyFormDialog not closing after successful party creation
  - Response normalizer now properly sets `success` field for backwards compatibility
  - Store properly updates with new parties after creation
- **Party CRUD Operations** (2025-10-28)
  - Fixed "property 'candidate_count' of 'Party' object has no setter" error
  - Annotated fields now excluded from delete, update, and retrieve operations
  - Fixed "Failed to load party" error when editing parties
  - All party CRUD operations (Create, Read, Update, Delete) now work correctly
- **Candidates Tab Display** (2025-10-28)
  - Fixed incorrect field mappings (`fullName` → `electorName`, `party.name` → `partyName`)
  - Updated Candidate TypeScript interface to match backend API response
  - Added KOC ID column to candidates table
  - Party names now display with correct colors
  - Independent candidates show "Independent" badge
  - Status now correctly shows "Active"/"Inactive" instead of undefined field
- **Add Candidate Dialog** (2025-10-28)
  - Fixed empty Party dropdown - now shows all available parties
  - Added color indicators next to each party name
  - Added "Independent (No Party)" option
  - Improved placeholders and helper text
  - Parties display with visual color swatches
- **Complete Candidate CRUD Redux Implementation** (2025-10-28)
  - Added CREATE, UPDATE, DELETE action types for candidates
  - Implemented candidate saga handlers (create, update, delete)
  - Added candidate API functions (createCandidate, updateCandidate, deleteCandidate)
  - Updated reducer to handle all candidate operations
  - Integrated form state and dispatch in CurrentElection component
  - Full Redux flow: Actions → Saga → API → Reducer → UI
  - Add candidate functionality now fully operational
- **Fixed Candidate Creation Issues** (2025-10-28)
  - Fixed elector field to accept KOC ID instead of name
  - Changed "Full Name" field to "Elector KOC ID" with proper validation
  - Removed Biography field, added Party Affiliation field
  - Saga now dispatches election refresh after candidate creation (not component)
  - Eliminated unnecessary `/api/elections/current/` calls from component
  - Form properly sends backend-compatible data structure
- **Improved Elector Selection with Autocomplete** (2025-10-28)
  - Replaced text input with searchable Autocomplete dropdown
  - Users can now search electors by KOC ID or name
  - Displays elector details (KOC ID, full name, committee, section)
  - Loads only active electors from the system
  - Shows loading indicator while fetching electors
  - Prevents errors from entering non-existent KOC IDs
  - Better UX: Select from existing electors instead of typing manually

## [0.1.0] - 2024-10-24

### Added
- Initial project setup
- User registration
- User authentication (JWT)
- User login/logout
- User profile viewing
- Basic security measures
- Project documentation
- Development environment setup
- CI/CD pipeline
- Unit tests

### Security
- Password hashing with bcrypt
- JWT token authentication
- Input validation
- SQL injection prevention
- XSS protection

## Version History

### [0.1.0] - 2024-10-24 - Initial Release
**Foundation**
- Project structure established
- Core authentication implemented
- Documentation created
- Development workflow defined

---

## Change Categories

### Added
New features or functionality

### Changed
Changes to existing functionality

### Deprecated
Features that will be removed in future versions

### Removed
Features that have been removed

### Fixed
Bug fixes

### Security
Security improvements or fixes

---

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag: `git tag -a v0.1.0 -m "Release v0.1.0"`
4. Push tag: `git push origin v0.1.0`
5. Create GitHub release
6. Deploy to production

---

**Last Updated**: October 28, 2025
