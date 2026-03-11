import { Database } from "bun:sqlite";

export let db: Database;

export function initDB() {
  db = new Database("database.sqlite");

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  console.log("✅ Database initialized");
}