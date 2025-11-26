import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function CategoryNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="hand-drawn mb-6 text-5xl md:text-6xl font-bold text-black">
            Category Not Found
          </h1>
          <p className="mb-8 text-lg md:text-xl font-bold text-gray-700 max-w-2xl mx-auto">
            The category you're looking for doesn't exist. Check out our available categories below!
          </p>
          <Link
            href="/category"
            className="hand-drawn inline-block rounded-lg border-2 border-black bg-yellow-400 px-8 py-4 text-lg font-bold text-black transition hover:bg-yellow-500 hover:scale-105 active:scale-95"
          >
            Browse All Categories
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

