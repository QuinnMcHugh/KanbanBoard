import { beforeAll, beforeEach, afterAll } from "vitest";
import db from "../src/db/db";

beforeAll(async () => {
    // Idempotent: Knex tracks applied migrations, so re-running this across
    // multiple sequential test files is cheap and safe.
    await db.migrate.latest();
});

beforeEach(async () => {
    // The seed file deletes all rows (in FK-safe order) before inserting a
    // fixed, known dataset — reusing it here gives every test a clean,
    // deterministic starting state without a slower full re-migration.
    await db.seed.run();
});

afterAll(async () => {
    await db.destroy();
});
