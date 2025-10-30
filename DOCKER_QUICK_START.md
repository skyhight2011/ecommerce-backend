# Docker Quick Start Guide

## ✅ Docker Setup Complete!

Your Docker environment is now running with:
- **NestJS Backend**: http://localhost:3001
- **Swagger API Docs**: http://localhost:3001/api
- **PostgreSQL Database**: localhost:5433
- **Redis Cache**: localhost:6380

## 🚀 Quick Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
```

### Rebuild After Changes
```bash
docker-compose up -d --build
```

### Access Container Shell
```bash
docker-compose exec app sh
```

## 🔐 Authentication API Endpoints

### 1. Register
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Update Password (requires Bearer token)
```bash
curl -X PUT http://localhost:3001/auth/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "SecurePass123!",
    "newPassword": "NewSecurePass456!"
  }'
```

## 📊 Database Commands

### Run Migrations
```bash
docker-compose exec app pnpm prisma migrate deploy
```

### Generate Prisma Client
```bash
docker-compose exec app pnpm prisma generate
```

### Prisma Studio (Database GUI)
```bash
docker-compose exec app pnpm prisma studio
```

### Connect to PostgreSQL
```bash
docker-compose exec postgres psql -U ecommerce_user -d ecommerce_dev
```

## 🧪 Test the Auth API

### Complete Test Flow
```bash
# 1. Register a new user
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User"
  }')

echo "Register Response: $REGISTER_RESPONSE"

# 2. Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Extract token from login response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | grep -o '"[^"]*$' | tr -d '"')

# 3. Update password
curl -s -X PUT http://localhost:3001/auth/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "currentPassword": "TestPass123!",
    "newPassword": "NewTestPass456!"
  }'
```

## 🎨 View Swagger Documentation

Open your browser and navigate to:
**http://localhost:3001/api**

You'll see all available endpoints with interactive testing capabilities.

## 🏭 Production Build

To run in production mode:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

Production endpoints:
- **API**: http://localhost:3002
- **PostgreSQL**: localhost:5434

## 📝 Environment Variables

Key environment variables configured:
- `DATABASE_URL`: Connection to PostgreSQL
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: Token expiration (1d)
- `NODE_ENV`: Environment mode

## 🔧 Troubleshooting

### Port Already in Use
If port 3001 is occupied, change it in `docker-compose.yml`:
```yaml
ports:
  - "3002:3000"  # Change host port
```

### Reset Everything
```bash
docker-compose down -v
docker-compose up -d --build
```

### Check Service Health
```bash
docker-compose ps
```

All services should show "healthy" status.
