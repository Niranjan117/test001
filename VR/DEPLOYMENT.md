# Project Sentinel - Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports 80, 3001, 5000, 27017 available

## Quick Deployment

### Windows
```cmd
deploy.bat
```

### Linux/Mac
```bash
chmod +x deploy.sh
./deploy.sh
```

## Manual Deployment

1. **Configure Environment**
   ```bash
   cp .env.production .env
   # Edit .env with your production values
   ```

2. **Deploy Services**
   ```bash
   docker-compose up --build -d
   ```

3. **Verify Deployment**
   ```bash
   docker-compose ps
   ```

## Access Points

- **Frontend**: http://localhost
- **API Server**: http://localhost:3001
- **AI Service**: http://localhost:5000
- **MongoDB**: localhost:27017

## Production Configuration

### Security
- Change JWT_SECRET in .env
- Use HTTPS in production
- Configure firewall rules
- Enable MongoDB authentication

### Scaling
- Use external MongoDB cluster
- Add load balancer for API
- Configure Redis for session storage

## Troubleshooting

### Service Not Starting
```bash
docker-compose logs [service-name]
```

### Database Connection Issues
```bash
docker-compose exec mongodb mongo
```

### Reset Deployment
```bash
docker-compose down -v
docker-compose up --build -d
```