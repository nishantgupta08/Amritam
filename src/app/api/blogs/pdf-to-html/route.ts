import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { pdfUrl } = await request.json();

    if (!pdfUrl) {
      return NextResponse.json({ error: 'PDF URL is required' }, { status: 400 });
    }

    // Fetch the PDF file
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 400 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamically import pdf-parse to avoid bundling issues
    const pdfModule = await import('pdf-parse');
    const pdf = (pdfModule as any).default || pdfModule;
    
    // Parse PDF
    const data = await pdf(buffer);

    // Convert PDF text to HTML
    // Split by pages and format
    const pages = data.text.split(/\f/); // Form feed character separates pages
    let htmlContent = '';

    pages.forEach((pageText: string, index: number) => {
      if (pageText.trim()) {
        // Split into paragraphs (double newlines)
        const paragraphs = pageText.split(/\n\s*\n/).filter((p: string) => p.trim());
        
        paragraphs.forEach((paragraph: string) => {
          const lines = paragraph.split('\n').filter((l: string) => l.trim());
          const formattedParagraph = lines.join(' ').trim();
          
          if (formattedParagraph) {
            // Escape HTML special characters
            const escapedParagraph = formattedParagraph
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
            
            // Check if it looks like a heading (short, all caps, or ends with colon)
            if (formattedParagraph.length < 100 && 
                (formattedParagraph === formattedParagraph.toUpperCase() || 
                 formattedParagraph.endsWith(':'))) {
              htmlContent += `<h3 class="text-2xl font-bold text-gray-900 mb-4 mt-6">${escapedParagraph.replace(':', '')}</h3>\n`;
            } else {
              htmlContent += `<p class="text-gray-700 leading-relaxed mb-4">${escapedParagraph}</p>\n`;
            }
          }
        });
      }
    });

    // If no structured content, just wrap all text
    if (!htmlContent) {
      const text = data.text.replace(/\f/g, '\n\n'); // Replace form feeds with double newlines
      const paragraphs = text.split(/\n\s*\n/).filter((p: string) => p.trim());
      
      paragraphs.forEach((paragraph: string) => {
        const cleanParagraph = paragraph.trim().replace(/\n/g, ' ');
        if (cleanParagraph) {
          // Escape HTML special characters
          const escapedParagraph = cleanParagraph
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
          htmlContent += `<p class="text-gray-700 leading-relaxed mb-4">${escapedParagraph}</p>\n`;
        }
      });
    }

    return NextResponse.json({
      success: true,
      html: htmlContent,
      pageCount: data.numpages,
      info: {
        title: data.info?.Title || '',
        author: data.info?.Author || '',
        subject: data.info?.Subject || '',
      }
    });
  } catch (error: any) {
    console.error('Error converting PDF to HTML:', error);
    return NextResponse.json(
      { error: 'Failed to convert PDF to HTML', details: error.message },
      { status: 500 }
    );
  }
}

