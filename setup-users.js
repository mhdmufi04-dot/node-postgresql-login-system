const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "institute",
  password: "2004",
  port: 5432,
});

async function setupUsers() {
  try {
    console.log("Setting up test users...");

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Users table created/verified");

    // Create test users with hashed passwords
    const testUsers = [
      { username: "admin", password: "admin123" },
      { username: "student", password: "student123" },
      { username: "john", password: "password123" },
    ];

    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Try to insert, ignore if already exists
      try {
        await pool.query(
          "INSERT INTO users (username, password) VALUES ($1, $2)",
          [user.username, hashedPassword]
        );
        console.log(`✓ User '${user.username}' created successfully`);
      } catch (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          console.log(`✓ User '${user.username}' already exists`);
        } else {
          throw error;
        }
      }
    }

    // Display all users
    const result = await pool.query("SELECT id, username, created_at FROM users");
    console.log("\nCurrent users in database:");
    console.table(result.rows);

    console.log("\nTest logins:");
    console.log("- Username: admin, Password: admin123");
    console.log("- Username: student, Password: student123");
    console.log("- Username: john, Password: password123");

    await pool.end();
  } catch (error) {
    console.error("Error setting up users:", error);
    process.exit(1);
  }
}

setupUsers();
