import { Metadata } from 'next';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ProfilePageContent from '@/components/profile/ProfilePageContent';

export const metadata: Metadata = {
  title: 'My Profile | Inventagious',
  description: 'View and edit your Inventagious profile',
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ProfilePageContent />
      </main>
      <Footer />
    </div>
  );
}

