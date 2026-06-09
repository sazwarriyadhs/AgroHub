import { NextResponse } from 'next/server';

const GO_BACKEND_URL = 'http://localhost:8900';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('Proxying login request to Go backend:', { email });

    // ✅ PERBAIKI: Hanya satu /api
    const response = await fetch(`${GO_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Go backend response:', data);

    if (response.ok && data.message === 'Login berhasil') {
      const token = data.data?.access_token;
      const userData = data.user;
      const userRole = userData?.role || userData?.user_type || 'superadmin';
      
      return NextResponse.json({
        success: true,
        token: token,
        user: {
          id: userData?.id,
          name: userData?.name || 'Super Admin',
          fullname: userData?.name || 'Super Admin',
          email: userData?.email || email,
          role: userRole,
          isAdmin: true
        }
      });
    } else {
      return NextResponse.json(
        { error: data.message || data.error || 'Login failed' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Proxy login error:', error);
    return NextResponse.json(
      { error: 'Cannot connect to backend server. Make sure Go backend is running on port 8900' },
      { status: 500 }
    );
  }
}