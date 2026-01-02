import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    // First, try to fetch from YouTube Data API v3 if API key is available
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (apiKey) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`
        );

        if (response.ok) {
          const data = await response.json();
          
          if (data.items && data.items[0] && data.items[0].snippet) {
            const description = data.items[0].snippet.description;
            return NextResponse.json({ description });
          }
        }
      } catch (apiError) {
        console.error('YouTube API error:', apiError);
      }
    }

    // Fallback: Try to fetch from YouTube page (alternative method)
    // This is a workaround when API key is not available
    try {
      const pageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (pageResponse.ok) {
        const html = await pageResponse.text();
        // Try to extract description from meta tags
        const metaDescriptionMatch = html.match(/<meta name="description" content="([^"]+)">/);
        if (metaDescriptionMatch && metaDescriptionMatch[1]) {
          return NextResponse.json({ description: metaDescriptionMatch[1] });
        }
        
        // Try alternative meta tag format
        const ogDescriptionMatch = html.match(/<meta property="og:description" content="([^"]+)">/);
        if (ogDescriptionMatch && ogDescriptionMatch[1]) {
          return NextResponse.json({ description: ogDescriptionMatch[1] });
        }
      }
    } catch (pageError) {
      console.error('Error fetching YouTube page:', pageError);
    }

    return NextResponse.json({ description: null });
  } catch (error) {
    console.error('Error fetching YouTube description:', error);
    return NextResponse.json({ description: null, error: 'Failed to fetch description' }, { status: 200 });
  }
}

