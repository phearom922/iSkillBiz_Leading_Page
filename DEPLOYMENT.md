# Deployment Guide for iSkillBiz Landing Page

This guide will walk you through deploying the iSkillBiz Landing Page on DigitalOcean using Docker.

## Prerequisites

- DigitalOcean Droplet (IP: 178.128.58.209)
- Access to Namecheap DNS
- Access to Cloudflare
- SSH access to the Droplet
- Supabase project credentials

## Architecture

```
Cloudflare DNS (inbox.iskillbiz.com)
    ↓
DigitalOcean Droplet (178.128.58.209)
    ├── Nginx (Port 80/443) - Reverse Proxy
    ├── Next.js Frontend (Port 3000)
    └── NestJS Backend (Port 3001)
    ↓
Supabase (Cloud Database)
```

## Step 1: Initial Server Setup

### 1.1 Connect to Your Droplet

```bash
ssh root@178.128.58.209
```

### 1.2 Update System

```bash
apt update && apt upgrade -y
```

### 1.3 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose (V2 plugin)
apt install docker compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 1.4 Install Git

```bash
apt install git -y
```

### 1.5 Setup Firewall

```bash
# Install UFW
apt install ufw -y

# Allow SSH, HTTP, and HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Verify
ufw status
```

### 1.6 Create Application Directory

```bash
mkdir -p /opt/iskillbiz
cd /opt/iskillbiz
```

## Step 2: Cloudflare DNS Configuration

### 2.1 Add DNS Record in Namecheap

1. Log in to Namecheap
2. Go to Domain List → Manage `iskillbiz.com`
3. Go to Advanced DNS
4. Add A Record:
   - Type: A Record
   - Host: `inbox`
   - Value: `178.128.58.209`
   - TTL: Automatic

### 2.2 Configure Cloudflare

1. Log in to Cloudflare
2. Select the `iskillbiz.com` domain
3. Go to DNS → Records
4. Verify the A record exists:
   - Type: A
   - Name: `inbox`
   - Content: `178.128.58.209`
   - Proxy status: Proxied (orange cloud) ✅
5. Go to SSL/TLS:
   - Encryption mode: **Full (strict)** or **Flexible**
   - For Full (strict), you'll need Cloudflare Origin Certificate (optional)

## Step 3: Clone and Setup Application

### 3.1 Clone Repository

```bash
cd /opt/iskillbiz
git clone <your-repository-url> app
cd app
```

Or if you're uploading files manually:

```bash
# Create app directory
mkdir -p /opt/iskillbiz/app
# Upload your files here using SCP or SFTP
```

### 3.2 Setup Environment Variables

#### Frontend Environment

```bash
cd /opt/iskillbiz/app
cp .env.production.example .env.production
nano .env.production
```

Fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_API_URL=https://inbox.iskillbiz.com
NODE_ENV=production
```

**⚠️ สำคัญ:** `NEXT_PUBLIC_API_URL` ต้องไม่มี `/api` ต่อท้าย เพราะโค้ดจะเพิ่ม `/api` ให้อัตโนมัติ

#### Backend Environment

```bash
cd /opt/iskillbiz/app/backend
cp .env.production.example .env.production
nano .env.production
```

Fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=your-random-secret-key-minimum-32-characters-long
NESTJS_PORT=3001
FRONTEND_URL=https://inbox.iskillbiz.com
NODE_ENV=production
```

**Important:** Generate a secure JWT_SECRET:

```bash
openssl rand -base64 32
```

## Step 4: Deploy Application

### 4.1 Make Scripts Executable

```bash
cd /opt/iskillbiz/app
chmod +x deploy.sh health-check.sh
```

### 4.2 Run Deployment

```bash
./deploy.sh
```

This will:
- Build Docker images
- Start all containers
- Run health checks
- Show container status

### 4.3 Verify Deployment

```bash
# Check container status
docker compose ps

# Check logs
docker compose logs -f

# Run health checks
./health-check.sh
```

## Step 5: Verify Application

### 5.1 Test Locally on Server

```bash
# Test frontend
curl http://localhost:3000

# Test backend
curl http://localhost:3001/api/sections

# Test nginx
curl http://localhost/health
curl http://localhost/api/sections
```

### 5.2 Test from Browser

1. Open `http://inbox.iskillbiz.com` (should redirect to HTTPS)
2. Open `https://inbox.iskillbiz.com`
3. Test admin login: `https://inbox.iskillbiz.com/admin/login`

## Step 6: SSL Configuration (Optional)

If you want to use Let's Encrypt SSL directly on the server (instead of Cloudflare):

### 6.1 Install Certbot

```bash
apt install certbot python3-certbot-nginx -y
```

### 6.2 Get Certificate

```bash
certbot --nginx -d inbox.iskillbiz.com
```

### 6.3 Update Nginx Configuration

The certificate will be automatically configured. Update `nginx/nginx.conf` to use the certificates:

```nginx
ssl_certificate /etc/letsencrypt/live/inbox.iskillbiz.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/inbox.iskillbiz.com/privkey.pem;
```

Then restart nginx:

```bash
docker compose restart nginx
```

## Maintenance

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f nginx
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart frontend
docker compose restart backend
docker compose restart nginx
```

### Update Application

```bash
cd /opt/iskillbiz/app
git pull  # or upload new files
./deploy.sh
```

### Stop Services

```bash
docker compose down
```

### Start Services

```bash
docker compose up -d
```

## Troubleshooting

### Containers Not Starting

```bash
# Check logs
docker compose logs

# Check container status
docker compose ps

# Check Docker system
docker system df
docker system prune  # Clean up if needed
```

### Port Already in Use

```bash
# Check what's using the port
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# Stop conflicting services
systemctl stop apache2  # if Apache is running
systemctl stop nginx    # if system nginx is running
```

### Environment Variables Not Loading

```bash
# Verify files exist
ls -la .env.production
ls -la backend/.env.production

# Check if variables are loaded
docker compose config
```

### Database Connection Issues

- Verify Supabase credentials in `.env.production` files
- Check Supabase project is active
- Verify network connectivity: `curl https://your-project-id.supabase.co`

### Nginx Routing Issues

```bash
# Test nginx configuration
docker exec iskillbiz-nginx nginx -t

# Check nginx logs
docker compose logs nginx
```

## Security Best Practices

1. **Keep system updated:**
   ```bash
   apt update && apt upgrade -y
   ```

2. **Use strong passwords** for SSH and JWT_SECRET

3. **Regular backups** of environment files:
   ```bash
   cp .env.production .env.production.backup
   cp backend/.env.production backend/.env.production.backup
   ```

4. **Monitor logs** regularly:
   ```bash
   docker compose logs --tail=100
   ```

5. **Keep Docker updated:**
   ```bash
   apt update && apt install docker-ce docker-ce-cli containerd.io -y
   ```

## Support

If you encounter issues:

1. Check logs: `docker compose logs -f`
2. Verify environment variables
3. Check Cloudflare DNS settings
4. Verify Supabase connection
5. Check firewall rules: `ufw status`

## Quick Reference

```bash
# Navigate to app directory
cd /opt/iskillbiz/app

# Deploy
./deploy.sh

# Health check
./health-check.sh

# View logs
docker compose logs -f

# Restart
docker compose restart

# Stop
docker compose down

# Start
docker compose up -d
```

