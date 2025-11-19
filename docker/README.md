# RioWorkspace Docker Configuration

This directory contains all Docker-related configuration files for the RioWorkspace project.

## Files Overview

### Core Configuration Files
- **`../Dockerfile.backend`** - Multi-stage Dockerfile for Django backend
- **`../Dockerfile.frontend`** - Multi-stage Dockerfile for React frontend
- **`../docker-compose.yml`** - Production Docker Compose configuration
- **`../docker-compose.dev.yml`** - Development Docker Compose configuration
- **`../.dockerignore`** - Files to exclude from Docker build context

### Nginx Configuration
- **`nginx.conf`** - Nginx configuration for frontend service
- **`nginx-proxy.conf`** - Nginx reverse proxy configuration for production

### Database Configuration
- **`init-db.sql`** - PostgreSQL database initialization script

### Environment Configuration
- **`../env.docker.example`** - Example environment configuration file

## Quick Start

### Development Environment
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Access services
# Frontend: http://localhost:5173
# Backend: http://localhost:8001
```

### Production Environment
```bash
# Copy and configure environment
cp env.docker.example .env

# Start production environment
docker-compose --profile production up -d

# Access application
# Application: https://localhost (with SSL)
```

## Service Architecture

### Development Services
- **Frontend**: React development server with hot reload
- **Backend**: Django development server with auto-reload
- **Database**: PostgreSQL with development database
- **Cache**: Redis for caching

### Production Services
- **Frontend**: React build served by Nginx
- **Backend**: Django served by Gunicorn
- **Database**: PostgreSQL with persistent volumes
- **Cache**: Redis with authentication
- **Proxy**: Nginx reverse proxy with SSL
- **Worker**: Celery worker for background tasks
- **Beat**: Celery beat for scheduled tasks

## Configuration Details

### Backend Configuration
- **Base Image**: Python 3.11-slim
- **WSGI Server**: Gunicorn
- **Health Check**: Django management command
- **Security**: Non-root user execution

### Frontend Configuration
- **Build Stage**: Node.js 18-alpine
- **Production Stage**: Nginx Alpine
- **Optimization**: Static file caching, gzip compression
- **Routing**: SPA routing support

### Database Configuration
- **Version**: PostgreSQL 15
- **Extensions**: uuid-ossp, pg_trgm
- **Initialization**: Custom types and indexes
- **Persistence**: Named volumes

### Nginx Configuration
- **Compression**: Gzip enabled
- **Caching**: Static file caching
- **Security**: Security headers
- **Proxy**: API requests to backend

## Security Features

### Container Security
- Non-root user execution
- Minimal base images
- Multi-stage builds
- No sensitive data in images

### Network Security
- Internal Docker networks
- SSL/TLS encryption
- CORS configuration
- Rate limiting

### Application Security
- Security headers
- Input validation
- Authentication & authorization
- Environment variable security

## Monitoring and Health Checks

### Health Check Endpoints
- **Backend**: `/api/health/`
- **Frontend**: `/health`
- **Database**: `pg_isready`
- **Redis**: `redis-cli ping`

### Monitoring Commands
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Monitor resources
docker stats

# Health check
docker-compose exec backend python manage.py check
```

## Troubleshooting

### Common Issues
1. **Port Conflicts**: Check if required ports are available
2. **Permission Issues**: Ensure proper Docker permissions
3. **Memory Issues**: Increase Docker memory allocation
4. **Network Issues**: Check Docker network configuration

### Debug Commands
```bash
# Enter container shell
docker-compose exec backend bash
docker-compose exec frontend sh

# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Restart specific service
docker-compose restart backend

# Rebuild service
docker-compose build --no-cache backend
```

## Performance Optimization

### Image Optimization
- Multi-stage builds reduce image size
- Alpine Linux base images
- Minimal package installation
- Proper layer caching

### Runtime Optimization
- Health checks for reliability
- Resource limits for stability
- Volume mounts for persistence
- Network optimization

### Production Optimization
- Nginx caching for static files
- Gzip compression
- SSL/TLS optimization
- Connection pooling

## Backup and Maintenance

### Database Backup
```bash
# Create backup
docker-compose exec db pg_dump -U rioworkspace rioworkspace > backup.sql

# Restore backup
docker-compose exec -T db psql -U rioworkspace rioworkspace < backup.sql
```

### Media Backup
```bash
# Backup media files
docker-compose exec backend tar -czf media_backup.tar.gz /app/media

# Restore media files
docker-compose exec backend tar -xzf media_backup.tar.gz -C /app/
```

### Cleanup
```bash
# Remove unused containers and images
docker system prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune
```

## Documentation

For detailed setup instructions and troubleshooting, see:
- [Docker Setup Guide](../docs/guides/DOCKER-SETUP-GUIDE.md)
- [Docker Milestones](../docs/management/DOCKER-MILESTONES.md)

## Support

For issues or questions regarding Docker configuration:
1. Check the troubleshooting section above
2. Review the comprehensive documentation
3. Contact the development team

---

**Last Updated**: January 3, 2025  
**Version**: 1.0
