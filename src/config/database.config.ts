export default () => ({
  database: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://ecommerce_user:ecommerce_password@localhost:5433/ecommerce_dev?schema=public',
  },
});
