import { sql } from "drizzle-orm";
import { db } from "../index";

/**
 * One-time migration: rename profile_template value 'minimal' → 'dark'.
 * Run after deploying the template rename on any environment that had
 * users with profileTemplate = 'minimal' (set before this rename).
 *
 * Run once:
 *   pnpm --filter @workspace/db run migrate:rename-template
 */
async function run() {
  await db.execute(sql`
    UPDATE users
    SET profile_template = 'dark'
    WHERE profile_template = 'minimal'
  `);
  console.log("Migration complete: profile_template 'minimal' renamed to 'dark'.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
