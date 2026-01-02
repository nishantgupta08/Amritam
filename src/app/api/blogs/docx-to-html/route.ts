import { NextResponse } from 'next/server';
import mammoth from 'mammoth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith('.docx') && !file.type.includes('wordprocessingml')) {
      return NextResponse.json({ error: 'Only .docx files are allowed' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert DOCX to HTML using Mammoth
    const result = await mammoth.convertToHtml({ buffer });

    return NextResponse.json({
      success: true,
      html: result.value,
      messages: result.messages, // Warnings or messages from conversion
    });
  } catch (error: any) {
    console.error('Error converting DOCX to HTML:', error);
    return NextResponse.json(
      { error: 'Failed to convert DOCX to HTML', details: error.message },
      { status: 500 }
    );
  }
}

