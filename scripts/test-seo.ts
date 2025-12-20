/**
 * SEO Testing Script
 * Tests SEO configuration, sitemap, robots.txt, and metadata before deployment
 * 
 * Usage:
 *   npm run test:seo
 *   or
 *   yarn test:seo
 */

import { siteConfig, defaultMetadata } from '../lib/seo/config';
import { readFileSync } from 'fs';
import { join } from 'path';

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

function testSiteConfig() {
  console.log('\n📋 Testing Site Configuration...\n');
  
  // Test URL format
  if (!siteConfig.url.startsWith('http')) {
    addResult('Site URL Format', false, 'Site URL must start with http:// or https://', siteConfig.url);
  } else {
    addResult('Site URL Format', true, 'Site URL is valid', siteConfig.url);
  }
  
  // Test required fields
  const requiredFields = ['name', 'title', 'description', 'url', 'domain'];
  requiredFields.forEach(field => {
    const value = (siteConfig as any)[field];
    if (!value || value.trim() === '') {
      addResult(`Site Config: ${field}`, false, `${field} is required but is empty`);
    } else {
      addResult(`Site Config: ${field}`, true, `${field} is set`, value);
    }
  });
  
  // Test description length
  if (siteConfig.description.length < 120) {
    addResult('Description Length', false, 'Description should be at least 120 characters for better SEO', `Current: ${siteConfig.description.length} chars`);
  } else if (siteConfig.description.length > 160) {
    addResult('Description Length', false, 'Description should be max 160 characters', `Current: ${siteConfig.description.length} chars`);
  } else {
    addResult('Description Length', true, 'Description length is optimal', `${siteConfig.description.length} characters`);
  }
  
  // Test keywords
  if (siteConfig.keywords.length < 5) {
    addResult('Keywords Count', false, 'Should have at least 5 keywords', `Current: ${siteConfig.keywords.length}`);
  } else {
    addResult('Keywords Count', true, 'Keywords are set', `${siteConfig.keywords.length} keywords`);
  }
}

function testMetadata() {
  console.log('\n📄 Testing Metadata Configuration...\n');
  
  // Test metadataBase
  if (defaultMetadata.metadataBase) {
    addResult('Metadata Base URL', true, 'metadataBase is set', defaultMetadata.metadataBase.toString());
  } else {
    addResult('Metadata Base URL', false, 'metadataBase is missing');
  }
  
  // Test title
  if (defaultMetadata.title?.default) {
    addResult('Metadata Title', true, 'Title is set', defaultMetadata.title.default);
  } else {
    addResult('Metadata Title', false, 'Title is missing');
  }
  
  // Test description
  if (defaultMetadata.description) {
    addResult('Metadata Description', true, 'Description is set');
  } else {
    addResult('Metadata Description', false, 'Description is missing');
  }
  
  // Test Open Graph
  if (defaultMetadata.openGraph) {
    addResult('Open Graph Config', true, 'Open Graph is configured');
    if (defaultMetadata.openGraph.images && defaultMetadata.openGraph.images.length > 0) {
      addResult('Open Graph Images', true, 'OG images are set', `${defaultMetadata.openGraph.images.length} image(s)`);
    } else {
      addResult('Open Graph Images', false, 'OG images are missing');
    }
  } else {
    addResult('Open Graph Config', false, 'Open Graph is missing');
  }
  
  // Test Twitter Card
  if (defaultMetadata.twitter) {
    addResult('Twitter Card Config', true, 'Twitter Card is configured');
  } else {
    addResult('Twitter Card Config', false, 'Twitter Card is missing');
  }
  
  // Test Robots
  if (defaultMetadata.robots) {
    if (defaultMetadata.robots.index && defaultMetadata.robots.follow) {
      addResult('Robots Indexing', true, 'Robots allow indexing and following');
    } else {
      addResult('Robots Indexing', false, 'Robots may block indexing');
    }
  } else {
    addResult('Robots Config', false, 'Robots configuration is missing');
  }
  
  // Test Sitemap Reference
  if (defaultMetadata.alternates?.types?.['application/xml']) {
    const sitemapUrl = defaultMetadata.alternates.types['application/xml'];
    if (sitemapUrl.includes('sitemap.xml')) {
      addResult('Sitemap Reference', true, 'Sitemap is referenced in metadata', sitemapUrl);
    } else {
      addResult('Sitemap Reference', false, 'Sitemap URL format is incorrect', sitemapUrl);
    }
  } else {
    addResult('Sitemap Reference', false, 'Sitemap is not referenced in metadata alternates');
  }
}

