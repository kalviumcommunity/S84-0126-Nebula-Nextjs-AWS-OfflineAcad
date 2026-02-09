# Database Configuration and Management

This guide outlines the database architecture, configuration procedures, and migration workflows for the OfflineAcademy platform.

## Architecture Overview

The platform utilizes a PostgreSQL database hosted on Neon Serverless, managed via Prisma ORM. The schema is designed to support role-based access control and persistent user progress tracking.

### Technology Stack

- **Database Engine**: PostgreSQL 16 (via Neon Serverless)
- **ORM**: Prisma 6
- **Schema Management**: Prisma Migrate
- **Connection Pooling**: PgBouncer (configured via connection string)

## Configuration

Database connection parameters are managed through environment variables. The application requires a valid connection string in the `.env` file.

### Environment Variable Format

```bash
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

Ensure that `sslmode=require` is appended to the connection string to enforce secure connections.

## Schema Design

The database schema implements a simplified role-based access control system with two primary user roles.

### User Roles

The `Role` enum defines access levels within the application:

```prisma
enum Role {
  STUDENT
  ADMIN
}
```

- **STUDENT**: Standard access level. Can browse courses, enroll, and track lesson progress.
- **ADMIN**: Elevated privileges. Can create courses, manage curriculum content, and view system-wide analytics.

**Note**: The legacy `TEACHER` role has been deprecated and removed from the schema to streamline the permission model.

## Migration Workflow

Schema changes are version-controlled and applied using Prisma Migrate.

### Development Migrations

To apply pending schema changes to your local or development database:

1. Ensure the database instance is active.
2. Execute the migration command:

```bash
npx prisma migrate dev
```

This command will:
- Replay the migration history on the shadow database.
- Apply pending migrations to the development database.
- Generate the Prisma Client artifacts.

### Prototyping Changes

For rapid iteration without generating migration history files, use the push command:

```bash
npx prisma db push
```

**Warning**: This command may lead to data loss if schema changes are destructive. Use with caution in production environments.

## Verification

To verify the database connection and schema integrity after setup:

1. Launch Prisma Studio to inspect the data model visually:

```bash
npx prisma studio
```

2. Access the studio interface at `http://localhost:5555`.
3. Confirm that the `User`, `Course`, and `Lesson` tables are accessible and reflect the current schema.

## Troubleshooting

### Connection Timeouts

Neon Serverless databases may enter a suspended state after periods of inactivity to conserve resources. If connection errors occur:

1. Access the Neon Console to manually wake the instance.
2. Wait approximately 30-60 seconds for the instance to initialize.
3. Retry the operation.

### SSL/TLS Errors

Ensure the connection string includes `sslmode=require`. Neon requires encrypted connections for all database access.
