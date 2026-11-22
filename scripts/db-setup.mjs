// db:setup — creates the two tables and seeds them.
// Run with:  npm run db:setup
//
// This script reads DATABASE_URL from .env.local, runs db/schema.sql,
// then db/seed.sql, then prints the rows so you can see them.

import { readFileSync, existsSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

// --- tiny .env reader (so we do not need an extra dependency) -------------
function readEnvFile(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const env = readEnvFile(".env.local");
const databaseUrl = process.env.DATABASE_URL || env.DATABASE_URL;

if (!databaseUrl) {
  console.error("No DATABASE_URL found. Put it in .env.local first.");
  process.exit(1);
}

const sql = neon(databaseUrl);

// Split a .sql file into individual statements.
// The Neon HTTP driver runs one statement at a time, so we feed them in order.
function statementsFrom(file) {
  const text = readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n");

  return text
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function runFile(file) {
  const statements = statementsFrom(file);
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`  ran ${statements.length} statement(s) from ${file}`);
}

console.log("Applying db/schema.sql ...");
await runFile("db/schema.sql");

console.log("Applying db/seed.sql ...");
await runFile("db/seed.sql");

console.log("\nrestaurants table:");
const restaurants = await sql`
  SELECT id, name, cuisine, area FROM restaurants ORDER BY id
`;
console.table(restaurants);

console.log("\nreviews table:");
const reviews = await sql`
  SELECT id, restaurant_id, rating, comment, created_at
  FROM reviews ORDER BY id
`;
console.table(reviews);

console.log("\nDone.");
