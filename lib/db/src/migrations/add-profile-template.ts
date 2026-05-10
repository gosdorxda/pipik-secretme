import { sql } from "drizzle-orm";
import { db } from "../index";

/**
 * One-time migration: add the profile_template column to the users table.
 * Existing rows default to 'classic'.
 *
 * Run once after deploying this schema change on any environment that was
 * already live (e.g. production VPS) before this column was added:
 *   pnpm --filter @workspace/db run migrate:profile-template
 *
 * Dev environments using `drizzle-kit push` will have the column automatically.
 */
async function run() {
  await db.execute(sql`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS profile_template VARCHAR(32) NOT NULL DEFAULT 'classic'
  `);
  console.log("Migration complete: profile_template column added.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
