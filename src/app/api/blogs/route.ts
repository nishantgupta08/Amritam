import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Fetch all blogs
export async function GET() {
  try {
    const blogs = await sql`
      SELECT 
        id,
        title,
        title_part1 as "titlePart1",
        title_part2 as "titlePart2",
        category,
        read_time as "readTime",
        description,
        image,
        color,
        content,
        pdf_path as "pdfPath",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM blogs
      ORDER BY created_at DESC
    `;

    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new blog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = `blog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const result = await sql`
      INSERT INTO blogs (
        id, title, title_part1, title_part2, category, read_time, 
        description, image, color, content, pdf_path, created_at, updated_at
      )
      VALUES (
        ${id},
        ${body.title},
        ${body.titlePart1},
        ${body.titlePart2},
        ${body.category},
        ${body.readTime},
        ${body.description},
        ${body.image},
        ${body.color},
        ${body.content || null},
        ${body.pdfPath || null},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING 
        id,
        title,
        title_part1 as "titlePart1",
        title_part2 as "titlePart2",
        category,
        read_time as "readTime",
        description,
        image,
        color,
        content,
        pdf_path as "pdfPath",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog', details: error.message },
      { status: 500 }
    );
  }
}

