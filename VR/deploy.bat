@echo off
echo Starting Project Sentinel deployment...

echo Stopping existing containers...
docker-compose down

echo Building and starting services...
docker-compose up --build -d

echo Waiting for services to start...
timeout /t 10

echo Checking service status...
docker-compose ps

echo Deployment complete!
echo Frontend: http://localhost
echo API: http://localhost:3001
echo AI Service: http://localhost:5000