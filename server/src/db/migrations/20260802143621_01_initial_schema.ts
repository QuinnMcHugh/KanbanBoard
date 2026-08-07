import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1. Create the Users table
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
  });

  // 2. Create the Projects table
  await knex.schema.createTable("projects", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    
    // Foreign Key to User
    table.integer("owner_id").notNullable();
    table.foreign("owner_id").references("id").inTable("users").onDelete("CASCADE");
  });

  // 3. Create the Labels table
  await knex.schema.createTable("labels", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("color").notNullable();
  });

  // 4. Create the Tasks table
  await knex.schema.createTable("tasks", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").notNullable();
    
    // SQLite doesn't have native enums, but Knex handles this gracefully!
    table.enum("status", ["to_do", "in_progress", "done", "in_review", "blocked"])
         .defaultTo("to_do")
         .notNullable();
    
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Foreign Keys
    table.integer("project_id").notNullable();
    table.foreign("project_id").references("id").inTable("projects").onDelete("CASCADE");
    
    table.integer("assigned_to_user_id").nullable();
    table.foreign("assigned_to_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // 5. Create the Task_Labels Junction Table
  await knex.schema.createTable("task_labels", (table) => {
    table.integer("task_id").notNullable();
    table.integer("label_id").notNullable();
    
    // Composite Primary Key
    table.primary(["task_id", "label_id"]);

    // Foreign Keys
    table.foreign("task_id").references("id").inTable("tasks").onDelete("CASCADE");
    table.foreign("label_id").references("id").inTable("labels").onDelete("CASCADE");
  });
}

// The 'down' function undoes the 'up' function, in reverse order!
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("task_labels");
  await knex.schema.dropTableIfExists("tasks");
  await knex.schema.dropTableIfExists("labels");
  await knex.schema.dropTableIfExists("projects");
  await knex.schema.dropTableIfExists("users");
}
