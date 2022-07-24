export default () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  secretKey: process.env.SECRET_KEY,
  database: {
    uri: process.env.MONGODB_CONNECTION_STRING,
    name: process.env.DB_NAME,
  },
});
