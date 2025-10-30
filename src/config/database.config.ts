export default () => ({
  database: {
    url:
      process.env.DATABASE_URL ||
      'DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public',
  },
});
