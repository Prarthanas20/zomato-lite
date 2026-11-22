// The single place where the app talks to the database.
//
// `neon` is the Neon HTTP driver. Every call it makes is one round trip to
// Postgres, and it uses the DATABASE_URL secret from .env.local (locally)
// or from the Vercel project settings (in production).

import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Add it to .env.local locally, or to the Vercel project settings in production."
  );
}

export const sql = neon(connectionString);
