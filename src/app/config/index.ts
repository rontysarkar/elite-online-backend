import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_URL,
  admin_name: process.env.ADMIN_NAME,
  admin_email: process.env.ADMIN_EMAIL,
  admin_phone: process.env.ADMIN_PHONE,
  admin_password:process.env.ADMIN_PASSWORD,
  collector_name: process.env.COLLECTOR_NAME,
  collector_email: process.env.COLLECTOR_EMAIL,
  collector_phone: process.env.COLLECTOR_PHONE,
  collector_password:process.env.COLLECTOR_PASSWORD,
  bcrypt_salt_rounds:process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret:process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret:process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in:process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in:process.env.JWT_REFRESH_EXPIRES_IN,

};
