import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy endpoint for bot health check
 * This avoids CORS issues by proxying requests through Next.js
 */
export async function GET(request: NextRequest) {
  try {
    const botApiUrl = process.env.BOT_API_URL || process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:3004';
    
    // Remove trailing slash if present
    const normalizedUrl = botApiUrl.replace(/\/+$/, '');
    const healthUrl = `${normalizedUrl}/health`;
    
    // Fetch from bot API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Bot API returned an error', status: response.status },
          { status: response.status }
        );
      }
      
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Handle timeout or connection errors gracefully
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Bot API request timeout' },
          { status: 504 }
        );
      }
      
      // Connection refused or other network errors
      return NextResponse.json(
        { error: 'Bot API is not available', message: fetchError.message },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error('Error in bot health proxy:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}


