# Sample SQL Queries for Dashboard

Copy and paste these directly into the **Run SQL Query** textarea on the dashboard.

> **Important:** Make sure you are logged in first! The `/execute-query` endpoint requires an active session.

---

## A. Basic Retrieval Queries

### 1. Select all enrollments
```sql
SELECT * FROM enrollment JOIN students ON enrollment.s_id = students.s_id JOIN courses ON enrollment.c_id = courses.c_id;
```

### 2. Select all students
```sql
SELECT * FROM students;
```

### 3. Select all courses
```sql
SELECT * FROM courses;
```

### 4. Select specific columns (Student and Course only)
```sql
SELECT students.name AS student, courses.name AS course FROM enrollment JOIN students ON enrollment.s_id = students.s_id JOIN courses ON enrollment.c_id = courses.c_id;
```

### 5. List all unique students
```sql
SELECT DISTINCT students.name FROM students ORDER BY students.name;
```

### 6. List all unique courses
```sql
SELECT DISTINCT courses.name FROM courses ORDER BY courses.name;
```

---

## B. Filtering Queries (WHERE clause)

### 7. Find all courses where fee is greater than 15000
```sql
SELECT courses.name AS course, courses.fee FROM courses WHERE courses.fee > 15000 ORDER BY courses.fee DESC;
```

### 8. Find enrollments for courses with fee greater than 17000
```sql
SELECT students.name AS student, courses.name AS course, courses.fee FROM enrollment JOIN students ON enrollment.s_id = students.s_id JOIN courses ON enrollment.c_id = courses.c_id WHERE courses.fee > 17000;
```

### 9. Find enrollments for courses related to 'Development' (LIKE)
```sql
SELECT students.name AS student, courses.name AS course FROM enrollment JOIN students ON enrollment.s_id = students.s_id JOIN courses ON enrollment.c_id = courses.c_id WHERE courses.name LIKE '%Development%';
```

### 10. Find Web Development course enrollments
```sql
SELECT students.name AS student, courses.fee FROM enrollment JOIN students ON enrollment.s_id = students.s_id JOIN courses ON enrollment.c_id = courses.c_id WHERE courses.name = 'Web Development';
```

### 11. Find machine learning related courses
```sql
SELECT * FROM courses WHERE courses.name LIKE '%Machine%' OR courses.name LIKE '%Learning%';
```

---

## C. Aggregation Queries (COUNT, SUM, AVG, GROUP BY)

### 12. Count total number of enrollments
```sql
SELECT COUNT(*) AS total_enrollments FROM enrollment;
```

### 13. Calculate total fees from all courses
```sql
SELECT SUM(courses.fee) AS total_revenue FROM courses;
```

### 14. Calculate average course fee
```sql
SELECT AVG(courses.fee) AS average_fee FROM courses;
```

### 15. Count how many courses each student is enrolled in
```sql
SELECT students.name, COUNT(enrollment.c_id) AS number_of_courses FROM enrollment JOIN students ON enrollment.s_id = students.s_id GROUP BY students.name ORDER BY number_of_courses DESC;
```

### 16. Calculate total cost for each student (sum of all course fees)
```sql
SELECT students.name, SUM(courses.fee) AS total_fee_paid FROM enrollment JOIN students ON enrollment.s_id = students.s_id JOIN courses ON enrollment.c_id = courses.c_id GROUP BY students.name ORDER BY total_fee_paid DESC;
```

### 17. Find courses with more than one student enrolled
```sql
SELECT courses.name AS course, COUNT(enrollment.s_id) AS number_of_students FROM enrollment JOIN courses ON enrollment.c_id = courses.c_id GROUP BY courses.name HAVING COUNT(enrollment.s_id) > 1;
```

### 18. Find students who paid more than 30000 in total
```sql
SELECT students.name, SUM(courses.fee) AS total_paid FROM enrollment JOIN students ON enrollment.s_id = students.s_id JOIN courses ON enrollment.c_id = courses.c_id GROUP BY students.name HAVING SUM(courses.fee) > 30000 ORDER BY total_paid DESC;
```

---

## D. Ordering & Sorting Queries

### 19. List enrollments ordered by student name
```sql
SELECT students.name AS student, courses.name AS course, courses.fee FROM enrollment JOIN students ON enrollment.s_id = students.s_id JOIN courses ON enrollment.c_id = courses.c_id ORDER BY students.name ASC;
```

### 20. List enrollments ordered by fee (highest to lowest)
```sql
SELECT students.name AS student, courses.name AS course, courses.fee FROM enrollment JOIN students ON enrollment.s_id = students.s_id JOIN courses ON enrollment.c_id = courses.c_id ORDER BY courses.fee DESC;
```

### 21. List courses ordered by fee
```sql
SELECT courses.name, courses.fee FROM courses ORDER BY courses.fee DESC;
```

### 22. Count of enrollments per course (most enrolled first)
```sql
SELECT courses.name AS course, COUNT(*) AS enrollments FROM enrollment JOIN courses ON enrollment.c_id = courses.c_id GROUP BY courses.name ORDER BY enrollments DESC;
```

---

## E. Advanced Queries

### 23. Students with multiple course enrollments
```sql
SELECT students.name, COUNT(*) AS course_count FROM enrollment JOIN students ON enrollment.s_id = students.s_id GROUP BY students.name HAVING COUNT(*) > 1;
```

### 24. Most expensive course
```sql
SELECT courses.name, courses.fee FROM courses ORDER BY courses.fee DESC LIMIT 1;
```

### 25. Cheapest course
```sql
SELECT courses.name, courses.fee FROM courses ORDER BY courses.fee ASC LIMIT 1;
```

### 26. Average fee per student enrollment
```sql
SELECT AVG(courses.fee) AS avg_course_fee FROM courses;
```

### 27. High-value enrollments (fee > 18000)
```sql
SELECT students.name, courses.name, courses.fee FROM enrollment JOIN students ON enrollment.s_id = students.s_id JOIN courses ON enrollment.c_id = courses.c_id WHERE courses.fee > 18000 ORDER BY courses.fee DESC;
```

---

## How to Use These Queries

1. **Log into the dashboard** (go to `http://localhost:3000/index.html`)
2. **Navigate to the "Run SQL Query" section**
3. **Copy one of the queries above** into the textarea
4. **Click "Execute"**
5. **Results will appear in a table below**

> ⚠️ If you see "Unauthorized" error, your session has expired. Log out and log back in, then try again.
