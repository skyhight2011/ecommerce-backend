# Docker Setup Guide for Ecommerce Backend

## Prerequisites

1. **Install Docker Desktop** (macOS):
   ```bash
   # Download from: https://www.docker.com/products/docker-desktop/
   # Or install via Homebrew:
   brew install --cask docker
   ```

2. **Start Docker Desktop** and ensure it's running

## Quick Start

### Development Environment
```bash
# Build and start development environment
docker-compose up --build

# Or with newer Docker CLI:
docker compose up --build
```

### Production Environment
```bash
# Build and start production environment
docker-compose -f docker-compose.prod.yml up --build

# Or with newer Docker CLI:
docker compose -f docker-compose.prod.yml up --build
```

## Available Services

### Development (`docker-compose.yml`)
- **app**: NestJS application with hot reload (port 3001)
- **postgres**: PostgreSQL 18 database (port 5433)
- **redis**: Redis cache (port 6380)

### Production (`docker-compose.prod.yml`)
- **app**: Optimized NestJS application (port 3002)
- **postgres**: PostgreSQL 18 database (port 5434)
- **redis**: Redis cache (port 6381)

## Docker Commands

### Build Images
```bash
# Development build
docker build --target development -t ecommerce-backend-dev .

# Production build
docker build --target production -t ecommerce-backend-prod .
```

### Run Containers
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Database Operations
```bash
# Connect to PostgreSQL (Development)
docker-compose exec postgres psql -U ecommerce_user -d ecommerce_dev

# Connect to PostgreSQL (Production)
docker-compose -f docker-compose.prod.yml exec postgres psql -U ecommerce_user -d ecommerce_prod

# Connect to Redis
docker-compose exec redis redis-cli
```

## Environment Variables

Create a `.env` file in the project root for custom configuration:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
POSTGRES_DB=ecommerce_dev
POSTGRES_USER=ecommerce_user
POSTGRES_PASSWORD=ecommerce_password
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
```

## Architecture Details

### Multi-Stage Dockerfile
- **Base Stage**: Node.js 20 Alpine with pnpm
- **Development Stage**: Hot reload with volume mounting
- **Build Stage**: TypeScript compilation
- **Production Stage**: Optimized, secure runtime with non-root user

### Security Features
- Non-root user execution in production
- Health checks for all services
- Network isolation with custom bridge
- Optimized build context with `.dockerignore`

### Database Setup
- PostgreSQL 18 with Alpine Linux
- Automatic database initialization
- UUID and crypto extensions enabled
- Persistent data volumes

## Troubleshooting

### Docker Not Running
```bash
# Check Docker status
docker --version
docker info

# Start Docker Desktop manually if needed
```

### Port Conflicts
If ports 3001, 5433, or 6380 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3003:3000"  # Change host port to 3003
```

### Volume Mounting Issues
If you encounter volume mounting errors (common after Docker updates):

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Clean up Docker system
docker system prune -f

# Rebuild and restart
docker-compose up --build -d
```

### Docker Compose Version Warning
The `version` field in docker-compose files is obsolete. Our configuration files have been updated to remove this field to avoid warnings.

### Clean Up
```bash
# Remove containers and volumes
docker-compose down -v

# Remove images
docker rmi ecommerce-backend-dev ecommerce-backend-prod

# Clean up all Docker resources
docker system prune -a
```

## Access Points

### Development Environment
- **Application**: http://localhost:3001
- **PostgreSQL**: localhost:5433
- **Redis**: localhost:6380

### Production Environment
- **Application**: http://localhost:3002
- **PostgreSQL**: localhost:5434
- **Redis**: localhost:6381

## Next Steps

1. Start Docker Desktop
2. Run `docker-compose up --build` to start development environment
3. Access your application at http://localhost:3001
4. Check logs with `docker-compose logs -f app`
5. Connect to database: `docker-compose exec postgres psql -U ecommerce_user -d ecommerce_dev`
