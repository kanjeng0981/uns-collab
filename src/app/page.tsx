import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-red-700">UNS</span>
          <span className="text-xl font-bold text-blue-900">Collab</span>
        </div>
        <div className="gap-4">
          <Link href="/projects/create" className="text-gray-700 hover:text-blue-700 font-medium">
            Buat Project
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Temukan Rekan Untuk Berbagai Kebutuhan Akademikmu
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Wadah kolaborasi aman & terstruktur untuk mahasiswa aktif Universitas Sebelas Maret
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/projects/create" 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Cari Partner Sekarang
          </Link>
          
          <Link 
            href="#browse" 
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Lihat Project
          </Link>
        </div>

        {/* Project Grid Placeholder */}
        <div id="browse" className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800">Judul Proyek A</h3>
            <p className="text-sm text-gray-600 mt-2">Jurusan: Sistem Informasi</p>
            <p className="text-sm text-gray-600">Status: Open</p>
            <button className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium">Lihat Details</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800">Judul Proyek B</h3>
            <p className="text-sm text-gray-600 mt-2">Jurusan: Ekonomi</p>
            <p className="text-sm text-gray-600">Status: Open</p>
            <button className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium">Lihat Details</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800">Judul Proyek C</h3>
            <p className="text-sm text-gray-600 mt-2">Jurusan: Teknik Informatika</p>
            <p className="text-sm text-gray-600">Status: Full</p>
            <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium disabled" disabled>Lihat Details</button>
          </div>
        </div>
      </main>
    </div>
  )
}
