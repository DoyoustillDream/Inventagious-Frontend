'use client';

import { useState } from 'react';

export default function TestOGPage() {
  const [displayName, setDisplayName] = useState('Juan');
  const [username, setUsername] = useState('asfdasfdafsddasfd');
  const [bio, setBio] = useState('just doing some coding and supervising');
  const [followers, setFollowers] = useState('5');
  const [following, setFollowing] = useState('2');
  const [projects, setProjects] = useState('3');
  const [imageUrl, setImageUrl] = useState('');

  const buildOGUrl = () => {
    const params = new URLSearchParams({
      type: 'profile',
      displayName,
      username,
      description: bio,
      followers,
      following,
      projects,
    });
    if (imageUrl) {
      params.set('image', imageUrl);
    }
    // Add timestamp for cache busting
    params.set('t', Date.now().toString());
    
    return `/api/og?${params.toString()}`;
  };

  const ogUrl = buildOGUrl();
  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/u/${username}` : '';

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Embed Preview Tool</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Profile Data</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Followers</label>
                  <input
                    type="number"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Following</label>
                  <input
                    type="number"
                    value={following}
                    onChange={(e) => setFollowing(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Projects</label>
                  <input
                    type="number"
                    value={projects}
                    onChange={(e) => setProjects(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Avatar Image URL (optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <p className="text-sm font-medium mb-2">Profile URL:</p>
              <code className="text-xs break-all">{profileUrl}</code>
            </div>
          </div>
          
          {/* Embed Previews */}
          <div className="space-y-6">
            {/* Discord Embed Preview */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Discord Embed Preview</h2>
              
              <div className="bg-[#36393f] p-4 rounded-lg">
                {/* Message */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold flex-shrink-0">
                    {(displayName || username || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{displayName || username}</span>
                      <span className="text-gray-400 text-xs">Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="text-gray-300 break-words">
                      Check out my profile: <a href={profileUrl} className="text-[#00aff4] hover:underline">{profileUrl}</a>
                    </div>
                  </div>
                </div>
                
                {/* Embed Card - Just the image like Magic Eden */}
                <div className="bg-[#2f3136] border-l-4 border-yellow-400 rounded-r overflow-hidden ml-12">
                  {/* Image only - no text overlay */}
                  <div className="w-full aspect-[1.91/1] relative overflow-hidden">
                    <img
                      src={ogUrl}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Twitter Card Preview */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Twitter Card Preview</h2>
              
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                {/* Image only - no text overlay */}
                <div className="w-full aspect-[1.91/1] relative overflow-hidden">
                  <img
                    src={ogUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Raw OG Image */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">OG Image (1200x630)</h2>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={ogUrl}
                  alt="OG Image Preview"
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/og?type=default&title=Error%20Loading%20Image';
                  }}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href={ogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Open in new tab →
                </a>
                <span className="text-gray-400">|</span>
                <button
                  onClick={() => navigator.clipboard.writeText(ogUrl)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Copy URL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
