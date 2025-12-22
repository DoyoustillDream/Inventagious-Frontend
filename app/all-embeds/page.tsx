'use client';

import { useState, useEffect } from 'react';

interface EmbedConfig {
  id: string;
  name: string;
  type: string;
  params: Record<string, string>;
  description: string;
}

export default function AllEmbedsPage() {
  const [baseUrl, setBaseUrl] = useState('');
  const [embeds, setEmbeds] = useState<EmbedConfig[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get base URL from window location
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    // Initialize all embed configurations
    const allEmbeds: EmbedConfig[] = [
      {
        id: 'homepage',
        name: 'Homepage',
        type: 'homepage',
        params: {
          type: 'homepage',
          title: 'Inventagious',
          description: 'A revolutionary crowdfunding & private fundraising platform for Inventors & Innovators in Web3 & Worldwide using Solana blockchain.',
        },
        description: 'Main landing page embed',
      },
      {
        id: 'profile-1',
        name: 'Profile - Juan',
        type: 'profile',
        params: {
          type: 'profile',
          displayName: 'Juan',
          username: 'juan',
          description: 'just doing some coding and supervising',
          followers: '0',
          following: '0',
          projects: '0',
        },
        description: 'User profile page embed - Juan from inventagious.com/u/juan',
      },
      {
        id: 'category-tech',
        name: 'Category - Technology',
        type: 'category',
        params: {
          type: 'category',
          title: 'Technology',
          description: 'Discover cutting-edge technology projects and innovations',
          category: 'Technology',
        },
        description: 'Category page embed',
      },
      {
        id: 'category-art',
        name: 'Category - Art & Design',
        type: 'category',
        params: {
          type: 'category',
          title: 'Art & Design',
          description: 'Explore creative projects and artistic innovations',
          category: 'Art',
        },
        description: 'Category page embed',
      },
      {
        id: 'campaign-1',
        name: 'Campaign - AI Assistant',
        type: 'campaign',
        params: {
          type: 'campaign',
          title: 'AI-Powered Personal Assistant',
          description: 'Revolutionary AI assistant that helps you manage your daily tasks and boost productivity',
          amountRaised: '45230',
          fundingGoal: '100000',
          category: 'Technology',
        },
        description: 'Campaign/Project page embed',
      },
      {
        id: 'campaign-2',
        name: 'Campaign - NFT Marketplace',
        type: 'campaign',
        params: {
          type: 'campaign',
          title: 'Decentralized NFT Marketplace',
          description: 'A new generation NFT marketplace built on Solana with zero transaction fees',
          amountRaised: '78500',
          fundingGoal: '150000',
          category: 'Web3',
        },
        description: 'Campaign/Project page embed with different data',
      },
      {
        id: 'deal-1',
        name: 'Deal - Startup Investment',
        type: 'deal',
        params: {
          type: 'deal',
          title: 'Early Stage Startup Investment Opportunity',
          description: 'Join exclusive private funding round for innovative blockchain startup',
          amountRaised: '250000',
          fundingGoal: '500000',
          category: 'Finance',
        },
        description: 'Deal page embed',
      },
      {
        id: 'default-1',
        name: 'Default - About Page',
        type: 'default',
        params: {
          type: 'default',
          title: 'About Inventagious',
          description: 'Learn more about our mission to revolutionize crowdfunding through blockchain technology',
        },
        description: 'Default page embed',
      },
      {
        id: 'default-2',
        name: 'Default - Contact Page',
        type: 'default',
        params: {
          type: 'default',
          title: 'Contact Us',
          description: 'Get in touch with our team for support, partnerships, or inquiries',
        },
        description: 'Default page embed',
      },
    ];

    setEmbeds(allEmbeds);
  }, []);

  const buildOGUrl = (params: Record<string, string>) => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlParams.set(key, encodeURIComponent(value));
      }
    });
    // Add baseUrl so backend can fetch assets correctly
    if (baseUrl) {
      urlParams.set('baseUrl', encodeURIComponent(baseUrl));
    }
    // Add timestamp for cache busting
    urlParams.set('t', Date.now().toString());
    
    return `/api/og?${urlParams.toString()}`;
  };

  const getPageUrl = (embed: EmbedConfig) => {
    if (!baseUrl) return '';
    
    switch (embed.type) {
      case 'profile':
        return `${baseUrl}/u/${embed.params.username}`;
      case 'category':
        return `${baseUrl}/category/${embed.params.category?.toLowerCase().replace(/\s+/g, '-')}`;
      case 'campaign':
      case 'deal':
        return `${baseUrl}/${embed.type === 'deal' ? 'deals' : 'campaigns'}/example-slug`;
      case 'homepage':
        return baseUrl;
      default:
        return `${baseUrl}/${embed.params.title?.toLowerCase().replace(/\s+/g, '-')}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">All Embeds Preview</h1>
          <p className="text-gray-400">Preview how all Open Graph embeds look when shared on Discord/Twitter</p>
          <p className="text-gray-500 text-sm mt-2">
            Note: Profile embeds use example data. Visit <code className="bg-gray-800 px-2 py-1 rounded">/u/username</code> to see actual profile OG images with real avatars and banners.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {embeds.map((embed) => {
            const ogUrl = buildOGUrl(embed.params);
            const pageUrl = getPageUrl(embed);

            return (
              <div key={embed.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{embed.name}</h2>
                      <p className="text-sm text-gray-800">{embed.description}</p>
                    </div>
                    <div className="text-xs text-gray-900 bg-white/20 px-3 py-1 rounded">
                      Type: {embed.type}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Embed Previews */}
                    <div className="space-y-4">
                      {/* Discord Embed Preview */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">Discord Embed</h3>
                        <div className="bg-[#36393f] p-4 rounded-lg">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold flex-shrink-0">
                              {(embed.params.displayName || embed.params.title || 'I')[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-semibold">
                                  {embed.params.displayName || embed.params.title || 'Inventagious'}
                                </span>
                                <span className="text-gray-400 text-xs">
                                  Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="text-gray-300 break-words">
                                Check out: <a href={pageUrl} className="text-[#00aff4] hover:underline">{pageUrl}</a>
                              </div>
                            </div>
                          </div>
                          
                          {/* Embed Card with Title, Description, and Image */}
                          <div className="bg-[#2f3136] border-l-4 border-yellow-400 rounded-r overflow-hidden ml-12">
                            {/* Title and Description */}
                            <div className="p-3">
                              {(embed.params.title || embed.params.displayName) && (
                                <div className="mb-1">
                                  <span className="text-white font-semibold text-base">
                                    {embed.params.title || embed.params.displayName}
                                  </span>
                                </div>
                              )}
                              {embed.params.description && (
                                <div className="mb-2">
                                  <span className="text-gray-300 text-sm line-clamp-2">
                                    {embed.params.description}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 mt-2">
                                <span className="text-gray-400 text-xs">
                                  inventagious.com
                                </span>
                              </div>
                            </div>
                            
                            {/* Image */}
                            <div className="w-full aspect-[1.91/1] relative overflow-hidden bg-gray-800">
                              {imageErrors[`${embed.id}-discord`] ? (
                                <div className="w-full h-full flex items-center justify-center p-4">
                                  <div className="text-center">
                                    <p className="text-red-400 text-sm font-semibold mb-1">❌ Image Failed to Load</p>
                                    <p className="text-gray-400 text-xs mb-2">OG Image generation error</p>
                                    {errorMessages[`${embed.id}-discord`] && (
                                      <p className="text-red-300 text-xs break-all">{errorMessages[`${embed.id}-discord`]}</p>
                                    )}
                                    <p className="text-gray-500 text-xs mt-2 break-all">URL: {ogUrl}</p>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={ogUrl}
                                  alt={`${embed.name} Preview`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    const errorMsg = target.src ? `Failed to load: ${target.src.substring(0, 100)}...` : 'Unknown error';
                                    setImageErrors(prev => ({ ...prev, [`${embed.id}-discord`]: true }));
                                    setErrorMessages(prev => ({ ...prev, [`${embed.id}-discord`]: errorMsg }));
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Twitter Card Preview */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">Twitter Card</h3>
                        <div className="bg-gray-700 border border-gray-600 rounded-lg overflow-hidden shadow-sm">
                          {/* Image */}
                          <div className="w-full aspect-[1.91/1] relative overflow-hidden bg-gray-800">
                            {imageErrors[`${embed.id}-twitter`] ? (
                              <div className="w-full h-full flex items-center justify-center p-4">
                                <div className="text-center">
                                  <p className="text-red-400 text-sm font-semibold mb-1">❌ Image Failed to Load</p>
                                  <p className="text-gray-400 text-xs mb-2">OG Image generation error</p>
                                  {errorMessages[`${embed.id}-twitter`] && (
                                    <p className="text-red-300 text-xs break-all">{errorMessages[`${embed.id}-twitter`]}</p>
                                  )}
                                  <p className="text-gray-500 text-xs mt-2 break-all">URL: {ogUrl}</p>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={ogUrl}
                                alt={`${embed.name} Preview`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  const errorMsg = target.src ? `Failed to load: ${target.src.substring(0, 100)}...` : 'Unknown error';
                                  setImageErrors(prev => ({ ...prev, [`${embed.id}-twitter`]: true }));
                                  setErrorMessages(prev => ({ ...prev, [`${embed.id}-twitter`]: errorMsg }));
                                }}
                              />
                            )}
                          </div>
                          {/* Title, Description, and Site */}
                          <div className="p-4 bg-gray-800">
                            {(embed.params.title || embed.params.displayName) && (
                              <div className="mb-2">
                                <span className="text-white font-bold text-lg">
                                  {embed.params.title || embed.params.displayName}
                                </span>
                              </div>
                            )}
                            {embed.params.description && (
                              <div className="mb-2">
                                <span className="text-gray-300 text-sm line-clamp-2">
                                  {embed.params.description}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="text-gray-400 text-xs">
                                inventagious.com
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Raw OG Image */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">OG Image (1200x630)</h3>
                        <div className="border-2 border-gray-600 rounded-lg overflow-hidden bg-gray-800">
                          {imageErrors[`${embed.id}-og`] ? (
                            <div className="w-full aspect-[1.91/1] flex items-center justify-center p-8 bg-gray-900">
                              <div className="text-center max-w-md">
                                <p className="text-red-400 text-lg font-semibold mb-2">❌ Image Failed to Load</p>
                                <p className="text-gray-400 text-sm mb-2">OG Image generation error</p>
                                {errorMessages[`${embed.id}-og`] && (
                                  <p className="text-red-300 text-xs mb-2 break-all bg-gray-800 p-2 rounded">{errorMessages[`${embed.id}-og`]}</p>
                                )}
                                <p className="text-gray-500 text-xs break-all">URL: {ogUrl}</p>
                                <button
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(ogUrl);
                                      const text = await response.text();
                                      setErrorMessages(prev => ({ 
                                        ...prev, 
                                        [`${embed.id}-og`]: `Status: ${response.status} ${response.statusText}\nResponse: ${text.substring(0, 200)}` 
                                      }));
                                    } catch (err: any) {
                                      setErrorMessages(prev => ({ 
                                        ...prev, 
                                        [`${embed.id}-og`]: `Fetch error: ${err.message}` 
                                      }));
                                    }
                                  }}
                                  className="mt-2 px-3 py-1 bg-yellow-400 text-gray-900 text-xs rounded hover:bg-yellow-500"
                                >
                                  Check Error Details
                                </button>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={ogUrl}
                              alt={`${embed.name} OG Image`}
                              className="w-full h-auto"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const errorMsg = target.src ? `Failed to load: ${target.src.substring(0, 100)}...` : 'Unknown error';
                                setImageErrors(prev => ({ ...prev, [`${embed.id}-og`]: true }));
                                setErrorMessages(prev => ({ ...prev, [`${embed.id}-og`]: errorMsg }));
                              }}
                            />
                          )}
                        </div>
                        <div className="mt-2 flex gap-2 text-xs">
                          <a
                            href={ogUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            Open in new tab →
                          </a>
                          <span className="text-gray-500">|</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(ogUrl)}
                            className="text-blue-400 hover:underline"
                          >
                            Copy URL
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">Page URL</h3>
                        <div className="bg-gray-900 p-3 rounded-md">
                          <code className="text-xs break-all text-gray-300">{pageUrl || 'N/A'}</code>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">OG Image URL</h3>
                        <div className="bg-gray-900 p-3 rounded-md">
                          <code className="text-xs break-all text-gray-300">{ogUrl}</code>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">Parameters</h3>
                        <div className="bg-gray-900 p-3 rounded-md">
                          <pre className="text-xs text-gray-300 overflow-auto max-h-64">
                            {JSON.stringify(embed.params, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center space-y-4">
          <button
            onClick={() => {
              setImageErrors({});
              setErrorMessages({});
              window.location.reload();
            }}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-md transition-colors"
          >
            Refresh All Embeds
          </button>
          
          {/* Backend Connection Test */}
          <div className="mt-4">
            <button
              onClick={async () => {
                try {
                  const testUrl = '/api/og?type=default&title=Test';
                  const response = await fetch(testUrl);
                  const contentType = response.headers.get('content-type');
                  const status = response.status;
                  
                  if (status === 200 && contentType?.includes('image')) {
                    alert(`✅ Backend is working!\nStatus: ${status}\nContent-Type: ${contentType}`);
                  } else {
                    const text = await response.text();
                    alert(`❌ Backend error!\nStatus: ${status}\nResponse: ${text.substring(0, 200)}`);
                  }
                } catch (err: any) {
                  alert(`❌ Connection failed!\nError: ${err.message}\n\nMake sure backend is running on port 3001`);
                }
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg"
            >
              Test Backend Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

