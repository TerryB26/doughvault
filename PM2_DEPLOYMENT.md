# 🚀 PM2 Deployment Guide for DoughVault

## Port Configuration
The application is configured to run on **port 1835**.

---

## Prerequisites

1. **Node.js** installed on your server
2. **PostgreSQL** database running
3. **PM2** installed globally: `npm install -g pm2`

---

## Deployment Steps

### 1. Build the Application

```bash
# Make sure you're in the project directory
cd /path/to/doughvault

# Install dependencies
npm install

# Build for production
npm run build
```

### 2. Configure Environment Variables

Ensure your `.env.local` file has all required variables:

```env
PORT=1835

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

DB_HOST=localhost
DB_PORT=5432
DB_NAME=doughvault
DB_USER=postgres
DB_PASSWORD=your_db_password
```

### 3. Start with PM2

```bash
# Start the application
pm2 start ecosystem.config.cjs

# The app will now be running on port 1835
```

---

## PM2 Commands

### Basic Commands

```bash
# View application status
pm2 status

# View real-time logs
pm2 logs doughvault

# View only error logs
pm2 logs doughvault --err

# View only output logs
pm2 logs doughvault --out

# Clear logs
pm2 flush

# Monitor CPU/Memory usage
pm2 monit

# Show detailed app info
pm2 show doughvault
```

### Process Management

```bash
# Stop the application
pm2 stop doughvault

# Restart the application
pm2 restart doughvault

# Reload (zero-downtime restart)
pm2 reload doughvault

# Delete from PM2 process list
pm2 delete doughvault
```

### Auto-Start on Server Reboot

```bash
# Save current PM2 process list
pm2 save

# Generate startup script
pm2 startup

# Follow the instructions PM2 gives you
# Usually something like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your_user --hp /home/your_user
```

---

## Accessing the Application

Once deployed, your application will be accessible at:

- **Local:** `http://localhost:1835`
- **Server IP:** `http://your-server-ip:1835`
- **Domain:** `http://your-domain.com:1835` (if you have a domain)

### Setting Up Reverse Proxy (Optional)

If you want to access the app without specifying the port, set up Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:1835;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Logs Location

PM2 logs are stored in:
- **Error logs:** `./logs/err.log`
- **Output logs:** `./logs/out.log`
- **Combined logs:** `./logs/combined.log`

---

## Troubleshooting

### Application won't start
```bash
# Check PM2 logs
pm2 logs doughvault --lines 100

# Check if port 1835 is already in use
netstat -ano | findstr :1835    # Windows
lsof -i :1835                   # Linux/Mac

# Restart PM2
pm2 restart doughvault
```

### Database connection errors
```bash
# Test database connection
psql -U postgres -d doughvault -c "SELECT 1;"

# Check environment variables
pm2 show doughvault
```

### High memory usage
```bash
# Check current usage
pm2 monit

# The ecosystem.config.cjs is set to restart at 1GB
# You can adjust this in the file if needed
```

---

## Updating the Application

When you have code updates:

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild
npm run build

# Reload with zero downtime
pm2 reload doughvault
```

---

## Production Checklist

- [ ] `.env.local` configured with production values
- [ ] Database seeded with initial data
- [ ] Clerk authentication configured
- [ ] Application builds without errors (`npm run build`)
- [ ] PM2 starts the application successfully
- [ ] Port 1835 is accessible
- [ ] Firewall allows port 1835 (if needed)
- [ ] PM2 configured to auto-start on reboot
- [ ] Logs directory created and writable
- [ ] SSL certificate configured (if using HTTPS)
- [ ] Database backups scheduled

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs doughvault`
2. Check application logs in `./logs/`
3. Verify environment variables: `pm2 show doughvault`
4. Ensure database is running and accessible
5. Verify Clerk credentials are correct

---

**Application Port:** 1835  
**PM2 App Name:** doughvault  
**Log Location:** `./logs/`

Happy deploying! 🚀
