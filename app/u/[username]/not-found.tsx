import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-white py-12">
        <div className="text-center px-4">
          <div className="browser-window max-w-md mx-auto">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
            </div>
            <div className="p-8">
              <h1 className="hand-drawn text-4xl md:text-5xl font-bold text-black mb-4">
                404
              </h1>
              <p className="text-lg font-semibold text-gray-700 mb-6">
                Profile not found
              </p>
              <p className="text-sm text-gray-600 mb-6">
                The profile you're looking for doesn't exist or has been removed.
              </p>
              <Link
                href="/"
                className="hand-drawn inline-block rounded-lg border-4 border-black bg-yellow-400 px-6 py-3 text-base font-bold text-black transition hover:bg-yellow-300 hover:scale-105 active:scale-95"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

