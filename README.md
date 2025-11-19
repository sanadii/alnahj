# RioWorkspace - Enterprise Management Platform

RioWorkspace is a comprehensive enterprise management platform built with Django REST API backend and React TypeScript frontend. It provides a modular architecture for building various business applications including CRM, HR, Finance, Inventory, and more.

## ⚡ Quick Start - One-Command Demo Setup

**Get started with complete demo data in 30 seconds!**

### Windows PowerShell (Recommended)
```powershell
.\backend\demo\setup_demo.ps1
```

### Other Platforms
- **Windows CMD**: `backend\demo\setup_demo.bat`
- **Mac/Linux**: `bash backend/demo/setup_demo.sh`
- **Python**: `python backend/demo/setup_demo.py`

**What you get**: 489+ demo records across 16 modules (Clients, Appointments, Invoices, Services, Products, Campaigns, Leads, Deals, Projects, and more!)

📚 **Full Demo Guide**: See [`docs/05-DEMO-SETUP.md`](docs/05-DEMO-SETUP.md) or [`backend/demo/README.md`](backend/demo/README.md)

---

## 🚀 Features

### Core Platform
- **Modular Architecture**: Scalable Django apps structure
- **RESTful API**: Django REST Framework with JWT authentication
- **Modern Frontend**: React 18 with TypeScript and Bootstrap 5
- **Real-time Communication**: WebSocket support with Django Channels
- **Multi-language Support**: i18n internationalization
- **Responsive Design**: Mobile-first approach

### Business Applications
- **Website & eCommerce**: Website builder, eCommerce, Blog, Forum, eLearning, Live Chat
- **Sales & CRM**: CRM, Sales management, Point of Sale, Subscriptions, Rental
- **Finance**: Accounting, Invoicing, Expenses, Documents, Spreadsheets, Digital Signing
- **Inventory & Manufacturing**: Inventory management, Manufacturing, PLM, Purchase, Maintenance, Quality
- **Human Resources**: Employee management, Recruitment, Time Off, Appraisals, Referrals, Fleet
- **Marketing**: Marketing automation, Email/SMS marketing, Social marketing, Events, Surveys
- **Services**: Project management, Timesheet, Field Service, Helpdesk, Planning, Appointments
- **Productivity**: Discussion forums, Approvals, IoT integration, VOIP, Knowledge base

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 4.2.3
- **API**: Django REST Framework 3.14.0
- **Authentication**: JWT with SimpleJWT
- **Database**: SQLite (development), PostgreSQL/MySQL (production ready)
- **WebSockets**: Django Channels
- **CORS**: django-cors-headers

### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript 5.3.3
- **UI Library**: Bootstrap 5.3.2, Reactstrap
- **State Management**: Redux Toolkit, Redux Saga
- **Routing**: React Router DOM 6.20.1
- **HTTP Client**: Axios
- **Charts**: ApexCharts, Chart.js, ECharts
- **Tables**: React Table, GridJS
- **Forms**: Formik, Yup validation
- **Calendar**: FullCalendar
- **File Upload**: FilePond, React Dropzone

## 📋 Prerequisites

- **Python**: 3.8+ (3.12 recommended)
- **Node.js**: 16+ (18+ recommended)
- **Yarn**: Latest version
- **Git**: Latest version

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd RioWorkspace
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
.\venv\Scripts\Activate.ps1
# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
yarn install

# Start development server
yarn start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 📁 Project Structure

```
RioWorkspace/
├── backend/                 # Django backend
│   ├── apps/               # Django applications
│   │   ├── account/        # User authentication
│   │   ├── workspace/      # Core workspace functionality
│   │   ├── projects/       # Project management
│   │   ├── bookings/       # Booking system
│   │   └── utils/          # Utility functions
│   ├── core/               # Django settings
│   ├── settings/           # Additional settings
│   ├── utils/              # Backend utilities
│   ├── utilities/          # Utility modules
│   ├── account/            # Account management
│   ├── manage.py           # Django management
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Virtual environment
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/            # API integration layer
│   │   ├── assets/         # Static assets
│   │   ├── contexts/       # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layout/         # Layout components
│   │   ├── menu-items/     # Menu configuration
│   │   ├── routes/         # Routing configuration
│   │   ├── store/          # Redux state management
│   │   ├── ui-component/   # Reusable UI components
│   │   ├── utils/          # Utility functions
│   │   ├── views/          # Page components and views
│   │   ├── types/          # TypeScript types
│   │   └── themes/         # Theme configuration
│   ├── public/             # Public assets
│   ├── package.json        # Node.js dependencies
│   └── tsconfig.json       # TypeScript configuration
├── docker/                 # Docker configuration
├── drawio/                 # Architecture diagrams
├── .vscode/                # VS Code settings
├── start.ps1               # PowerShell startup script
└── README.md               # Project documentation
```

## 🔧 Development

### Backend Development
```bash
cd backend
.\venv\Scripts\Activate.ps1

# Run tests
python manage.py test

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### Frontend Development
```bash
cd frontend

# Start development server
yarn start

# Build for production
yarn build

# Run tests
yarn test

# Lint code
yarn lint
```

### Database Management
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database (development only)
python manage.py flush

# Create superuser
python manage.py createsuperuser
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key

# Database (for production)
DATABASE_URL=postgresql://user:password@localhost:5432/rioworkspace

# Email (for production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
```

## 🚀 Deployment

### Production Setup
1. Set `DEBUG=False` in settings
2. Configure production database (PostgreSQL/MySQL)
3. Set up static file serving
4. Configure email settings
5. Set up SSL/HTTPS
6. Configure caching (Redis)
7. Set up monitoring (Sentry)

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📊 API Documentation

The API documentation is available at:
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
yarn test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📚 Documentation

- **[FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)** - Detailed frontend architecture and component structure
- **[PROJECT_STRUCTUE.md](./PROJECT_STRUCTUE.md)** - Backend/API structure and endpoints
- **[PROJECT_REVIEW.md](./PROJECT_REVIEW.md)** - Best practices and improvement recommendations
- **[TODO.md](./TODO.md)** - All actionable tasks and progress tracking
- **[FixingReduxApproach.md](./FixingReduxApproach.md)** - Redux async/API integration patterns
- **[AuthConsolidation.md](./AuthConsolidation.md)** - Authentication state management

## 🔄 Version History

- **v3.5.0**: Current version with comprehensive business modules
- **v3.0.0**: Major refactor with TypeScript and modern React patterns
- **v2.0.0**: Django REST API implementation
- **v1.0.0**: Initial release

---

**Built with ❤️ by the RioWorkspace Team**
