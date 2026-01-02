import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminToken = process.env.ADMIN_TOKEN || 'admin123'; // Fallback for development

    if (password === adminToken) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

