# 🏦 Kodbank

A simple, secure banking application built with vanilla HTML/CSS/JS, Node.js, and Aiven MySQL database.

## ✨ Features

- **User Registration**: Create an account with UID, username, email, phone, and password
- **Default Balance**: New accounts start with ₹100,000
- **JWT Authentication**: Secure login with JWT tokens stored in database and cookies
- **Balance Check**: View your account balance with a celebration animation
- **Role-based Access**: Support for Customer, Manager, and Admin roles
- **Secure Passwords**: Passwords are hashed using bcrypt
- **Rate Limiting**: Protection against brute-force attacks
- **Responsive Design**: Works on all devices

## 🚀 Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: Aiven MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt, helmet, cors, express-rate-limit
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js installed (v14 or higher)
- An Aiven MySQL database
- Git installed

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd kodbank
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

#### Option A: Using Aiven MySQL
1. Log in to your Aiven account
2. Create a new MySQL service
3. Get your connection details:
   - Host
   - Port
   - User
   - Password
   - Database name

#### Option B: Local MySQL
You can also use a local MySQL database for development.

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
# Aiven MySQL Database Configuration
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=25060
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password
DB_NAME=defaultdb

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=24h

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 5. Create Database Tables

Run the schema file:

```bash
mysql -h <DB_HOST> -P <DB_PORT> -u <DB_USER> -p <DB_NAME> < database/schema.sql
```

Or use the MySQL CLI to execute the SQL commands manually.

### 6. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📖 Usage

### 1. Home Page
Visit `http://localhost:3000` to see the landing page.

### 2. Register
- Click "Get Started" or navigate to `/register.html`
- Fill in the registration form:
  - User ID (unique identifier)
  - Username (unique username)
  - Email address
  - Phone number (10 digits)
  - Password (minimum 6 characters)
  - Confirm password
- Submit the form
- Your account will be created with ₹100,000 balance
- You'll be redirected to the login page

### 3. Login
- Navigate to `/login.html`
- Enter your username and password
- Click "Login"
- Upon successful login:
  - JWT token is generated and stored
  - Token is saved in database
  - Token is set as HTTP-only cookie
  - You'll be redirected to the dashboard

### 4. Dashboard
- View your welcome message with username
- Click "Check Balance" to:
  - Send request with JWT token
  - Verify token authenticity
  - Fetch your balance from database
  - Display balance with celebration animation

### 5. Logout
- Click "Logout" button
- Token is removed from database and cookie
- You'll be redirected to login page

## 🗄️ Database Schema

### KodUser Table
| Column | Type | Description |
|--------|------|-------------|
| uid | VARCHAR(255) | Primary key, user ID |
| username | VARCHAR(255) | Unique username |
| email | VARCHAR(255) | Unique email address |
| password | VARCHAR(255) | Hashed password |
| balance | DECIMAL(15,2) | Account balance (default: 100000) |
| phone | VARCHAR(20) | Phone number |
| role | ENUM | User role (Customer, Manager, Admin) |
| created_at | TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### UserToken Table
| Column | Type | Description |
|--------|------|-------------|
| tid | VARCHAR(255) | Primary key, token ID |
| token | TEXT | JWT token |
| uid | VARCHAR(255) | Foreign key to KodUser |
| expiry | DATETIME | Token expiration time |
| created_at | TIMESTAMP | Token creation timestamp |

## 🔐 Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt (10 salt rounds)
2. **JWT Authentication**: Secure token-based authentication
3. **HTTP-only Cookies**: Tokens are stored in secure, HTTP-only cookies
4. **Rate Limiting**: 
   - 100 requests per 15 minutes per IP
   - 5 login attempts per 15 minutes per IP
5. **SQL Injection Protection**: Parameterized queries
6. **Helmet**: Security headers for Express
7. **CORS**: Configured for secure cross-origin requests

## 📡 API Endpoints

### Authentication

#### POST /api/register
Register a new user

**Request Body:**
```json
{
  "uid": "user123",
  "uname": "johndoe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "Customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful! Please login.",
  "redirect": "/login.html"
}
```

#### POST /api/login
Login user

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful!",
  "redirect": "/dashboard.html",
  "username": "johndoe",
  "role": "Customer"
}
```

#### POST /api/logout
Logout user

**Response:**
```json
{
  "success": true,
  "message": "Logout successful!",
  "redirect": "/login.html"
}
```

### User

#### GET /api/user
Get current user information (protected)

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "user123",
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "Customer"
  }
}
```

#### GET /api/balance
Get user balance (protected)

**Response:**
```json
{
  "success": true,
  "balance": 100000.00
}
```

## 🌐 Deployment to Vercel

### 1. Prepare for Deployment

#### Update vercel.json (create if needed):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

#### Modify server.js for Vercel:
Remove or comment out the `app.listen()` section and add:

```javascript
// Export for Vercel
module.exports = app;

// Only listen if not running on Vercel
if (require.main === module) {
    startServer();
}
```

### 2. Deploy to Vercel

#### Using Vercel CLI:
```bash
npm install -g vercel
vercel
```

#### Using Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Configure environment variables in Vercel dashboard
4. Deploy!

### 3. Set Environment Variables in Vercel

In Vercel Dashboard → Project Settings → Environment Variables:

```
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=25060
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password
DB_NAME=defaultdb
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRY=24h
NODE_ENV=production
```

## 🧪 Testing

### Manual Testing
1. Register a new user
2. Login with the credentials
3. Check balance (should show ₹100,000)
4. Try logging out and logging back in

### Testing Scenarios
- ✅ Valid registration
- ✅ Duplicate username/email handling
- ✅ Valid login
- ✅ Invalid login credentials
- ✅ Password mismatch in registration
- ✅ Token authentication
- ✅ Balance retrieval
- ✅ Logout functionality

## 🐛 Troubleshooting

### Database Connection Issues
- Check your `.env` file has correct credentials
- Verify Aiven MySQL service is running
- Check firewall settings allow connections

### Token Not Working
- Clear browser cookies
- Check JWT_SECRET is consistent
- Verify token hasn't expired

### Port Already in Use
- Change PORT in `.env` file
- Kill process using port 3000:
  ```bash
  lsof -ti:3000 | xargs kill -9
  ```

## 📝 Project Structure

```
kodbank/
 backend/
   ├── server.js          # Main Express server
   ├── db.js              # Database connection
   ├── auth.js            # JWT and password utilities
   ├── middleware.js      # Authentication middleware
   └── routes.js          # API routes
 frontend/
   ├── index.html         # Home page
   ├── register.html      # Registration page
   ├── login.html         # Login page
   ├── dashboard.html     # User dashboard
   ├── css/
   │   └── styles.css     # Main stylesheet
   └── js/
       ├── confetti.js    # Celebration animation
       ├── register.js    # Registration logic
       ├── login.js       # Login logic
       └── dashboard.js   # Dashboard logic
 database/
   └── schema.sql         # Database schema
 package.json           # Node.js dependencies
 .env.example           # Environment variables template
 README.md             # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Kodbank Development Team

## 🙏 Acknowledgments

- Built with ❤️ using vanilla web technologies
- Database powered by Aiven
- Authentication using JWT

---

**Happy Banking with Kodbank! 🏦**
