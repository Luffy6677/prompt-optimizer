import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.DATABASE_URL || 'postgresql://localhost/prompt_optimizer_dev',
      ssl: false
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './server/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './server/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './server/migrations',
      tableName: 'knex_migrations'
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.TEST_DATABASE_URL || 'postgresql://localhost/prompt_optimizer_test',
      ssl: false
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './server/migrations',
      tableName: 'knex_migrations'
    }
  }
};