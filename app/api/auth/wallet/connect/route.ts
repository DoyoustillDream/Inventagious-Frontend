import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const backendUrl = `${BACKEND_URL}/auth/wallet/connect`;
    console.log(`[API Route] Proxying wallet connect to ${backendUrl}`);
    console.log(`[API Route] Request body:`, JSON.stringify(body, null, 2));
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward any authorization headers
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!,
        }),
      },
      body: JSON.stringify(body),
    });

    console.log(`[API Route] Backend response status: ${response.status} ${response.statusText}`);
    console.log(`[API Route] Backend response headers:`, Object.fromEntries(response.headers.entries()));

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log(`[API Route] Backend response text:`, text);
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || 'Unknown error' };
      }
    }

    console.log(`[API Route] Returning response with status ${response.status}:`, data);
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[API Route] Error proxying wallet connect request:', error);
    console.error('[API Route] Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to connect wallet', details: error.toString() },
      { status: 500 }
    );
  }
}

