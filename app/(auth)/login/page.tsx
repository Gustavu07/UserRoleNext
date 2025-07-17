'use client';

import { useState } from 'react';
import Image from 'next/image';
import { logInAction } from '@/app/(auth)/auth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen bg-black">
      <Image
        src="/hangar.jpg"
        alt="Fondo aeronáutico"
        fill
        priority
        className="object-cover brightness-50"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center gap-4 mb-6">
            <Image src="/logo.png" alt="Logotipo Aerocentro" width={100} height={100} />
            <h1 className="text-2xl font-bold text-center">Bienvenido de vuelta</h1>
            <p className="text-sm text-gray-500 text-center">Ingresa tus credenciales para continuar</p>
          </div>

          <form action={logInAction} method="POST" className="space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-medium text-gray-700 block mb-1">
                Email
              </label>
              <div className="flex items-center border rounded-lg px-3 h-12 focus-within:ring-2 focus-within:ring-blue-500">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.1 0-9.3 1.6-9.3 4.8v1.5c0 .7.6 1.3 1.3 1.3h16c.7 0 1.3-.6 1.3-1.3v-1.5c0-3.2-6.2-4.8-9.3-4.8z" />
                </svg>
                <input
                  id="username"
                  name="username"
                  required
                  type="text"
                  placeholder="Ingrese su email o usuario"
                  className="ml-2 w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1">
                Contraseña
              </label>
              <div className="flex items-center border rounded-lg px-3 h-12 focus-within:ring-2 focus-within:ring-blue-500">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17a2 2 0 1 1 .001-3.999A2 2 0 0 1 12 17zm6-6V9a6 6 0 0 0-12 0v2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zm-8-2a4 4 0 0 1 8 0v2H10V9z" />
                </svg>

                <input
                  id="password"
                  name="password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="ml-2 flex-1 bg-transparent outline-none text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-2 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18m-6.586-6.586A4.5 4.5 0 0112 15.5a4.5 4.5 0 01-4.5-4.5 4.5 4.5 0 014.086-4.48M9.878 9.88a4.493 4.493 0 014.242 4.242M15 12c0-.993-.407-1.89-1.066-2.54M3.98 8.477a10.493 10.493 0 0116.04 0M3.98 15.523a10.493 10.493 0 0016.04 0" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.537 1.615-1.502 3.065-2.778 4.188M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-600" />
                Recordarme
              </label>
            </div>

            {/* Botón Login */}
            <button
              type="submit"
              className="w-full bg-black text-white rounded-lg h-12 font-medium hover:bg-gray-900 transition-colors"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}