# SEO Google Testing Guide

Complete guide for testing your SEO implementation to ensure Google indexing.

## Quick Start

### 1. Run Local SEO Tests

```bash
# Terminal 1: Start your dev server
npm run dev

# Terminal 2: Run SEO tests
npm run test:seo:local
```

This will test:
- ✅ robots.txt accessibility and structure
- ✅ sitemap.xml format and content
- ✅ Homepage metadata (title, description, OG tags, structured data)
- ✅ All programmatic SEO pages (campaign states, investor intent pages)
- ✅ Blog pages and posts
- ✅ Structured data schemas (Product, Person, FAQ, Breadcrumb)

### 2. Check Test Results

The test script will show:
- ✅ Green checkmarks for passed tests
- ❌ Red X for failed tests
- Details about what was found/missing

**If tests pass:** Your SEO is properly configured! ✅

**If tests fail:** Fix the issues and run again.

## Testing for Google Indexing

### Step 1: Local Validation (Before Deploy)

1. **Run the test script:**
   ```bash
   npm run test:seo:local
   ```

2. **Manually check key pages:**
   ```bash
   # Check robots.txt
   curl http://localhost:3000/robots.txt
   
   # Check sitemap
   curl http://localhost:3000/sitemap.xml
   
   # Check homepage HTML
   curl http://localhost:3000/ | grep -i "title\|description\|canonical\|ld+json"
   ```

3. **Verify programmatic pages:**
   - http://localhost:3000/campaigns/active
   - http://localhost:3000/campaigns/ending-soon
   - http://localhost:3000/campaigns/fully-funded
   - http://localhost:3000/fund-blockchain-startups
   - http://localhost:3000/invest-in-solana-projects
   - http://localhost:3000/crowdfund-inventions
   - http://localhost:3000/blog

### Step 2: After Deploying to Production

#### A. Google Search Console Setup (REQUIRED)

1. **Verify your site:**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add property: `https://inventagious.com`
   - Choose verification method (HTML tag recommended)
   - Add verification code to `frontend/lib/seo/config.ts`:
     ```typescript
     googleSiteVerification: "your-verification-code-here",
     ```

2. **Submit your sitemap:**
   - In Search Console → Sitemaps
   - Add: `https://inventagious.com/sitemap.xml`
   - Click "Submit"
   - Wait 24-48 hours for processing

3. **Request indexing for key pages:**
   - Use URL Inspection tool
   - Enter URLs:
     - `https://inventagious.com/`
     - `https://inventagious.com/campaigns/active`
     - `https://inventagious.com/fund-blockchain-startups`
     - `https://inventagious.com/blog`
   - Click "Request Indexing" for each

#### B. Online Validators (RECOMMENDED)

1. **Google Rich Results Test:**
   - Go to: https://search.google.com/test/rich-results
   - Enter your production URL
   - Check for:
     - ✅ Product schema
     - ✅ Article schema
     - ✅ FAQ schema
     - ✅ Breadcrumb schema
     - ✅ Organization schema

2. **Schema.org Validator:**
   - Go to: https://validator.schema.org/
   - Paste your HTML or enter URL
   - Verify all structured data is valid

3. **Google Mobile-Friendly Test:**
   - Go to: https://search.google.com/test/mobile-friendly
   - Enter your URL
   - Ensure mobile-friendly ✅

4. **PageSpeed Insights:**
   - Go to: https://pagespeed.web.dev/
   - Test your homepage
   - Aim for:
     - LCP < 2.5s
     - INP < 200ms
     - CLS < 0.1

#### C. Manual Production Checks

```bash
# Check robots.txt
curl https://inventagious.com/robots.txt

# Check sitemap
curl https://inventagious.com/sitemap.xml

# Check homepage metadata
curl https://inventagious.com/ | grep -i "title\|description\|canonical"
```

## What to Check in Google Search Console

### 1. Coverage Report
- Go to: Coverage → Valid
- Check that your pages are indexed
- Look for any errors or warnings

### 2. Sitemaps Report
- Go to: Sitemaps
- Verify sitemap is processed
- Check for errors

### 3. Performance Report
- Go to: Performance
- Monitor impressions and clicks
- Track which pages are ranking

### 4. URL Inspection
- Use for individual page checks
- See how Google sees your page
- Check for indexing issues

## Testing Checklist

### Before Deploy
- [ ] Run `npm run test:seo:local` - all tests pass
- [ ] Check robots.txt locally
- [ ] Check sitemap.xml locally
- [ ] Verify homepage metadata
- [ ] Test programmatic pages load correctly
- [ ] Test blog pages load correctly

### After Deploy
- [ ] Verify robots.txt on production
- [ ] Verify sitemap.xml on production
- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for key pages
- [ ] Test with Google Rich Results Test
- [ ] Test with Schema.org Validator
- [ ] Check Google Search Console for errors
- [ ] Monitor indexing status (24-48 hours)

### Ongoing Monitoring
- [ ] Check Search Console weekly
- [ ] Monitor indexing coverage
- [ ] Track search performance
- [ ] Fix any crawl errors
- [ ] Update sitemap when adding new pages

## Common Issues & Solutions

### Issue: Pages not indexing
**Solution:**
1. Check robots.txt isn't blocking pages
2. Verify sitemap includes the pages
3. Request indexing in Search Console
4. Check for noindex meta tags

### Issue: Structured data errors
**Solution:**
1. Use Google Rich Results Test to find errors
2. Fix JSON-LD syntax
3. Ensure required fields are present
4. Re-test after fixes

### Issue: Sitemap not processing
**Solution:**
1. Verify sitemap is valid XML
2. Check sitemap is accessible
3. Ensure sitemap URL is correct in robots.txt
4. Wait 24-48 hours after submission

## Expected Results

After proper setup, you should see:

1. **Google Search Console:**
   - Sitemap processed successfully
   - Pages indexed (may take 24-48 hours)
   - No crawl errors

2. **Rich Results Test:**
   - Product schema valid (for campaign pages)
   - Article schema valid (for blog posts)
   - FAQ schema valid (for programmatic pages)
   - Breadcrumb schema valid (for all pages)

3. **Search Results:**
   - Your pages appear in Google search
   - Rich snippets show (if applicable)
   - Correct titles and descriptions

## Timeline

- **Immediate:** Local tests pass
- **0-24 hours:** Sitemap processed in Search Console
- **24-48 hours:** Pages start appearing in search
- **1-2 weeks:** Full indexing complete
- **Ongoing:** Monitor and optimize

## Need Help?

If tests fail or pages aren't indexing:
1. Check the error messages in the test output
2. Review Google Search Console for specific errors
3. Use online validators to identify issues
4. Check that all SEO features are properly implemented

## Additional Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Google Search Console Help](https://support.google.com/webmasters)


