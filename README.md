# Institute Management System - PostgreSQL Login

A complete web application with user authentication system built with Express.js and PostgreSQL.

## Features

✅ Secure user login with username/password
✅ Password hashing using bcrypt
✅ Session management with express-session
✅ Protected routes that require authentication
✅ Beautiful responsive UI
✅ Dashboard to view institute enrollment data
✅ Logout functionality

## Project Structure

```
📁 project-root
├── server.js              # Express server with authentication
├── index.html             # Login page
├── dashboard.html         # Protected dashboard page
├── script.js              # Frontend JavaScript logic
├── setup-users.js         # Script to create test users
├── setup.sql              # SQL setup script
├── package.json           # Project dependencies
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v12 or higher)
- PostgreSQL (running locally)
- PostgreSQL database named `institute`

### 1. Database Setup

Make sure your PostgreSQL is running and you have the `institute` database created.

**Connection Details (used in server.js):**
- Host: localhost
- Port: 5432
- Username: postgres
- Password: 2004
- Database: institute

### 2. Create Users Table and Test Data

Run the setup script to automatically create the users table and add test users:

```bash
node setup-users.js
```

This will create:
- **Username:** admin, **Password:** admin123
- **Username:** student, **Password:** student123
- **Username:** john, **Password:** password123

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 4. Access the Application

Open your browser and go to: **http://localhost:3000**

### Login with test credentials:
- Username: `admin`
- Password: `admin123`

After successful login, you'll be redirected to the dashboard where you can view enrollment data.

## API Endpoints

### POST /login
Login with username and password
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { "id": 1, "username": "admin" }
}
```

### POST /logout
Logout the current user
```bash
curl -X POST http://localhost:3000/logout
```

### GET /check-session
Check if user is logged in
```bash
curl http://localhost:3000/check-session
```

**Response:**
```json
{
  "loggedIn": true,
  "username": "admin"
}
```

### GET /enrollments
Get all enrollments (requires authentication)
```bash
curl http://localhost:3000/enrollments
```

## File Structure Details

### server.js
- Express server configuration
- PostgreSQL connection pool
- Login endpoint with bcrypt password verification
- Session management
- Protected routes

### index.html
- Beautiful login page with gradient background
- Username and password input fields
- Error and success message display
- Form validation

### dashboard.html
- Protected dashboard page
- Navigation bar with logout button
- Displays logged-in username
- Button to load enrollment data
- Enrollment data table

### script.js
- `handleLogin()` - Handles login form submission
- `logout()` - Logs out the user
- `checkSession()` - Verifies if user is logged in
- `loadData()` - Fetches and displays enrollment data

## Security Features

✅ Passwords are hashed using bcrypt (10 salt rounds)
✅ Session-based authentication with secure cookies
✅ Protected API endpoints that require authentication
✅ Automatic redirect to login page if session expires
✅ CORS enabled for safe cross-origin requests

## Adding New Users

To add new users to the database, you can:

### Option 1: Using Node.js
```javascript
const bcrypt = require('bcrypt');
const password = 'newpassword';
const hashedPassword = await bcrypt.hash(password, 10);
// Insert into database: INSERT INTO users (username, password) VALUES ('newuser', 'hashedPassword')
```

### Option 2: Using SQL
First, generate a bcrypt hash using Node.js, then:
```sql
INSERT INTO users (username, password) VALUES ('newuser', '$2b$10$hashed_password_here');
```

## Customization

### Change Database Credentials
Edit `server.js` and update the pool configuration:
```javascript
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "institute",
  password: "YOUR_PASSWORD",  // Change this
  port: 5432,
});
```

### Change Server Port
Edit `server.js` and modify the port number:
```javascript
app.listen(3001, () => {  // Change from 3000 to 3001
  console.log("Server running on port 3001");
});
```

### Change Session Secret
Edit `server.js` and change the session secret:
```javascript
secret: "your_super_secret_key_here"  // Change this
```

## Troubleshooting

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Cannot connect to PostgreSQL
- Make sure PostgreSQL is running
- Check connection credentials in `server.js`
- Verify the `institute` database exists

### Login fails with "Invalid username or password"
- Check if test users exist: Run `node setup-users.js` again
- Verify username and password are correct
- Check PostgreSQL connection is working

### Session expires after refresh
- Ensure cookies are enabled in your browser
- Check browser console for any errors
- Make sure `checkSession` endpoint is working

## Production Notes

⚠️ **Important for Production:**
1. Change the session secret to a strong random string
2. Use environment variables for database credentials
3. Enable HTTPS on production
4. Set `secure: true` in session cookies for HTTPS only
5. Use password environment variables instead of hardcoding
6. Implement CSRF protection
7. Add rate limiting for login attempts
8. Use database connection pooling with limits

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** bcrypt, express-session
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Middleware:** CORS, express-session

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, check:
1. PostgreSQL connection settings
2. Users table exists in database
3. Server is running on port 3000
4. Browser console for JavaScript errors
