import dotenv from "dotenv";
// dotenv.config({
//   path: path.join("../../", `${process.env.NODE_ENV}.env`),
// });
dotenv.config();
const config: any = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  STRIPE_KEY: process.env.STRIPE_SECRET_KEY,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
  db: {
    database_name: process.env.DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE,
    paranoid: process.env.DB_PARANOID,
  },
  JWT_SECRET: process.env.JWT_SECRET,
  BASE_URL: process.env.BASE_URL,
};
export default config;
