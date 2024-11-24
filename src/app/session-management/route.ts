// app/api/login/route.js
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { id_user } = await request.json();

  // Validar las credenciales del usuario (esto es solo un ejemplo)
  if (id_user) {
    // Generar un valor de sesión (puede ser un JWT o un identificador único)
    const sessionValue = id_user; // Reemplaza esto con un token real

    // Establecer la cookie de sesión
    const response = NextResponse.json({ message: 'Inicio de sesión exitoso' });

    response.cookies.set('session', sessionValue, {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // 30 días
      sameSite: 'lax',
      //secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } else {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }
}
