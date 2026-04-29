#!/bin/bash
# init-ssl.sh — First-time SSL setup for site.acreedconsulting.com
# Run this ONCE on the server after DNS is pointing to the server IP.

set -e

DOMAIN="site.acreedconsulting.com"
EMAIL="${ADMIN_EMAIL:-admin@acreedconsulting.com}"

echo "=== Acreed Consulting — SSL Initialization ==="
echo "Domain: $DOMAIN"
echo "Email:  $EMAIL"
echo ""

# Step 1: Use the init nginx config (HTTP only, no SSL)
echo "[1/4] Switching to HTTP-only nginx config..."
cp nginx-init.conf nginx-active.conf

# Step 2: Start frontend + api with init config
echo "[2/4] Starting services with HTTP-only config..."
docker compose up -d frontend api

# Wait for nginx to be ready
sleep 5

# Step 3: Request certificate
echo "[3/4] Requesting SSL certificate from Let's Encrypt..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

# Step 4: Switch to full SSL nginx config and restart
echo "[4/4] Switching to full HTTPS config..."
docker compose down

# Start all services with the real nginx.conf (which includes SSL)
docker compose up -d

echo ""
echo "=== Done! ==="
echo "Site available at: https://$DOMAIN"
echo ""
echo "SSL auto-renewal is handled by the certbot container."
