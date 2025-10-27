# Ecommerce Prisma Schema Documentation

## Overview

This comprehensive Prisma schema provides a complete foundation for building a scalable ecommerce API. The schema is designed with long-term maintainability, scalability, and extensibility in mind.

## Schema Architecture

The schema is organized into logical sections:

1. **User Management** - Authentication, profiles, addresses
2. **Product Management** - Categories, products, variants, attributes
3. **Order Management** - Orders, cart, wishlist
4. **Payment Management** - Payments, refunds, payment methods
5. **Reviews & Notifications** - User feedback and communication
6. **Coupons & Discounts** - Promotional system

## Key Features

### 🔐 **User Management**
- **Role-based access control** (Customer, Admin, Moderator, Vendor, Support)
- **Email and phone verification** tracking
- **Flexible address system** for shipping and billing
- **User preferences** stored as JSON for extensibility
- **Permission system** with JSON array for granular control

### 🛍️ **Product Management**
- **Hierarchical categories** with unlimited nesting
- **Product variants** (size, color, material, etc.)
- **Flexible attributes** system for product customization
- **Inventory tracking** with low stock alerts
- **SEO optimization** with meta fields
- **Multi-image support** with primary image designation

### 📦 **Order Management**
- **Complete order lifecycle** tracking (Pending → Delivered)
- **Multi-status system** (Order, Payment, Fulfillment)
- **Guest and user carts** support
- **Wishlist functionality**
- **Order history** with detailed item tracking

### 💳 **Payment Management**
- **Multiple payment methods** (Credit Card, PayPal, Stripe, etc.)
- **Saved payment methods** for returning customers
- **Comprehensive refund system**
- **External provider integration** ready
- **Transaction tracking** with gateway responses

### ⭐ **Reviews & Notifications**
- **Product reviews** with verification system
- **Multi-type notifications** (Order updates, promotions, security)
- **Review moderation** workflow

### 🎟️ **Coupons & Discounts**
- **Flexible discount types** (Percentage, Fixed Amount, Free Shipping)
- **Usage tracking** and limits
- **Time-based validity** with start/end dates

## Database Design Principles

### 1. **Scalability**
- Uses `cuid()` for globally unique IDs
- Proper indexing with `@unique` constraints
- Efficient foreign key relationships
- JSON fields for flexible data storage

### 2. **Data Integrity**
- Cascade deletes for dependent records
- Required fields with appropriate defaults
- Enum types for controlled values
- Decimal precision for monetary values

### 3. **Extensibility**
- JSON fields for custom data
- Flexible attribute systems
- Modular design for easy additions
- Future-proof enum values

### 4. **Performance**
- Optimized relationships
- Proper foreign key constraints
- Indexed unique fields
- Efficient data types

## Model Relationships

### User → Orders (One-to-Many)
- Users can have multiple orders
- Orders belong to a single user

### Product → Categories (Many-to-One)
- Products belong to one category
- Categories can have multiple products

### Order → OrderItems (One-to-Many)
- Orders contain multiple items
- Items belong to one order

### Product → Variants (One-to-Many)
- Products can have multiple variants
- Variants belong to one product

## Usage Examples

### Creating a User
```typescript
const user = await prisma.user.create({
  data: {
    email: "user@example.com",
    password: "hashedPassword",
    firstName: "John",
    lastName: "Doe",
    role: "CUSTOMER"
  }
});
```

### Creating a Product with Variants
```typescript
const product = await prisma.product.create({
  data: {
    name: "T-Shirt",
    slug: "t-shirt",
    price: 29.99,
    categoryId: "category-id",
    variants: {
      create: [
        {
          name: "Red - Large",
          sku: "TSH-RED-L",
          attributes: { color: "red", size: "large" }
        }
      ]
    }
  }
});
```

### Creating an Order
```typescript
const order = await prisma.order.create({
  data: {
    orderNumber: "ORD-001",
    userId: "user-id",
    subtotal: 59.98,
    total: 64.98,
    taxAmount: 5.00,
    items: {
      create: [
        {
          productId: "product-id",
          quantity: 2,
          price: 29.99,
          total: 59.98
        }
      ]
    }
  }
});
```

## Migration Strategy

### Initial Setup
1. Run `prisma generate` to create the Prisma client
2. Run `prisma db push` to create tables in development
3. Run `prisma migrate dev` for production migrations

### Future Updates
- Add new fields to existing models
- Create new models as needed
- Use `prisma migrate dev` for schema changes
- Always backup before major migrations

## Best Practices

### 1. **Data Validation**
- Use Prisma's built-in validation
- Implement additional validation in your API layer
- Validate JSON fields before storing

### 2. **Performance**
- Use `select` to limit returned fields
- Implement pagination for large datasets
- Use `include` judiciously to avoid N+1 queries

### 3. **Security**
- Hash passwords before storing
- Validate user permissions
- Sanitize user inputs
- Use transactions for critical operations

### 4. **Maintenance**
- Regular database backups
- Monitor query performance
- Update Prisma regularly
- Document custom business logic

## Future Enhancements

The schema is designed to easily accommodate:

- **Multi-currency support**
- **Multi-language content**
- **Advanced inventory management**
- **Subscription products**
- **Digital product delivery**
- **Advanced analytics**
- **Multi-vendor marketplace**
- **Advanced shipping rules**

## Getting Started

1. **Install Prisma**: `npm install prisma @prisma/client`
2. **Generate Client**: `npx prisma generate`
3. **Push Schema**: `npx prisma db push`
4. **Seed Data**: Create seed scripts for initial data
5. **Build API**: Use the generated client in your NestJS services

This schema provides a solid foundation for building a modern, scalable ecommerce platform that can grow with your business needs.
