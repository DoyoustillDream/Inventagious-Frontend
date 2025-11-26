import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="browser-window max-w-2xl mx-auto text-center">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold text-center px-4">
                404
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-12">
              <div className="mb-6 text-6xl">💡</div>
              <h1 className="hand-drawn text-4xl font-bold text-black mb-4">
                Project Not Found
              </h1>
              <p className="text-lg font-semibold text-gray-700 mb-8">
                The project you're looking for doesn't exist or has been removed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/projects"
                  className="hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-8 py-3 text-base font-bold text-black transition-all duration-300 hover:bg-yellow-600 hover:scale-105 active:scale-95"
                >
                  Browse Projects
                </Link>
                <Link
                  href="/"
                  className="hand-drawn rounded-lg border-4 border-black bg-white px-8 py-3 text-base font-bold text-black transition-all duration-300 hover:bg-gray-100 hover:scale-105 active:scale-95"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

