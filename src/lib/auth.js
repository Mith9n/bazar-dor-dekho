import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri =
  process.env.BETTER_AUTH_MONGODB_URI ||
  process.env.MONGODB_URI;

// Route modules are evaluated during `next build` to collect page data, so only
// fail hard at runtime. MongoClient doesn't connect until the first query.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

if (!uri && !isBuildPhase) {
  throw new Error("BETTER_AUTH_MONGODB_URI or MONGODB_URI is not defined in .env");
}

const client = new MongoClient(uri || "mongodb://127.0.0.1:27017");

export const database = client.db("bazardor");

const socialProviders = {};

if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET
) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.URL ||
  (process.env.NODE_ENV === "production"
    ? "https://bazardor-rho.vercel.app"
    : "http://localhost:3000");

export const auth = betterAuth({
  database: mongodbAdapter(database, {
    client,
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://bazardor-rho.vercel.app",
    "https://bazardor-project-assijment-7-2rwk.vercel.app",
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
  ].filter(Boolean),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders,
});
