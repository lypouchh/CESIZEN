# TLS certificates for production nginx

Place your certificate files in this directory before starting `docker-compose.prod.yml`.

Required filenames:

- `fullchain.pem`
- `privkey.pem`

For local demonstration only, you can generate a self-signed certificate with:

```bash
openssl req -x509 -newkey rsa:2048 -sha256 -days 365 -nodes \
  -keyout backend/docker/nginx/ssl/privkey.pem \
  -out backend/docker/nginx/ssl/fullchain.pem \
  -subj "/CN=localhost"
```

Do not commit real private keys.
