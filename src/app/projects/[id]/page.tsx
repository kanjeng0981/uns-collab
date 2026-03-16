'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Project tidak ditemukan</h2>
          <p className="text-gray-600 mb-4">{error || 'Maaf, project ini tidak tersedia atau sudah dihapus.'}</p>
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const extractWaNumber = (url: string | null) => {
    if (!url) return ''
    const match = url.match(/\/(\d{9,13})$/)
    return match ? match[1] : ''
  }

  const isDeadlineNear = () => {
    if (!project.end_date) return false
    const now = new Date()
    const deadline = new Date(project.end_date)
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24))
    return diffDays <= 7 && diffDays >= 0
  }

  const waLink = extractWaNumber(project.wa_link)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          ← Kembali
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{project.title}</h1>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">Kategori:</span> {project.category || '-'}
          </p>

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

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Deskripsi:</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-md leading-relaxed">
              {project.description || 'Tidak ada deskripsi tersedia.'}
            </p>
          </div>

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
                Chat via WhatsApp
              </a>
            ) : (
              <p className="text-sm text-red-600 font-medium">Nomor WhatsApp tidak tersedia di database.</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
            Dibuat pada {new Date(project.created_at || '').toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  )
}
