export default {
  dialect: "postgresql",
  schema: "backend/src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://barberdb2_user:w1UjLQFDnOnc4RNcbmUoCvQBoak0ozwR@dpg-d5f5ujbuibrs7395a07g-a.oregon-postgres.render.com/barberdb2?sslmode=require",
  },
};
