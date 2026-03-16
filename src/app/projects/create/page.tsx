'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CreateProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'skripsi',
    deadline: '',
    max_members: 5,
    wa_link: ''
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('projects').insert([{
        title: formData.title,
        description: formData.description,
        category: formData.category,
        end_date: formData.deadline,
        max_members: formData.max_members,
        wa_link: `https://wa.me/${formData.wa_link}`,
        created_at: new Date().toISOString()
      }])

      if (error) throw error

      alert('✅ Proyek berhasil dibuat!')
      router.push('/')
    } catch (err) {
      console.error('Error:', err)
      alert('❌ Gagal membuat proyek. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <button 
          onClick={() => router.back()} 
          className="text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2"
        >
          ← Kembali
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Buat Project Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Judul */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Proyek *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              placeholder="Contoh: Riset AI untuk Skripsi"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Detail *
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              placeholder="Jelaskan kebutuhan proyek Anda..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
            />
          </div>

          {/* Kategori */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="skripsi">Skripsi / Tesis</option>
              <option value="kelas">Proyek Kelas</option>
              <option value="komunitas">Komunitas / Event</option>
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Deadline Pengumpulan *
            </label>
            <input
              type="date"
              id="deadline"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Jumlah Anggota */}
          <div>
            <label htmlFor="max_members" className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Anggota Tim *
            </label>
            <input
              type="number"
              id="max_members"
              min="1"
              max="20"
              defaultValue={5}
              onChange={(e) => setFormData({...formData, max_members: parseInt(e.target.value)})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* WhatsApp Link */}
          <div>
            <label htmlFor="wa_link" className="block text-sm font-medium text-gray-700 mb-2">
              Nomor WhatsApp *
            </label>
            <p className="text-xs text-gray-500 mb-2">Format hanya angka tanpa spasi/hook (+62)</p>
            <input
              type="tel"
              id="wa_link"
              value={formData.wa_link}
              onChange={(e) => setFormData({...formData, wa_link: e.target.value.replace(/[^0-9]/g, '')})}
              required
              placeholder="628123456789"
              pattern="^(\+?62)?[0-9]{9,13}$"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 text-white font-semibold rounded-md transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Membuat...' : 'Buat Sekarang'}
          </button>
        </form>
      </div>
    </div>
  )
}
