import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { profileApi, Profile } from '@/lib/api/profile';
import PublicProfileContent from '@/components/profile/PublicProfileContent';
import { generateProfileMetadata, PersonSchema, WebPageSchema, BreadcrumbSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/seo';
import { normalizeUrl } from '@/lib/utils/url';

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

/**
 * Validates that a username is in a valid format
 */
function isValidUsername(username: string | undefined | null): username is string {
  if (!username) return false;
  const trimmed = username.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
}

/**
 * Fetches profile data by username
 */
async function fetchProfileByUsername(username: string): Promise<Profile | null> {
  try {
    const normalizedUsername = username.trim();
    const profile = await profileApi.getByUsername(normalizedUsername);
    return profile;
  } catch (error: any) {
    // Check if it's a 404 error
    if (error?.status === 404) {
      return null;
    }
    // Re-throw other errors
    throw error;
  }
}

export async function generateMetadata({ params }: PublicProfilePageProps): Promise<Metadata> {
  try {
    const { username } = await params;
    
    if (!isValidUsername(username)) {
      return {
        title: 'Profile Not Found | Inventagious',
        description: 'The requested profile could not be found.',
      };
    }

    const profile = await fetchProfileByUsername(username);

    if (!profile) {
      return {
        title: 'Profile Not Found | Inventagious',
        description: 'The requested profile could not be found.',
      };
    }

    // Fetch profile stats for richer embed
    let stats = { followers: 0, following: 0, projects: 0 };
    try {
      stats = await profileApi.getStats(username);
    } catch (error) {
      // If stats fail, continue with default values
      console.error('Error fetching profile stats:', error);
    }

    return generateProfileMetadata({
      profile: {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName || profile.username,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        coverImageUrl: profile.coverImageUrl,
      },
      stats,
      url: `/u/${profile.username}`,
    });
  } catch (error) {
    return {
      title: 'Profile | Inventagious',
      description: 'View profile on Inventagious',
    };
  }
}

/**
 * Main public profile page component
 */
export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  try {
    const { username } = await params;
    
    // Validate username format
    if (!isValidUsername(username)) {
      notFound();
    }
    
    // Fetch profile data
    const profile = await fetchProfileByUsername(username);
    
    // If profile not found, show 404
    if (!profile) {
      notFound();
    }

    const profileUrl = normalizeUrl(siteConfig.url, `/u/${profile.username}`);
    const sameAs = profile.socialHandles?.map(handle => handle.url).filter(Boolean) || [];
    if (profile.website) {
      sameAs.push(profile.website);
    }

    return (
      <>
        <WebPageSchema
          title={`${profile.displayName || profile.username} | Inventagious`}
          description={profile.bio || `View ${profile.displayName || profile.username}'s profile on Inventagious`}
          url={profileUrl}
        />
        <PersonSchema
          name={profile.displayName || profile.username}
          description={profile.bio}
          url={profileUrl}
          image={profile.avatarUrl}
          sameAs={sameAs.length > 0 ? sameAs : undefined}
          jobTitle={profile.type || 'Inventor'}
          worksFor={{
            name: siteConfig.name,
            url: siteConfig.url,
          }}
        />
        <BreadcrumbSchema
          items={[
            { name: 'Home', url: siteConfig.url },
            { name: 'Profiles', url: `${siteConfig.url}/explore` },
            { name: profile.displayName || profile.username, url: profileUrl },
          ]}
        />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="main-content" className="flex-1">
            <PublicProfileContent profile={profile} />
          </main>
          <Footer />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading public profile:', error);
    notFound();
  }
}

