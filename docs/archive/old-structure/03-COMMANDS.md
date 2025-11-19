# Commands Reference

Common commands for development, testing, and deployment.

## Development Commands

### Backend

```bash
# Start development server
npm run dev
# or
python manage.py runserver
# or
go run main.go

# Run with hot reload
npm run dev:watch

# Check for issues
npm run check
# or
python manage.py check
```

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Full Stack

```bash
# Start both frontend and backend
npm run dev:all

# Start with Docker
docker-compose up

# Start in detached mode
docker-compose up -d
```

## Database Commands

### Migrations

```bash
# Create migration
npm run migrate:create
# or
python manage.py makemigrations
# or
migrate create -ext sql -dir migrations migration_name

# Run migrations
npm run migrate
# or
python manage.py migrate
# or
migrate -path migrations -database postgres up

# Rollback migration
npm run migrate:rollback
# or
python manage.py migrate app_name previous_migration
# or
migrate -path migrations -database postgres down 1

# Check migration status
npm run migrate:status
# or
python manage.py showmigrations
```

### Database Operations

```bash
# Reset database (⚠️ DESTRUCTIVE)
npm run db:reset

# Seed database with test data
npm run db:seed

# Backup database
npm run db:backup

# Restore database
npm run db:restore backup.sql
```

## Testing Commands

### Unit Tests

```bash
# Run all tests
npm test
# or
pytest
# or
go test ./...

# Run specific test file
npm test path/to/test.spec.ts
# or
pytest tests/test_file.py

# Run with coverage
npm run test:coverage
# or
pytest --cov
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

### Watch Mode

```bash
# Run tests in watch mode
npm run test:watch
```

## Linting & Formatting

### Linting

```bash
# Lint all code
npm run lint

# Lint and auto-fix
npm run lint:fix

# Lint specific directory
npm run lint -- src/

# Backend linting
python -m pylint app/
# or
golangci-lint run
```

### Formatting

```bash
# Format all code
npm run format

# Check formatting
npm run format:check

# Format specific files
npm run format -- src/**/*.ts
```

### Type Checking

```bash
# TypeScript type check
npm run typecheck

# Python type check
mypy app/

# Go vet
go vet ./...
```

## Build Commands

### Development Build

```bash
# Build for development
npm run build:dev
```

### Production Build

```bash
# Build for production
npm run build

# Build backend
npm run build:backend

# Build frontend
npm run build:frontend
```

### Clean Build

```bash
# Clean build artifacts
npm run clean

# Clean and rebuild
npm run clean && npm run build
```

## Docker Commands

### Development

```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Execute command in container
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Production

```bash
# Build production images
docker build -t app:prod -f Dockerfile.prod .

# Run production container
docker run -p 80:80 app:prod

# Push to registry
docker push registry/app:prod
```

## Deployment Commands

### Deploy to Staging

```bash
# Deploy to staging
npm run deploy:staging

# View staging logs
npm run logs:staging
```

### Deploy to Production

```bash
# Deploy to production (requires confirmation)
npm run deploy:production

# View production logs
npm run logs:production

# Rollback deployment
npm run rollback:production
```

## Utility Commands

### Code Generation

```bash
# Generate new component
npm run generate:component ComponentName

# Generate new API endpoint
npm run generate:api endpoint-name

# Generate migration
npm run generate:migration migration_name
```

### Database Shell

```bash
# Open database shell
npm run db:shell
# or
python manage.py dbshell
# or
psql -U user -d database
```

### Application Shell

```bash
# Open interactive shell
npm run shell
# or
python manage.py shell
# or
node --experimental-repl-await
```

### Logs

```bash
# View application logs
npm run logs

# View backend logs
npm run logs:backend

# View frontend logs
npm run logs:frontend

# Follow logs in real-time
npm run logs -- --follow
```

## Maintenance Commands

### Dependencies

```bash
# Install dependencies
npm install

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Audit for security issues
npm audit

# Fix security issues
npm audit fix
```

### Clean Up

```bash
# Remove node_modules
rm -rf node_modules

# Remove build artifacts
rm -rf dist/ build/ .next/

# Clean everything and reinstall
npm run clean:all && npm install
```

## Environment Management

### Switch Environments

```bash
# Use development environment
export NODE_ENV=development

# Use production environment
export NODE_ENV=production

# Load environment from file
source .env.development
```

### Environment Variables

```bash
# View current environment
npm run env

# Validate environment
npm run env:validate

# Generate .env from example
cp .env.example .env
```

## Git Workflows

### Feature Development

```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "feat: add feature description"

# Push to remote
git push origin feature/feature-name
```

### Pull Request

```bash
# Update branch with main
git fetch origin
git rebase origin/main

# Push updated branch
git push origin feature/feature-name --force-with-lease
```

## Quick Reference

### Most Used Commands

```bash
# Start development
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build

# Deploy
npm run deploy
```

### Troubleshooting

```bash
# Clear cache
npm run clean

# Reset database
npm run db:reset

# Restart services
docker-compose restart

# View logs
npm run logs
```

---

**Pro Tip**: Add these commands to your `package.json` scripts section for easy access!

**Last Updated**: October 24, 2025
