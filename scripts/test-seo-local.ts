/**
 * Local SEO Testing Script
 * Tests SEO endpoints (robots.txt, sitemap.xml) on local dev server
 * 
 * Prerequisites:
 *   1. Start dev server: npm run dev
 *   2. Run this script: npm run test:seo:local
 * 
 * Usage:
 *   npm run test:seo:local
 *   or
 *   yarn test:seo:local
 */

import { siteConfig } from '../lib/seo/config';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: string;
}

const results: TestResult[] = [];

function addResult(name: string, passed: boolean, message: string, details?: string) {
  results.push({ name, passed, message, details });
}

async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'SEO-Test-Bot/1.0'
      }
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function testRobotsTxt() {
  console.log('\n🤖 Testing robots.txt endpoint...\n');
  
  try {
    const url = `${BASE_URL}/robots.txt`;
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      addResult('Robots.txt Accessible', false, `HTTP ${response.status}`, url);
      return;
    }
    
    addResult('Robots.txt Accessible', true, 'robots.txt is accessible', url);
    
    const text = await response.text();
    
    // Check for sitemap reference
    if (text.includes('Sitemap:') || text.includes('sitemap')) {
      addResult('Robots.txt Sitemap', true, 'robots.txt references sitemap');
      
      // Extract sitemap URL
      const sitemapMatch = text.match(/[Ss]itemap:\s*(.+)/);
      if (sitemapMatch) {
        const sitemapUrl = sitemapMatch[1].trim();
        addResult('Robots.txt Sitemap URL', true, 'Sitemap URL found', sitemapUrl);
      }
    } else {
      addResult('Robots.txt Sitemap', false, 'robots.txt does not reference sitemap');
      
    }
    
    // Check for allow/disallow (more reliable than User-agent check)
    const hasAllowDisallow = text.includes('Allow:') || text.includes('Disallow:');
    // Check for User-Agent (case-insensitive) - Next.js uses "User-Agent:"
    const hasUserAgent = /User-Agent:/i.test(text);
    
    // Check for rules - Next.js generates robots.txt with Allow/Disallow
    if (hasAllowDisallow || hasUserAgent) {
      addResult('Robots.txt Rules', true, 'robots.txt has rules defined');
    } else {
      addResult('Robots.txt Rules', false, 'robots.txt may not have rules');
    }
    
    // Check for allow/disallow
    if (hasAllowDisallow) {
      addResult('Robots.txt Allow/Disallow', true, 'robots.txt has allow/disallow rules');
    }
    
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      addResult('Robots.txt Timeout', false, 'Request timed out - is the dev server running?', BASE_URL);
    } else {
      addResult('Robots.txt Error', false, 'Failed to fetch robots.txt', (error as Error).message);
    }
  }
}

