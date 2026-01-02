import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// Initialize database schema
export async function GET() {
  try {
    // Create blogs table
    await sql`
      CREATE TABLE IF NOT EXISTS blogs (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        title_part1 VARCHAR(255) NOT NULL,
        title_part2 VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        read_time VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(500) NOT NULL,
        color VARCHAR(20) NOT NULL CHECK (color IN ('blue', 'pink', 'green')),
        content TEXT,
        pdf_path VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Add pdf_path column if it doesn't exist (for existing databases)
    await sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'blogs' AND column_name = 'pdf_path'
        ) THEN
          ALTER TABLE blogs ADD COLUMN pdf_path VARCHAR(500);
        END IF;
      END $$;
    `;

    // Create index for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC)
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Database schema initialized successfully' 
    });
  } catch (error: any) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: error.message },
      { status: 500 }
    );
  }
}

