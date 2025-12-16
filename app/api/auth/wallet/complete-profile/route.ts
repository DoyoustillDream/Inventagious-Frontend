import { NextRequest, NextResponse } from 'next/server';
import { normalizeUrl } from '@/lib/utils/url';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const url = normalizeUrl(BACKEND_URL, '/auth/wallet/complete-profile');
    const response = await fetch(url, {
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

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error proxying wallet complete-profile request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete wallet profile' },
      { status: 500 }
    );
  }
}