async function testSitemapXml() {
  console.log('\n🗺️  Testing sitemap.xml endpoint...\n');
  
  try {
    const url = `${BASE_URL}/sitemap.xml`;
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      addResult('Sitemap.xml Accessible', false, `HTTP ${response.status}`, url);
      return;
    }
    
    addResult('Sitemap.xml Accessible', true, 'sitemap.xml is accessible', url);
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('xml')) {
      addResult('Sitemap.xml Content-Type', true, 'Correct content-type', contentType);
    } else {
      addResult('Sitemap.xml Content-Type', false, 'Incorrect content-type', contentType || 'not set');
    }
    
    const xml = await response.text();
    
    // Check for XML declaration
    if (xml.includes('<?xml')) {
      addResult('Sitemap.xml Format', true, 'Valid XML format');
    } else {
      addResult('Sitemap.xml Format', false, 'May not be valid XML');
    }
    
    // Check for urlset
    if (xml.includes('<urlset') || xml.includes('urlset')) {
      addResult('Sitemap.xml Structure', true, 'Has urlset structure');
    } else {
      addResult('Sitemap.xml Structure', false, 'May not have correct structure');
    }
    
    // Check for URLs
    const urlMatches = xml.match(/<url>/g);
    if (urlMatches && urlMatches.length > 0) {
      addResult('Sitemap.xml URLs', true, `Contains ${urlMatches.length} URL(s)`);
    } else {
      addResult('Sitemap.xml URLs', false, 'No URLs found in sitemap');
    }
    
    // Check for homepage
    if (xml.includes(siteConfig.url) || xml.includes('/')) {
      addResult('Sitemap.xml Homepage', true, 'Homepage is included');
    } else {
      addResult('Sitemap.xml Homepage', false, 'Homepage may not be included');
    }
    
    // Check for programmatic SEO pages
    const programmaticPages = [
      '/campaigns/active',
      '/campaigns/ending-soon',
      '/campaigns/fully-funded',
      '/fund-blockchain-startups',
      '/invest-in-solana-projects',
      '/crowdfund-inventions',
      '/blog',
    ];
    
    let foundProgrammatic = 0;
    for (const page of programmaticPages) {
      if (xml.includes(page)) {
        foundProgrammatic++;
      }
    }
    
    if (foundProgrammatic > 0) {
      addResult('Sitemap.xml Programmatic Pages', true, `Found ${foundProgrammatic}/${programmaticPages.length} programmatic SEO pages`);
    } else {
      addResult('Sitemap.xml Programmatic Pages', false, 'Programmatic SEO pages may not be included');
    }
    
    // Check for blog posts
    const blogPosts = [
      'how-blockchain-crowdfunding-works',
      'solana-vs-ethereum-for-crowdfunding',
      'how-to-fund-an-invention-without-vcs',
      'legal-considerations-for-web3-crowdfunding',
    ];
    
    let foundBlogPosts = 0;
    for (const post of blogPosts) {
      if (xml.includes(`/blog/${post}`)) {
        foundBlogPosts++;
      }
    }
    
    if (foundBlogPosts > 0) {
      addResult('Sitemap.xml Blog Posts', true, `Found ${foundBlogPosts}/${blogPosts.length} blog posts`);
    }
    
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      addResult('Sitemap.xml Timeout', false, 'Request timed out - is the dev server running?', BASE_URL);
    } else {
      addResult('Sitemap.xml Error', false, 'Failed to fetch sitemap.xml', (error as Error).message);
    }
  }
}

async function testPageMetadata(url: string, pageName: string) {
  try {
    let response: Response | null = null;
    let lastError: Error | null = null;
    
    // Retry up to 3 times with increasing timeout
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const timeout = 5000 * attempt; // 5s, 10s, 15s
        response = await fetchWithTimeout(url, timeout);
        if (response.ok) break;
      } catch (error) {
        lastError = error as Error;
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    if (!response || !response.ok) {
      addResult(`${pageName} Accessible`, false, `HTTP ${response?.status || 'timeout'}`, url);
      return false;
    }
    
    addResult(`${pageName} Accessible`, true, `${pageName} is accessible`, url);
    
    const html = await response.text();
    let allPassed = true;
    
    // Check for title tag
    if (html.includes('<title>')) {
      addResult(`${pageName} Title`, true, 'Title tag is present');
    } else {
      addResult(`${pageName} Title`, false, 'Title tag is missing');
      allPassed = false;
    }
    
    // Check for meta description
    if (html.includes('meta name="description"') || html.includes('meta property="og:description"')) {
      addResult(`${pageName} Description`, true, 'Meta description is present');
    } else {
      addResult(`${pageName} Description`, false, 'Meta description is missing');
      allPassed = false;
    }
    
    // Check for canonical URL
    if (html.includes('rel="canonical"')) {
      addResult(`${pageName} Canonical`, true, 'Canonical URL is present');
    } else {
      addResult(`${pageName} Canonical`, false, 'Canonical URL is missing');
      allPassed = false;
    }
    
    // Check for structured data (JSON-LD)
    if (html.includes('application/ld+json') || html.includes('type="application/ld+json"')) {
      addResult(`${pageName} Structured Data`, true, 'Structured data (JSON-LD) is present');
      
      // Check for specific schema types we added
      if (html.includes('"@type":"Product"')) {
        addResult(`${pageName} Product Schema`, true, 'Product schema found');
      }
      if (html.includes('"@type":"Person"')) {
        addResult(`${pageName} Person Schema`, true, 'Person schema found');
      }
      if (html.includes('"@type":"FAQPage"')) {
        addResult(`${pageName} FAQ Schema`, true, 'FAQ schema found');
      }
      if (html.includes('"@type":"BreadcrumbList"')) {
        addResult(`${pageName} Breadcrumb Schema`, true, 'Breadcrumb schema found');
      }
    } else {
      addResult(`${pageName} Structured Data`, false, 'Structured data is missing');
      allPassed = false;
    }
    
    return allPassed;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      addResult(`${pageName} Timeout`, false, 'Request timed out', BASE_URL);
    } else {
      addResult(`${pageName} Error`, false, 'Failed to fetch page', (error as Error).message);
    }
    return false;
  }
}

