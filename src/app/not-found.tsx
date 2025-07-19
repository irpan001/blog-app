// src/app/not-found.tsx
'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-10">
      <h1 className="text-5xl font-bold text-gray-800">404</h1>
      <p className="text-xl mt-4 text-gray-800">Halaman tidak ditemukan</p>
      <p className="text-gray-500 mb-6">Yah, URL yang kamu masukin nggak cocok sama halaman manapun</p>
      <Link href="/" className="text-blue-500 underline">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
