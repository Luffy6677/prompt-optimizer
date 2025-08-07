# Database Setup

This project now has a proper database connection and migration system set up using Knex.js with PostgreSQL.

## Configuration

1. Set up your database connection in `.env`:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/prompt_optimizer_dev
   ```

   For Supabase users, you can get the connection string from your Supabase project settings.

2. The database configuration is defined in:
   - `knexfile.js` - Main Knex configuration
   - `server/config/database.js` - Database connection module

## Running Migrations

1. Run all pending migrations:
   ```bash
   npm run migrate
   ```

2. Check migration status:
   ```bash
   npm run migrate:status
   ```

3. Rollback last batch of migrations:
   ```bash
   npm run migrate:rollback
   ```

4. Create a new migration:
   ```bash
   npm run migrate:make migration_name
   ```

## Database Tables

### favorites
- Stores user favorite optimized prompts
- Fields: id, user_id, original_prompt, optimized_prompt, strategy, scores, analysis, created_at

### optimization_history
- Stores all prompt optimization history
- Fields: id, user_id, original_prompt, optimized_prompt, strategy, scores, analysis, alternatives, created_at

## Seeds

To create seed data:
```bash
npm run seed:make seed_name
```

To run seeds:
```bash
npm run seed
```

## Integration

The database connection is automatically initialized when the server starts. Check the server logs for connection status.
