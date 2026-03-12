const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "institute",
  password: "2004",
  port: 5432,
});

async function setupEnrollment() {
  try {
    console.log("Setting up enrollment tables...");

    // Drop existing tables to start fresh
    await pool.query("DROP TABLE IF EXISTS enrollment CASCADE");
    await pool.query("DROP TABLE IF EXISTS students CASCADE");
    await pool.query("DROP TABLE IF EXISTS courses CASCADE");
    console.log("✓ Dropped existing tables");

    // Create students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        s_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Students table created");

    // Create courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        c_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        fee DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Courses table created");

    // Create enrollment table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enrollment (
        enrollment_id SERIAL PRIMARY KEY,
        s_id INT REFERENCES students(s_id),
        c_id INT REFERENCES courses(c_id),
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Enrollment table created");

    // Insert sample students
    const students = [
      { name: "mufeed" },
      { name: "sahil" },
      { name: "hananshah" },
      { name: "habi" },
      { name: "chippu" },
    ];

    for (const student of students) {
      await pool.query(
        "INSERT INTO students (name) VALUES ($1)",
        [student.name]
      );
    }
    console.log("✓ Sample students inserted");

    // Insert sample courses
    const courses = [
      { name: "Web Development", fee: 15000 },
      { name: "Data Science", fee: 18000 },
      { name: "Mobile App Development", fee: 16000 },
      { name: "Cloud Computing", fee: 17000 },
      { name: "Machine Learning", fee: 20000 },
    ];

    for (const course of courses) {
      await pool.query(
        "INSERT INTO courses (name, fee) VALUES ($1, $2)",
        [course.name, course.fee]
      );
    }
    console.log("✓ Sample courses inserted");

    // Insert sample enrollments
    const enrollments = [
      { s_id: 1, c_id: 1 },
      { s_id: 1, c_id: 2 },
      { s_id: 2, c_id: 1 },
      { s_id: 3, c_id: 3 },
      { s_id: 4, c_id: 2 },
      { s_id: 4, c_id: 4 },
      { s_id: 5, c_id: 5 },
    ];

    for (const enrollment of enrollments) {
      await pool.query(
        "INSERT INTO enrollment (s_id, c_id) VALUES ($1, $2)",
        [enrollment.s_id, enrollment.c_id]
      );
    }
    console.log("✓ Sample enrollments inserted");

    // Display enrollment data
    const result = await pool.query(`
      SELECT students.name AS student,
             courses.name AS course,
             courses.fee,
             enrollment.enrollment_date
      FROM enrollment
      JOIN students ON enrollment.s_id = students.s_id
      JOIN courses ON enrollment.c_id = courses.c_id
    `);

    console.log("\nEnrollment Data:");
    console.table(result.rows);

    await pool.end();
    console.log("\n✓ Enrollment setup completed successfully!");
  } catch (error) {
    console.error("Error setting up enrollment:", error);
    process.exit(1);
  }
}

setupEnrollment();
