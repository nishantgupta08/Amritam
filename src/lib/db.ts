import { neon } from '@neondatabase/serverless';

// Get the database connection string from environment variables
const sql = neon(process.env.DATABASE_URL!);

export { sql };

