import { sql } from "drizzle-orm";
import { db } from "../index";

/**
 * One-time backfill: mark all users that existed before the hasSetUsername
 * feature was introduced as having already set their username, so they skip
 * the new onboarding welcome flow.
 *
 * Run once after deploying the hasSetUsername schema change:
 *   pnpm --filter @workspace/db run backfill:has-set-username
 */
async function run() {
  const result = await db.execute(
    sql`UPDATE users SET has_set_username = true WHERE has_set_username = false`,
  );
  console.log(`Backfill complete. Rows updated: ${result.rowCount ?? 0}`);
  process.exit(0);
}

run().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
