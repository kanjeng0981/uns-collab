import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-red-700">UNS</span>
          <span className="text-xl font-bold text-blue-900">Collab</span>
        </div>
        <ul className="flex gap-6 list-none">
          <li><Link href="/" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">Home</Link></li>
          <li><Link href="/projects/create" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">Buat Project</Link></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Temukan Rekan Untuk Berbagai<br />Kebutuhan Akademikmu
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Wadah kolaborasi aman & terstruktur untuk mahasiswa aktif Universitas Sebelas Maret
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/projects/create" 
            className="inline-block w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            Cari Partner Sekarang
          </Link>
          
          <a 
            href="#browse" 
            className="inline-block w-full sm:w-auto px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors text-center"
          >
            Lihat Project
          </a>
        </div>

        {/* Project Grid - DATA NYA DARI DATABASE */}
        <div id="browse" className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="font-bold text-lg text-gray-800 truncate">{project.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
                <p className="text-sm text-gray-600 mt-1">Kategori: {project.category}</p>
                <p className="text-sm text-gray-600">Deadline: {new Date(project.end_date).toLocaleDateString()}</p>
                
                {/* TOMBOL LIHAT DETAIL - DIPAKAI <a> TAG */}
                <a 
                  href={`/projects/${project.id}`} 
                  className="mt-4 inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  Lihat Details
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">Belum ada project. Jadilah yang pertama!</p>
              <Link href="/projects/create" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Buat Project Pertama
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
