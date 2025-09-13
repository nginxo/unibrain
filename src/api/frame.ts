import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle frame interactions
    const { untrustedData, trustedData } = body;
    
    if (untrustedData?.buttonIndex === 1) {
      // Handle launch frame action
      return NextResponse.json({
        type: 'frame',
        image: 'https://your-app-domain.com/hero-image.png',
        buttons: [
          {
            label: 'Launch App',
            action: 'launch_frame',
            target: 'https://your-app-domain.com'
          }
        ]
      });
    }
    
    // Default response
    return NextResponse.json({
      type: 'frame',
      image: 'https://your-app-domain.com/hero-image.png',
      buttons: [
        {
          label: 'Launch App',
          action: 'launch_frame',
          target: 'https://your-app-domain.com'
        }
      ]
    });
    
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
