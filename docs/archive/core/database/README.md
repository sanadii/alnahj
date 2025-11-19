# Database Documentation

Database schema, migrations, and optimization strategies.

## Overview

Database design following best practices for performance, security, and scalability.

## Contents

- [Schema](schema.md) - Database schema and tables
- [Migrations](migrations.md) - Migration management
- [Queries](queries.md) - Query optimization
- [Indexing](indexing.md) - Index strategies
- [Backups](backups.md) - Backup and recovery

## Database

**Type**: [PostgreSQL/MySQL/MongoDB]  
**Version**: [Version]

## Schema Overview

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar VARCHAR(500),
  role VARCHAR(20) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
```

## Migrations

### Running Migrations

```bash
# Create new migration
npm run migrate:create migration_name

# Run migrations
npm run migrate

# Rollback migration
npm run migrate:rollback

# Check status
npm run migrate:status
```

### Migration Best Practices

- ✅ Always test migrations locally first
- ✅ Make migrations reversible
- ✅ Keep migrations small and focused
- ✅ Back up data before running
- ✅ Document breaking changes

## Query Optimization

### N+1 Query Prevention

```sql
-- ❌ BAD: N+1 queries
SELECT * FROM users;
-- Then for each user:
SELECT * FROM posts WHERE user_id = ?;

-- ✅ GOOD: Single query with JOIN
SELECT users.*, posts.*
FROM users
LEFT JOIN posts ON users.id = posts.user_id;
```

### Indexing

```sql
-- Create index on frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role WHERE role = 'admin');

-- Composite index for common filter combinations
CREATE INDEX idx_users_role_created ON users(role, created_at);
```

## Performance

### Query Performance

- ✅ Use indexes on foreign keys
- ✅ Use EXPLAIN to analyze queries
- ✅ Avoid SELECT *
- ✅ Use pagination for large datasets
- ✅ Cache frequently accessed data

### Connection Pooling

```typescript
const pool = {
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000
};
```

## Backups

### Automated Backups

```bash
# Daily backup script
pg_dump dbname > backup_$(date +%Y%m%d).sql

# Restore from backup
psql dbname < backup_20241024.sql
```

### Backup Strategy

- **Daily**: Full database backup
- **Hourly**: Transaction log backup
- **Retention**: 30 days
- **Storage**: Cloud storage with encryption

## Security

### Connection Security

```env
DATABASE_URL=postgresql://user:password@localhost:5432/db?sslmode=require
```

### Best Practices

- ✅ Use SSL/TLS connections
- ✅ Strong database passwords
- ✅ Principle of least privilege
- ✅ Regular security audits
- ✅ Encrypt sensitive data

## Related Documentation

- [Backend Architecture](../backend/)
- [Security](../security/)
- [User Management](../app/users/)

---

**Last Updated**: October 24, 2025

