import { Metadata } from 'next';
import ProfilePageContent from '@/components/profile/ProfilePageContent';

export const metadata: Metadata = {
  title: 'My Profile | Inventagious',
  description: 'View and edit your Inventagious profile',
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}

