# Prisma Schema Migration Guide

## Overview

This guide explains how to work with the split Prisma schema structure and manage migrations for the ecommerce backend.

## Schema Structure

The Prisma schema is organized into separate model files for better maintainability:

```
prisma/
├── schema.prisma          # Main schema file with all models
├── models/
│   ├── user.prisma        # User management models
│   ├── catagory.prisma    # Category models
│   ├── product.prisma     # Product management models
│   ├── order.prisma       # Order and cart models
│   ├── payment.prisma     # Payment and refund models
│   ├── review.prisma      # Review models
│   ├── notification.prisma # Notification models
│   └── coupon.prisma      # Coupon and discount models
├── migrations/            # Database migrations
└── README.md             # Schema documentation
```

## Migration Commands

### Initial Setup
```bash
# Generate Prisma client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Apply migrations to production
npx prisma migrate deploy
```

### Development Workflow
```bash
# After schema changes, create a new migration
npx prisma migrate dev --name add_new_feature

# Reset database (development only)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

### Production Deployment
```bash
# Deploy migrations to production
npx prisma migrate deploy

# Generate client for production
npx prisma generate
```

## Model Files

### 1. User Management (`user.prisma`)
- **User**: Complete user profiles with roles and permissions
- **Address**: Flexible shipping/billing address system
- **Enums**: UserRole, AddressType

### 2. Product Management (`product.prisma`)
- **Category**: Hierarchical category system
- **Product**: Comprehensive product management
- **ProductImage**: Multi-image support
- **ProductVariant**: Size, color, material variants
- **ProductAttribute**: Flexible attribute system
- **Enums**: ProductStatus

### 3. Order Management (`order.prisma`)
- **Order**: Complete order lifecycle tracking
- **OrderItem**: Detailed order line items
- **Cart**: Shopping cart for users and guests
- **CartItem**: Cart line items
- **WishlistItem**: User wishlist functionality
- **Enums**: OrderStatus, PaymentStatus, FulfillmentStatus

### 4. Payment Management (`payment.prisma`)
- **Payment**: Comprehensive payment tracking
- **PaymentMethod**: Saved payment methods
- **Refund**: Complete refund system
- **Enums**: PaymentMethodType, RefundStatus

### 5. Reviews (`review.prisma`)
- **Review**: Product reviews with verification
- **Enums**: ReviewStatus

### 6. Notifications (`notification.prisma`)
- **Notification**: Multi-type notification system
- **Enums**: NotificationType

### 7. Coupons (`coupon.prisma`)
- **Coupon**: Flexible discount system
- **CouponUsage**: Usage tracking
- **Enums**: DiscountType

## Adding New Models

### 1. Create Model File
```bash
# Create new model file
touch prisma/models/new_model.prisma
```

### 2. Define Model
```prisma
// prisma/models/new_model.prisma
model NewModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("new_models")
}
```

### 3. Add to Main Schema
Add the model to `prisma/schema.prisma`:
```prisma
// Add to appropriate section
model NewModel {
  // ... model definition
}
```

### 4. Create Migration
```bash
npx prisma migrate dev --name add_new_model
```

## Schema Updates

### Adding Fields
```bash
# 1. Update model in schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_field_to_model
```

### Modifying Relations
```bash
# 1. Update relations in schema.prisma
# 2. Create migration
npx prisma migrate dev --name update_relations
```

### Removing Fields
```bash
# 1. Remove field from schema.prisma
# 2. Create migration
npx prisma migrate dev --name remove_field_from_model
```

## Best Practices

### 1. Migration Naming
- Use descriptive names: `add_user_verification`, `update_product_variants`
- Include the model name: `add_email_to_user`, `remove_old_field_from_product`

### 2. Schema Changes
- Always test migrations in development first
- Use `prisma migrate reset` to test from scratch
- Review generated SQL before applying to production

### 3. Model Organization
- Keep related models in the same file
- Use clear comments for complex relations
- Follow consistent naming conventions

### 4. Data Safety
- Backup production database before migrations
- Test migrations with production-like data
- Use transactions for complex migrations

## Troubleshooting

### Migration Conflicts
```bash
# Reset and recreate migrations
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Schema Validation Errors
```bash
# Format schema
npx prisma format

# Validate schema
npx prisma validate
```

### Database Connection Issues
```bash
# Check database status
docker-compose ps postgres

# Restart database
docker-compose restart postgres
```

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://ecommerce_user:ecommerce_password@localhost:5433/ecommerce_dev?schema=public"

# Application
NODE_ENV=development
PORT=3000
```

## Production Considerations

### 1. Migration Strategy
- Use `prisma migrate deploy` for production
- Never use `prisma migrate dev` in production
- Test migrations in staging environment first

### 2. Performance
- Add indexes for frequently queried fields
- Use `@@index` for composite indexes
- Monitor query performance

### 3. Security
- Use connection pooling in production
- Set appropriate database permissions
- Rotate database credentials regularly

## Next Steps

1. **Seed Data**: Create seed scripts for initial data
2. **API Integration**: Use Prisma client in NestJS services
3. **Testing**: Set up test database for unit tests
4. **Monitoring**: Add database monitoring and logging
5. **Backup**: Implement automated backup strategy

This migration system provides a solid foundation for managing your ecommerce database schema as your application grows and evolves.
