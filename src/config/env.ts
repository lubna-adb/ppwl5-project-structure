export const env = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "./database.sqlite",
  NODE_ENV: process.env.NODE_ENV || "development",
};