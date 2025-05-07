import fs from "fs";
import path from "path";
import { pool } from "./utils/db";
const runMigrations = async () => {
  const files = fs.readdirSync(path.join(__dirname, "migrations")).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(__dirname, "migrations", file), "utf-8");
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
  }
  console.log("All migrations executed");
};
runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });