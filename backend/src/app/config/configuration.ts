export default () => ({
  port: parseInt(process.env.PORT, 10) || 8081,
  baseUrl: process.env.BASE_URL || 'http://127.0.0.1',
  upload: {
    baseUrl: process.env.UPLOAD_BASE_URL || 'http://127.0.0.1:8081/uploads',
    apiPath: process.env.UPLOAD_API_PATH || '/uploads',
  },
  mongodb: {
    uri:
      process.env.MONGO_URI || 'mongodb://localhost:27017/cafe_management-db',
    dbName: process.env.DATABASE_NAME || 'cafe_management-db',
  },
  database:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe_management-db',
  accessToken: {
    secret: process.env.JWT_SECRET || 'cafemanagement',
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '3d',
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || 'secret',
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '3d',
  },
  bcrypt: {
    saltOrRounds: Number(process.env.BCRYPT_SALT_OR_ROUNDS) || 10,
  },
});
