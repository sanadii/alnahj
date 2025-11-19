# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- [List your prerequisites here]
  - Node.js (v18+)
  - Package manager (npm/yarn)
  - Database (PostgreSQL, MySQL, etc.)
  - Git

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-name>
```

### 2. Install Dependencies

**Backend**:
```bash
cd backend
# Install backend dependencies
npm install
# or
pip install -r requirements.txt
```

**Frontend**:
```bash
cd frontend
npm install
```

### 3. Configure Environment

Create `.env` file:
```bash
cp .env.example .env
```

Update with your settings:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# API
API_URL=http://localhost:8000

# Authentication
JWT_SECRET=your-secret-key

# Other configuration
NODE_ENV=development
```

### 4. Setup Database

```bash
# Run migrations
npm run migrate
# or
python manage.py migrate

# Seed initial data (optional)
npm run seed
```

### 5. Start Development Servers

**Backend**:
```bash
npm run dev
# or
python manage.py runserver
```

**Frontend** (in another terminal):
```bash
cd frontend
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs (if available)

## Default Credentials

```
Email: admin@example.com
Password: admin123
```

**⚠️ Change these in production!**

## Verify Installation

Run tests to verify everything works:

```bash
# Backend tests
npm test
# or
pytest

# Frontend tests
cd frontend
npm test
```

## Next Steps

1. ✅ Installation complete? Read [Project Overview](01-PROJECT-OVERVIEW.md)
2. ✅ Understand the architecture? Check [Core Documentation](core/)
3. ✅ Ready to develop? See [Commands Reference](03-COMMANDS.md)
4. ✅ Want to contribute? Read [Documentation Placement Guide](DOCUMENTATION-PLACEMENT-GUIDE.md)

## Common Issues

### Port Already in Use
```bash
# Change port in .env file or kill process
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:8000 | xargs kill -9  # Backend
```

### Database Connection Failed
- Verify database is running
- Check credentials in `.env`
- Ensure database exists

### Dependencies Installation Failed
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# or for Python
pip install --upgrade pip
pip install -r requirements.txt
```

## Need Help?

- Check [Installation Guide](02-INSTALLATION.md) for detailed steps
- Review [Commands Reference](03-COMMANDS.md)
- Read [Project Overview](01-PROJECT-OVERVIEW.md)

---

**You're ready to go! Happy coding! 🚀**
