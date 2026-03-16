'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Interface untuk mendefinisikan struktur data Project
interface ProjectData {
  id: string
  title: string
  description: string
  category: string | null
  end_date: string | null
  max_members: number | null
  wa_link: string | null
  created_at: string | null
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ambil data project dari Supabase saat komponen dimuat
  useEffect(() => {
    if (!params?.id) return
    
    const fetchProject = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', params.id)
          .single()

        if (dbError) throw dbError
        if (data) setProject(data as ProjectData)
      } catch (err: any) {
        console.error('Error fetching project:', err)
        setError(err.message || 'Gagal memuat data proyek')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProject()
  }, [params.id])

  // Tampilan saat loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data proyek...</p>
        </div>
      </div>
    )
  }

  // Tampilan jika project tidak ditemukan atau error
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Project tidak ditemukan</h2>
          <p className="text-gray-600 mb-4">Maaf, project ini tidak tersedia atau sudah dihapus.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    )
  }

  // Helper function untuk format tanggal Indonesia
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    })
  }

  // Helper function untuk extract nomor WA dari URL
  const extractWaNumber = (url: string | null) => {
    if (!url) return ''
    const match = url.match(/\/(\d{9,13})$/)
    return match ? match[1] : ''
  }

  const waLink = extractWaNumber(project.wa_link)
  
  // Cek apakah deadline sudah dekat (< 7 hari)
  const isDeadlineNear = () => {
    if (!project.end_date) return false
    const now = new Date()
    const deadline = new Date(project.end_date)
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24))
    return diffDays <= 7 && diffDays >= 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          ← Kembali
        </button>
        
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {/* Title & Category */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{project.title}</h1>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Kategori:</span> {project.category || '-'}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-md ${isDeadlineNear() ? 'bg-red-50 border border-red-200' : 'bg-blue-50'}`}>
              <h3 className={`font-semibold text-sm mb-1 ${isDeadlineNear() ? 'text-red-800' : 'text-blue-800'}`}>📅 Deadline:</h3>
              <p className={`${isDeadlineNear() ? 'text-red-700 font-bold' : 'text-gray-700 font-medium'}`}>{formatDate(project.end_date)}</p>
              {isDeadlineNear() && <p className="text-xs text-red-600 mt-1">⚠️ Deadline hampir tiba!</p>}
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <h3 className="font-semibold text-green-800 text-sm mb-1">👥 Max Anggota:</h3>
              <p className="text-gray-700 font-medium">{project.max_members || '-'} orang</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Deskripsi:</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-md leading-relaxed">
              {project.description || 'Tidak ada deskripsi tersedia.'}
            </p>
          </div>

          {/* WhatsApp CTA Section */}
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              💬 Hubungi Creator:
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Untuk bergabung atau tanya lebih lanjut mengenai proyek ini
            </p>
            
            {waLink ? (
              <a 
                href={`https://wa.me/${waLink}?text=Halo,%20saya%20tertarik%20ikut%20proyek%20ini`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-semibold shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                </svg>
                Chat via WhatsApp
              </a>
            ) : (
              <p className="text-sm text-red-600 font-medium">Nomor WhatsApp tidak tersedia di database.</p>
            )}
          </div>

          {/* Created At Info */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
            Dibuat pada {new Date(project.created_at || '').toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  )
}