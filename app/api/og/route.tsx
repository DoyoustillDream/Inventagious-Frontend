import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Helper to truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'default';
    const title = decodeURIComponent(searchParams.get('title') || 'Inventagious');
    const description = decodeURIComponent(searchParams.get('description') || '');
    const image = searchParams.get('image') || '';
    const category = decodeURIComponent(searchParams.get('category') || '');
    const amountRaised = searchParams.get('amountRaised') || '';
    const fundingGoal = searchParams.get('fundingGoal') || '';
    const displayName = decodeURIComponent(searchParams.get('displayName') || '');
    const username = decodeURIComponent(searchParams.get('username') || '');

    // Truncate long text
    const truncatedTitle = truncateText(title, 80);
    const truncatedDescription = truncateText(description, 150);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fef3c7',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #fbbf24 2%, transparent 0%), radial-gradient(circle at 75px 75px, #facc15 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          position: 'relative',
        }}
      >
        {/* Background Pattern Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)',
          }}
        />

        {/* Main Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '80px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Image Section (if provided) */}
          {image && (
            <div
              style={{
                display: 'flex',
                marginBottom: '40px',
              }}
            >
              <img
                src={image}
                alt=""
                width={400}
                height={300}
                style={{
                  objectFit: 'cover',
                  borderRadius: '20px',
                  border: '8px solid #000',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                }}
              />
            </div>
          )}

          {/* Title Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            <h1
              style={{
                fontSize: truncatedTitle.length > 50 ? '56px' : '72px',
                fontWeight: 'bold',
                color: '#000',
                margin: 0,
                marginBottom: '20px',
                lineHeight: 1.2,
                maxWidth: '1000px',
                textShadow: '4px 4px 0px rgba(0, 0, 0, 0.1)',
              }}
            >
              {truncatedTitle}
            </h1>

            {/* Category Badge */}
            {category && (
              <div
                style={{
                  display: 'flex',
                  padding: '12px 24px',
                  backgroundColor: '#000',
                  color: '#facc15',
                  borderRadius: '8px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  border: '4px solid #000',
                }}
              >
                {category.toUpperCase()}
              </div>
            )}

            {/* Description */}
            {truncatedDescription && (
              <p
                style={{
                  fontSize: '32px',
                  color: '#1f2937',
                  margin: 0,
                  maxWidth: '900px',
                  lineHeight: 1.4,
                  fontWeight: 500,
                }}
              >
                {truncatedDescription}
              </p>
            )}

            {/* Funding Stats (for campaigns) */}
            {(amountRaised || fundingGoal) && (
              <div
                style={{
                  display: 'flex',
                  gap: '30px',
                  marginTop: '30px',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#000',
                }}
              >
                {amountRaised && (
                  <div>
                    <span style={{ color: '#059669' }}>{amountRaised} SOL</span>
                    {fundingGoal && <span> / {fundingGoal} SOL</span>}
                  </div>
                )}
              </div>
            )}

            {/* Profile Info (for profiles) */}
            {displayName && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                {username && (
                  <p
                    style={{
                      fontSize: '28px',
                      color: '#6b7280',
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    {`@${username}`}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Logo/Branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: 'auto',
              paddingTop: '40px',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#000',
                border: '4px solid #000',
                padding: '12px 32px',
                borderRadius: '8px',
                backgroundColor: '#facc15',
              }}
            >
              INVENTAGIOUS
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
  } catch (error: any) {
    console.error('Error generating OG image:', error);
    return new Response(`Failed to generate OG image: ${error.message}`, {
      status: 500,
    });
  }
}

