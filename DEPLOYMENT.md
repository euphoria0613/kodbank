# 🚀 Kodbank Deployment Guide

This guide will help you deploy Kodbank to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Local Testing](#local-testing)
4. [Deployment to Vercel](#deployment-to-vercel)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, make sure you have:

- ✅ Aiven MySQL database service running
- ✅ GitHub account
- ✅ Vercel account
- ✅ Node.js installed locally
- ✅ Git installed

---

## Database Setup

### 1. Create Aiven MySQL Service

1. Log in to [Aiven Console](https://console.aiven.io/)
2. Click "Create service"
3. Select "MySQL" from the database options
4. Choose a cloud provider and region
5. Select the plan (you can start with a free trial or paid plan)
6. Click "Create service"
7. Wait for the service to be running (green status)

### 2. Get Database Credentials

From your Aiven MySQL service dashboard:

1. Click "Overview" tab
2. Scroll down to "Connection information"
3. Copy these values:
   - Host (e.g., `xxxxx-xxxxx.aivencloud.com`)
   - Port (default: `25060`)
   - User (default: `avnadmin`)
   - Password (click to reveal)
   - Database name (default: `defaultdb`)

### 3. Create Database Tables

#### Option A: Using MySQL CLI
```bash
mysql -h <DB_HOST> -P <DB_PORT> -u <DB_USER> -p<DB_PASSWORD> <DB_NAME> < database/schema.sql
```

Example:
```bash
mysql -h my-service-123.aivencloud.com -P 25060 -u avnadmin -pMyPassword123 defaultdb < database/schema.sql
```

#### Option B: Using Aiven Console
1. Go to your MySQL service in Aiven Console
2. Click "Tools" tab
3. Click "phpMyAdmin" or "WebSQL"
4. Copy and paste the contents of `database/schema.sql`
5. Execute the SQL

---

## Local Testing

Before deploying to production, test locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your Aiven credentials:
```env
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=25060
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password
DB_NAME=defaultdb
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=24h
PORT=3000
NODE_ENV=development
```

### 3. Start the Server
```bash
npm start
```

Or for development:
```bash
npm run dev
```

### 4. Test the Application

1. Open browser to `http://localhost:3000`
2. Test registration:
   - Click "Get Started"
   - Fill in the registration form
   - Submit
3. Test login:
   - Use the credentials you just created
   - Click "Login"
4. Test balance check:
   - Click "Check Balance"
   - Verify it shows ₹100,000
   - Verify confetti animation appears
5. Test logout:
   - Click "Logout"
   - Verify you're redirected to login

---

## Deployment to Vercel

### Method 1: Using Vercel CLI (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

This will open your browser to authenticate.

#### 3. Deploy
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account/team
- **Link to existing project?** → `N`
- **What's your project's name?** → `kodbank` (or your preferred name)
- **In which directory is your code?** → `./`
- **Want to modify these settings?** → `N` (for first deployment)

Vercel will deploy your application and provide a URL like:
```
https://kodbank-xxxxx.vercel.app
```

### Method 2: Using Vercel Dashboard

#### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Kodbank application"
git branch -M main
git remote add origin https://github.com/your-username/kodbank.git
git push -u origin main
```

#### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: "Other"
   - **Root Directory**: `.`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
4. Click "Deploy"

### 3. Configure Environment Variables in Vercel

#### Using Vercel Dashboard:
1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   ```
   DB_HOST = your-aiven-host.aivencloud.com
   DB_PORT = 25060
   DB_USER = avnadmin
   DB_PASSWORD = your-aiven-password
   DB_NAME = defaultdb
   JWT_SECRET = your-production-jwt-secret
   JWT_EXPIRY = 24h
   NODE_ENV = production
   ```
4. Click "Save"
5. **Important**: Redeploy your project after adding environment variables

#### Using Vercel CLI:
```bash
vercel env add DB_HOST
# Enter your value when prompted

vercel env add DB_PORT
# Enter: 25060

vercel env add DB_USER
# Enter: avnadmin

vercel env add DB_PASSWORD
# Enter your password

vercel env add DB_NAME
# Enter: defaultdb

vercel env add JWT_SECRET
# Enter your production secret

vercel env add JWT_EXPIRY
# Enter: 24h

vercel env add NODE_ENV
# Enter: production
```

Then redeploy:
```bash
vercel --prod
```

---

## Post-Deployment

### 1. Verify Deployment

1. Visit your Vercel URL
2. Test the complete user flow:
   - Register a new account
   - Login
   - Check balance
   - Logout

### 2. Set Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `kodbank.yourdomain.com`)
3. Follow DNS instructions provided by Vercel
4. Wait for SSL certificate to be issued

### 3. Monitor Application

- Check Vercel Dashboard for deployment logs
- Monitor Aiven MySQL service performance
- Set up error logging/alerts as needed

---

## Troubleshooting

### Issue 1: Database Connection Failed

**Symptoms:**
- Error: "Database connection failed"
- Application doesn't start

**Solutions:**
1. Verify Aiven MySQL service is running
2. Check environment variables are set correctly
3. Ensure firewall allows connections
4. Verify database credentials in Vercel

### Issue 2: JWT Token Not Working

**Symptoms:**
- Login seems successful but can't access protected routes
- "Authentication required" error on dashboard

**Solutions:**
1. Clear browser cookies
2. Verify JWT_SECRET is consistent across environments
3. Check token hasn't expired (default 24 hours)
4. Verify cookie settings in Vercel (https only for production)

### Issue 3: Vercel Deployment Fails

**Symptoms:**
- Deployment shows errors
- Application doesn't load

**Solutions:**
1. Check Vercel deployment logs
2. Ensure all dependencies are in package.json
3. Verify environment variables are set
4. Check build output in Vercel Dashboard

### Issue 4: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- API requests fail

**Solutions:**
1. Update CORS origin in `backend/server.js`
2. Add your Vercel domain to allowed origins
3. Ensure credentials: true is set

### Issue 5: Balance Not Displaying

**Symptoms:**
- Balance check button doesn't show balance
- Confetti doesn't appear

**Solutions:**
1. Check browser console for errors
2. Verify /api/balance endpoint is working
3. Check JWT token is being sent
4. Ensure database has balance data

---

## Security Checklist

Before going to production, ensure:

- ✅ JWT_SECRET is a strong, unique value (not default)
- ✅ Database password is strong
- ✅ HTTPS is enabled (Vercel provides this automatically)
- ✅ Environment variables are not committed to git
- ✅ Rate limiting is configured
- ✅ Input validation is implemented
- ✅ Password hashing is enabled (bcrypt)
- ✅ SQL injection protection is in place

---

## Performance Optimization

### 1. Database Indexing
The schema includes indexes on:
- username
- email
- uid (in UserToken)
- token (in UserToken)

### 2. Connection Pooling
MySQL connection pool is configured with:
- 10 max connections
- Proper connection reuse

### 3. Static File Serving
Frontend files are served efficiently by Express

### 4. Rate Limiting
- General API: 100 requests/15 minutes
- Login: 5 attempts/15 minutes

---

## Maintenance

### Regular Tasks

1. **Monitor Database**: Check Aiven dashboard for performance
2. **Review Logs**: Check Vercel deployment logs regularly
3. **Update Dependencies**: Run `npm audit` and update packages
4. **Backup Database**: Configure Aiven backups
5. **Rotate Secrets**: Periodically update JWT_SECRET

### Scaling Considerations

When scaling:
- Increase database connection pool size
- Consider read replicas for MySQL
- Implement caching layer (Redis)
- Load balance across multiple instances

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Vercel deployment logs
3. Check Aiven MySQL service status
4. Review browser console for client-side errors
5. Consult the main [README.md](README.md)

---

**Happy Deploying! 🚀**
