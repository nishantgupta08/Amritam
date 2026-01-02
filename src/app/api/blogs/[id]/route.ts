import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Fetch single blog by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await sql`
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
      WHERE id = ${params.id}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update blog
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Check if blog exists
    const existing = await sql`
      SELECT id FROM blogs WHERE id = ${params.id}
    `;

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Update blog
    const result = await sql`
      UPDATE blogs
      SET 
        title = ${body.title},
        title_part1 = ${body.titlePart1},
        title_part2 = ${body.titlePart2},
        category = ${body.category},
        read_time = ${body.readTime},
        description = ${body.description},
        image = ${body.image},
        color = ${body.color},
        content = ${body.content || null},
        pdf_path = ${body.pdfPath || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
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

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if blog exists
    const existing = await sql`
      SELECT id FROM blogs WHERE id = ${params.id}
    `;

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Delete blog
    await sql`
      DELETE FROM blogs WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog', details: error.message },
      { status: 500 }
    );
  }
}

