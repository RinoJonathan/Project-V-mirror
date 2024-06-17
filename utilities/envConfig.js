const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
  console.log("production")
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
  console.log("development")
}