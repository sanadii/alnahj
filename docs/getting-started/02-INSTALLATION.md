# Installation Guide

Detailed installation and setup instructions.

## Prerequisites

Before starting, ensure you have:

### Required
- **Node.js** (v18 or higher)
- **Package Manager**: npm or yarn
- **Database**: PostgreSQL 14+ (or your database)
- **Git**: For version control

### Optional
- **Docker**: For containerized development
- **IDE**: VS Code, WebStorm, or similar
- **Postman/Insomnia**: For API testing

### Verify Prerequisites

```bash
# Node.js
node --version  # Should be v18+

# npm
npm --version

# PostgreSQL
psql --version  # Should be 14+

# Git
git --version

# Docker (optional)
docker --version
```

## Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd <project-name>
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
# or
pip install -r requirements.txt
# or
go mod download
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Database Setup

#### Create Database

```bash
# PostgreSQL
createdb projectname_dev

# Or using psql
psql -U postgres
CREATE DATABASE projectname_dev;
```

#### Configure Connection

Create `.env` file in backend directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/projectname_dev

# Or individual values
DB_HOST=localhost
DB_PORT=5432
DB_NAME=projectname_dev
DB_USER=your_username
DB_PASSWORD=your_password
```

#### Run Migrations

```bash
cd backend
npm run migrate
# or
python manage.py migrate
# or
migrate -path migrations -database $DATABASE_URL up
```

### 4. Environment Configuration

#### Backend `.env`

```env
# Server
PORT=8000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/projectname_dev

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email (optional for development)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@example.com

# Other
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

#### Frontend `.env`

```env
# API
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Environment
NODE_ENV=development

# Other
VITE_APP_NAME=Your App Name
```

### 5. Seed Database (Optional)

```bash
npm run seed
# or
python manage.py seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Test users
- Sample data

### 6. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server running on http://localhost:8000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App running on http://localhost:3000
```

## Docker Installation (Alternative)

### Using Docker Compose

```bash
# Copy environment file
cp .env.example .env

# Start all services
docker-compose up

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Database: localhost:5432

## Verification

### Test Backend

```bash
# Health check
curl http://localhost:8000/api/health

# Expected response
{"status":"ok","timestamp":"2024-10-24T..."}
```

### Test Frontend

1. Open browser to http://localhost:3000
2. You should see the app homepage
3. Try navigating to login page

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## IDE Setup

### VS Code

Install recommended extensions:
- ESLint
- Prettier
- TypeScript
- GitLens
- REST Client

Copy workspace settings:
```bash
cp .vscode/settings.example.json .vscode/settings.json
```

### WebStorm

1. Open project
2. Trust project
3. Enable ESLint
4. Enable Prettier
5. Set Node interpreter

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # Frontend
lsof -i :8000  # Backend

# Kill process
kill -9 <PID>

# Or change port in .env
```

### Database Connection Failed

**Check database is running**:
```bash
# PostgreSQL
pg_isready

# Start if not running
brew services start postgresql  # macOS
sudo service postgresql start   # Linux
```

**Check credentials**:
- Verify DATABASE_URL in `.env`
- Test connection with psql
- Check database exists

### Dependencies Installation Failed

**Clear cache**:
```bash
# npm
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Python
pip cache purge
pip install -r requirements.txt --no-cache-dir
```

**Check Node version**:
```bash
node --version  # Should be v18+
nvm use 18      # If using nvm
```

### Migrations Failed

```bash
# Reset database (⚠️ DESTRUCTIVE)
dropdb projectname_dev
createdb projectname_dev

# Run migrations again
npm run migrate
```

### Permission Errors

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Fix file permissions
chmod -R 755 .
```

## Platform-Specific Instructions

### macOS

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@14
brew services start postgresql@14

# Install Node.js
brew install node@18
```

### Windows

```bash
# Using Chocolatey
choco install nodejs-lts
choco install postgresql14

# Or download installers:
# - Node.js: https://nodejs.org
# - PostgreSQL: https://www.postgresql.org/download/windows/
```

### Linux (Ubuntu/Debian)

```bash
# Update packages
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Next Steps

After installation:

1. ✅ Read [Quick Start Guide](00-QUICK-START.md)
2. ✅ Review [Project Overview](01-PROJECT-OVERVIEW.md)
3. ✅ Check [Commands Reference](03-COMMANDS.md)
4. ✅ Explore [Core Documentation](core/)

## Getting Help

If you encounter issues:

1. Check this guide thoroughly
2. Review [Troubleshooting](#troubleshooting) section
3. Check project documentation
4. Search existing issues on GitHub
5. Create new issue with:
   - OS and versions
   - Error messages
   - Steps to reproduce

---

**Last Updated**: October 24, 2025

**Tested On**:
- macOS Sonoma 14.x
- Ubuntu 22.04 LTS
- Windows 11