function testSitemapStructure() {
  console.log('\n🗺️  Testing Sitemap Structure...\n');
  
  try {
    const sitemapPath = join(process.cwd(), 'app', 'sitemap.ts');
    const sitemapContent = readFileSync(sitemapPath, 'utf-8');
    
    // Check if sitemap exports default function
    if (sitemapContent.includes('export default')) {
      addResult('Sitemap Export', true, 'Sitemap exports default function');
    } else {
      addResult('Sitemap Export', false, 'Sitemap does not export default function');
    }
    
    // Check if sitemap uses MetadataRoute.Sitemap
    if (sitemapContent.includes('MetadataRoute.Sitemap')) {
      addResult('Sitemap Type', true, 'Sitemap uses correct Next.js type');
    } else {
      addResult('Sitemap Type', false, 'Sitemap may not use correct type');
    }
    
    // Check if sitemap includes static routes
    const staticRoutes = ['/projects', '/campaigns', '/deals', '/about'];
    staticRoutes.forEach(route => {
      if (sitemapContent.includes(route)) {
        addResult(`Sitemap: ${route}`, true, `Route ${route} is included`);
      } else {
        addResult(`Sitemap: ${route}`, false, `Route ${route} is missing`);
      }
    });
    
    // Check if sitemap handles errors
    if (sitemapContent.includes('try') && sitemapContent.includes('catch')) {
      addResult('Sitemap Error Handling', true, 'Sitemap has error handling');
    } else {
      addResult('Sitemap Error Handling', false, 'Sitemap may lack error handling');
    }
    
  } catch (error) {
    addResult('Sitemap File', false, 'Could not read sitemap.ts file', (error as Error).message);
  }
}

function testRobotsStructure() {
  console.log('\n🤖 Testing Robots.txt Structure...\n');
  
  try {
    const robotsPath = join(process.cwd(), 'app', 'robots.ts');
    const robotsContent = readFileSync(robotsPath, 'utf-8');
    
    // Check if robots exports default function
    if (robotsContent.includes('export default')) {
      addResult('Robots Export', true, 'Robots exports default function');
    } else {
      addResult('Robots Export', false, 'Robots does not export default function');
    }
    
    // Check if robots includes sitemap reference
    if (robotsContent.includes('sitemap')) {
      addResult('Robots Sitemap Reference', true, 'Robots.txt references sitemap');
    } else {
      addResult('Robots Sitemap Reference', false, 'Robots.txt does not reference sitemap');
    }
    
    // Check if robots has rules
    if (robotsContent.includes('rules')) {
      addResult('Robots Rules', true, 'Robots.txt has rules defined');
    } else {
      addResult('Robots Rules', false, 'Robots.txt has no rules');
    }
    
    // Check if robots allows Googlebot
    if (robotsContent.includes('Googlebot')) {
      addResult('Robots Googlebot', true, 'Robots.txt has Googlebot rules');
    } else {
      addResult('Robots Googlebot', false, 'Robots.txt may not have Googlebot rules');
    }
    
  } catch (error) {
    addResult('Robots File', false, 'Could not read robots.ts file', (error as Error).message);
  }
}

function testStructuredData() {
  console.log('\n📊 Testing Structured Data...\n');
  
  try {
    const structuredDataPath = join(process.cwd(), 'lib', 'seo', 'structured-data.tsx');
    const structuredDataContent = readFileSync(structuredDataPath, 'utf-8');
    
    // Check for required schemas
    const requiredSchemas = ['OrganizationSchema', 'WebsiteSchema', 'WebPageSchema'];
    requiredSchemas.forEach(schema => {
      if (structuredDataContent.includes(schema)) {
        addResult(`Schema: ${schema}`, true, `${schema} is defined`);
      } else {
        addResult(`Schema: ${schema}`, false, `${schema} is missing`);
      }
    });
    
    // Check for JSON-LD format
    if (structuredDataContent.includes('application/ld+json')) {
      addResult('JSON-LD Format', true, 'Structured data uses JSON-LD format');
    } else {
      addResult('JSON-LD Format', false, 'Structured data may not use JSON-LD');
    }
    
    // Check for schema.org context
    if (structuredDataContent.includes('schema.org')) {
      addResult('Schema.org Context', true, 'Uses schema.org context');
    } else {
      addResult('Schema.org Context', false, 'May not use schema.org context');
    }
    
  } catch (error) {
    addResult('Structured Data File', false, 'Could not read structured-data.tsx', (error as Error).message);
  }
}

function printResults() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 SEO TEST RESULTS');
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
    process.exit(1);
  } else {
    console.log('✅ All SEO tests passed!\n');
    process.exit(0);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting SEO Tests...\n');
  
  testSiteConfig();
  testMetadata();
  testSitemapStructure();
  testRobotsStructure();
  testStructuredData();
  
  printResults();
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});

export { runTests, testSiteConfig, testMetadata, testSitemapStructure, testRobotsStructure, testStructuredData };

