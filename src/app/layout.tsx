'use client' // Tambahkan ini jika pakai hook/interactif
import { supabase } from '@/lib/supabase' // Atau '../../lib/supabase'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Nav Bar + Children */}
        {children}
      </body>
    </html>
  );
}
