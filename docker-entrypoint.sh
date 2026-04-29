#!/bin/sh
# If SSL certs don't exist yet, use the HTTP-only init config
CERT_PATH="/etc/letsencrypt/live/site.acreedconsulting.com/fullchain.pem"

if [ ! -f "$CERT_PATH" ]; then
    echo "SSL certificate not found — starting in HTTP-only mode"
    cp /etc/nginx/nginx-init.conf /etc/nginx/conf.d/default.conf
else
    echo "SSL certificate found — starting in HTTPS mode"
    cp /etc/nginx/nginx-ssl.conf /etc/nginx/conf.d/default.conf
fi

exec nginx -g 'daemon off;'
