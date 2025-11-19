# Core Documentation

This directory contains the core documentation organized by technical concern.

## Structure

```
core/
├── frontend/       # Frontend architecture and patterns
├── backend/        # Backend architecture and API
├── app/            # Application features and modules
├── database/       # Database schema and migrations
├── security/       # Security and authentication
└── testing/        # Testing strategies and practices
```

## Navigation

### [Frontend](frontend/)
Frontend architecture, component patterns, and state management
- Architecture overview
- Component guidelines
- State management
- Routing
- Styling
- Performance

### [Backend](backend/)
Backend architecture, API design, and business logic
- Architecture overview
- API design
- Business logic
- Data validation
- Error handling
- Performance

### [App](app/)
Application features and modules documentation
- User Management
- [Your features]
- Feature implementation guides
- Module documentation

### [Database](database/)
Database schema, migrations, and query optimization
- Schema design
- Migrations
- Query optimization
- Indexing
- Backups

### [Security](security/)
Security practices, authentication, and authorization
- Authentication
- Authorization
- Security best practices
- OWASP compliance
- Security testing

### [Testing](testing/)
Testing strategies, test cases, and quality assurance
- Testing strategy
- Unit testing
- Integration testing
- E2E testing
- Test coverage

## Using This Documentation

### For New Features
1. Check `app/` for similar features
2. Review `frontend/` and `backend/` patterns
3. Check `database/` for schema guidelines
4. Review `security/` for security requirements
5. Add tests following `testing/` guidelines

### For Architecture Changes
1. Document in relevant `core/` subdirectory
2. Update affected feature docs in `app/`
3. Update `database/` if schema changes
4. Update `security/` if security implications
5. Update tests in `testing/`

### For Learning
1. Start with [Frontend](frontend/) or [Backend](backend/)
2. Review [App](app/) for feature examples
3. Understand [Database](database/) design
4. Learn [Security](security/) practices
5. Follow [Testing](testing/) standards

## Documentation Standards

### What to Document
- ✅ Architecture decisions
- ✅ Design patterns
- ✅ Common workflows
- ✅ Best practices
- ✅ Examples
- ✅ Edge cases

### How to Document
- Clear and concise
- Code examples
- Diagrams when helpful
- Links to related docs
- Keep up-to-date

### Where to Document
- **Architecture**: `frontend/` or `backend/`
- **Features**: `app/`
- **Database**: `database/`
- **Security**: `security/`
- **Testing**: `testing/`

## Related Documentation

- [Project Overview](../01-PROJECT-OVERVIEW.md)
- [Quick Start](../00-QUICK-START.md)
- [Documentation Placement Guide](../DOCUMENTATION-PLACEMENT-GUIDE.md)

---

**Remember**: Keep documentation close to what it documents!

**Last Updated**: October 24, 2025

