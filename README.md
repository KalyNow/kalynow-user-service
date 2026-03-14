# kalynow-user-service

User and subscription microservice (NestJS + Prisma + PostgreSQL).

## Run in dev mode (single container)

### Prerequisites

- Docker & Docker Compose
- A running PostgreSQL instance (e.g. from `kalyNow-infra`)

### 1. Start the database

```bash
cd ../kalyNow-infra
docker compose up -d postgres
```

### 2. Configure environment

```bash
cp .env.example .env
```

Set at minimum:

```env
DATABASE_URL=postgresql://kalyNow:changeme@localhost:5432/kalyNow
JWT_SECRET=your_secret
```

### 3. Build and run the container

```bash
docker build -t kalynow-user-service .
docker run --rm -it \
  --env-file .env \
  --network host \
  -p 3000:3000 \
  kalynow-user-service
```

> `--network host` lets the container reach the local PostgreSQL instance directly.

### 4. Run migrations

On first start, apply Prisma migrations:

```bash
docker run --rm --env-file .env kalynow-user-service npx prisma migrate deploy
```

### API

The service is available at `http://localhost:3000`.  
Swagger docs: `http://localhost:3000/api`.

---

### Without Docker (local)

```bash
npm install
npx prisma migrate dev
npm run start:dev
```
