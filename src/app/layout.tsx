'use client' // ← Tambahkan jika pake hook
import './globals.css' // ← WAJIB ADA INI DI BARIS TERATAS!
import type { Metadata } from 'next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children} {/* ⭐ WAJIB ADA INI */}
      </body>
    </html>
  );
}
