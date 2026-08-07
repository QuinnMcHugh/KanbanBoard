import type { Knex } from "knex";

const config: Knex.Config = {
    // Tell Knex we are using SQLite
    client: "sqlite3",

    connection: {
        // This is where the actual database file will be created
        filename: "./src/db/kanban.sqlite3"
    },

    // SQLite does not support inserting default values if a column is missing in the insert query.
    // This tells Knex to insert NULL instead, which prevents crashes.
    useNullAsDefault: true,

    // Force SQLite to enforce Foreign Key constraints
    pool: {
        afterCreate: (conn: any, cb: any) => {
            conn.run("PRAGMA foreign_keys = ON", cb);
        }
    },

    // Tell Knex where to put our generated table schemas and mock data
    migrations: {
        directory: "./src/db/migrations",
        extension: "ts",
    },
    seeds: {
        directory: "./src/db/seeds",
        extension: "ts",
    }
};

export default config;
