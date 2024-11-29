import { config as conf } from "dotenv";

conf();

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  database: process.env.MONGO_URL,
  jwt: process.env.JWT_SECREAT,
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
};

export const _confiq = Object.freeze(config);