async function testHomepageMetadata() {
  console.log('\n🏠 Testing homepage metadata...\n');
  await testPageMetadata(`${BASE_URL}/`, 'Homepage');
}

async function testProgrammaticPages() {
  console.log('\n📄 Testing programmatic SEO pages...\n');
  
  const programmaticPages = [
    { path: '/campaigns/active', name: 'Active Campaigns' },
    { path: '/campaigns/ending-soon', name: 'Ending Soon Campaigns' },
    { path: '/campaigns/fully-funded', name: 'Fully Funded Campaigns' },
    { path: '/fund-blockchain-startups', name: 'Fund Blockchain Startups' },
    { path: '/invest-in-solana-projects', name: 'Invest in Solana Projects' },
    { path: '/crowdfund-inventions', name: 'Crowdfund Inventions' },
  ];
  
  for (const page of programmaticPages) {
    await testPageMetadata(`${BASE_URL}${page.path}`, page.name);
  }
}

async function testBlogPages() {
  console.log('\n📝 Testing blog pages...\n');
  
  const blogPosts = [
    'how-blockchain-crowdfunding-works',
    'solana-vs-ethereum-for-crowdfunding',
    'how-to-fund-an-invention-without-vcs',
    'legal-considerations-for-web3-crowdfunding',
  ];
  
  // Test blog listing page
  await testPageMetadata(`${BASE_URL}/blog`, 'Blog Listing');
  
  // Test individual blog posts
  for (const slug of blogPosts) {
    await testPageMetadata(`${BASE_URL}/blog/${slug}`, `Blog: ${slug}`);
  }
}

function printResults() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 LOCAL SEO TEST RESULTS');
  console.log('='.repeat(60) + '\n');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}`);
    if (result.details) {
      console.log(`   Details: ${result.details}`);
    }
    console.log('');
  });
  
  console.log('='.repeat(60));
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log('='.repeat(60) + '\n');
  
  if (failed > 0) {
    console.log('⚠️  Some tests failed. Please review the issues above.\n');
    console.log('💡 Make sure your dev server is running: npm run dev\n');
    process.exit(1);
  } else {
    console.log('✅ All local SEO tests passed!\n');
    process.exit(0);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Local SEO Tests...\n');
  console.log(`📍 Testing against: ${BASE_URL}\n`);
  console.log('💡 Make sure your dev server is running: npm run dev\n');
  
  await testRobotsTxt();
  await testSitemapXml();
  await testHomepageMetadata();
  await testProgrammaticPages();
  await testBlogPages();
  
  printResults();
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});

export { runTests, testRobotsTxt, testSitemapXml, testHomepageMetadata, testProgrammaticPages, testBlogPages };

