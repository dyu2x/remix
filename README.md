# Remix1 + MariaDB on Ubuntu (Docker Compose)

This package is a deployment scaffold for `https://github.com/dyu2x/remix1` with MariaDB.

## Important notes

- The GitHub repository's exact framework version, scripts, and database layer have not been verified in this environment. The included Dockerfile assumes `package.json` has `build` and `start` scripts and that the app listens on port `3000`. Check `app/package.json` and adjust `app/Dockerfile.mesina` if necessary.
- `/connect/admin` is treated as an application URL path. Docker Compose cannot create that route by itself. The Remix repository must implement it, or you must add a route in the app. If `/connect/admin` is actually a separate backend service, that service needs its own container and API configuration.
- A browser frontend must not connect directly to MariaDB. The Remix server-side code should query MariaDB and expose the necessary data/actions through server routes or API endpoints.
- `DATABASE_URL` and common `DB_*` variables are supplied to the app. The app's code must use one of these variables and have a compatible MariaDB/MySQL driver/ORM configured.
- MariaDB is not published on the Ubuntu host; only the app port is exposed.

## Requirements

- Ubuntu Server 22.04 or 24.04 (64-bit)
- A user with `sudo`
- Internet access from the server
- A DNS name and TLS reverse proxy for public production use (recommended)

## Install Docker Engine and Compose plugin

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo docker run --rm hello-world
docker compose version
```

If your account cannot run Docker without `sudo`, prefix Docker commands below with `sudo`. You may optionally add your user to the `docker` group, but membership effectively grants root-level control:
```bash
sudo usermod -aG docker "$USER"
# Log out and back in before using Docker without sudo.
```

## Deploy the app

Copy this package onto Ubuntu, then run:

```bash
cd remix1-mariadb-ubuntu
cp .env.example .env
nano .env
```

Replace both passwords with different long random values. Keep `.env` private; do not commit it to Git.

Then run:
```bash
chmod +x deploy.sh
./deploy.sh
```

The script clones `dyu2x/remix1` into `app/`, adds a separate deployment Dockerfile, builds the image, and starts the app and MariaDB.

Open:
- Main site: `http://SERVER_IP:3000/`
- Admin route (only if the app implements it): `http://SERVER_IP:3000/connect/admin`

For a different port, change `APP_PORT` in `.env`, then run `docker compose up -d`.

## Check and manage services

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f mariadb
docker compose restart app
docker compose down
```

`docker compose down` does not delete the named database volume. **Do not use `docker compose down -v` unless you intend to delete the database data.**

## MariaDB connection details for the app

Inside Docker, use:
- Host: `mariadb`
- Port: `3306`
- Database: value of `MARIADB_DATABASE`
- Username: value of `MARIADB_USER`
- Password: value of `MARIADB_PASSWORD`

Use `DATABASE_URL` or the `DB_*` variables in server-side code. Do not put database credentials in browser-side JavaScript or public environment variables.

## Firewall

If you use UFW and want to test directly over port 3000:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 3000/tcp
sudo ufw status
```
For production, prefer a reverse proxy such as Caddy or Nginx with HTTPS and expose only ports 80/443 publicly. Do not open port 3306.

## Back up and restore MariaDB

Back up:
```bash
mkdir -p backups
docker compose exec -T mariadb mariadb-dump -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE" > "backups/remix1-$(date +%F-%H%M).sql"
```

Compose does not automatically load `.env` variables into your shell, so if the command above has empty variables, use:
```bash
set -a
. ./.env
set +a
docker compose exec -T mariadb mariadb-dump -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE" > "backups/remix1-$(date +%F-%H%M).sql"
```

Restore (replace `backup.sql` with the backup filename):
```bash
set -a
. ./.env
set +a
cat backups/backup.sql | docker compose exec -T mariadb mariadb -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE"
```

## First-run database initialization

Put `.sql` files in `db/init/` before the first launch. MariaDB executes them only when the database volume is initialized for the first time. For later schema changes, use the project's migration system or apply SQL manually.

## Troubleshooting

- **Build fails at `npm run build` or `npm run start`:** inspect `app/package.json`. Update `app/Dockerfile.mesina` to match the repo's actual package manager and scripts.
- **App cannot connect to database:** verify the code uses `DATABASE_URL` or `DB_HOST=mariadb`; `localhost` inside the app container refers to the app container, not MariaDB.
- **`/connect/admin` returns 404:** that route is not present in the Remix app yet; add the route in the repository. Compose does not generate app routes.
- **Port conflict:** change `APP_PORT` in `.env`.
- **Database already initialized with old credentials:** changing `.env` does not change users inside an existing database volume. Update the DB user manually or back up data and deliberately reinitialize the volume.

## Production checklist

- Use strong, unique passwords and keep `.env` out of version control.
- Add HTTPS using a reverse proxy and a real domain.
- Configure application-level authentication and authorization for `/connect/admin`.
- Confirm that the app's DB schema, migrations, and ORM/driver are configured for MariaDB.
- Keep Ubuntu, Docker images, and dependencies patched; back up and test restores regularly.
