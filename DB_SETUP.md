# Ashburn DCS Backend — MySQL / Sequelize

## Database name
`ashburndcs`

## Setup

1. Install MySQL and create the database:

```sql
CREATE DATABASE ashburndcs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copy `.env.example` → `.env` and set:

```
DB_NAME=ashburndcs
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

3. Install & migrate:

```bash
npm install
npm run db:migrate
npm run db:seed
```

4. Start server:

```bash
npm run dev
```

## Admin login (from seeder)
- Email: `admin@ashburn.com`
- Password: `Ashburn@123`

## Scripts
| Command | What it does |
|---------|----------------|
| `npm run db:migrate` | Create all tables |
| `npm run db:seed` | Seed admin + default courses |
| `npm run db:reset` | Undo all, migrate, seed again |
