# SEO Testing Guide

Αυτός ο οδηγός εξηγεί πώς να δοκιμάσετε τις αλλαγές SEO πριν την ανάπτυξη.

## Εγκατάσταση

Πρώτα, εγκαταστήστε το `tsx` για να τρέξετε TypeScript scripts:

```bash
npm install --save-dev tsx
# ή
yarn add -D tsx
```

## Τύποι Tests

### 1. Static SEO Tests (Χωρίς Server)

Ελέγχει τη δομή και τη διαμόρφωση των SEO αρχείων:

```bash
npm run test:seo
# ή
yarn test:seo
```

**Τι ελέγχει:**
- ✅ Site configuration (URL, description, keywords)
- ✅ Metadata configuration
- ✅ Sitemap structure
- ✅ Robots.txt structure
- ✅ Structured data schemas

**Πότε να το χρησιμοποιήσετε:**
- Πριν commit
- Στο CI/CD pipeline
- Για γρήγορο validation

### 2. Local SEO Tests (Με Dev Server)

Ελέγχει τα actual endpoints (robots.txt, sitemap.xml) στο local dev server:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run tests
npm run test:seo:local
# ή
yarn test:seo:local
```

**Τι ελέγχει:**
- ✅ robots.txt accessibility και content
- ✅ sitemap.xml accessibility και format
- ✅ Homepage metadata tags
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD)

**Πότε να το χρησιμοποιήσετε:**
- Πριν deploy
- Μετά από SEO changes
- Για comprehensive validation

## Test Results

### ✅ Passed Tests
Όλα τα tests πέρασαν - είστε έτοιμοι για deploy!

### ❌ Failed Tests
Κάποια tests απέτυχαν. Ελέγξτε τα error messages και:
1. Διορθώστε τα issues
2. Τρέξτε ξανά τα tests
3. Επαναλάβετε μέχρι όλα να περάσουν

## Manual Testing

Εκτός από τα automated tests, μπορείτε να κάνετε manual checks:

### 1. Ελέγξτε το robots.txt

```bash
# Local
curl http://localhost:3000/robots.txt

# Production (μετά το deploy)
curl https://inventagious.com/robots.txt
```

**Τι να ελέγξετε:**
- Περιέχει `Sitemap: https://inventagious.com/sitemap.xml`
- Έχει rules για Googlebot
- Δεν block-άρει σημαντικές σελίδες

### 2. Ελέγξτε το sitemap.xml

```bash
# Local
curl http://localhost:3000/sitemap.xml

# Production (μετά το deploy)
curl https://inventagious.com/sitemap.xml
```

**Τι να ελέγξετε:**
- Είναι valid XML
- Περιέχει URLs
- Περιέχει homepage
- Περιέχει σημαντικές σελίδες

### 3. Ελέγξτε Homepage Metadata

Ανοίξτε το browser DevTools και ελέγξτε:

**Elements Tab:**
- `<title>` tag
- `<meta name="description">`
- `<meta property="og:*">` tags
- `<link rel="canonical">`
- `<script type="application/ld+json">`

**Network Tab:**
- Status codes (200 OK)
- Content-Type headers

### 4. Online Validators

Μετά το deploy, χρησιμοποιήστε online validators:

**Google Rich Results Test:**
- https://search.google.com/test/rich-results
- Εισάγετε το URL σας
- Ελέγξτε structured data

**Schema.org Validator:**
- https://validator.schema.org/
- Επικολλήστε το HTML ή URL
- Ελέγξτε JSON-LD schemas

**Google Search Console:**
- https://search.google.com/search-console
- URL Inspection tool
- Ελέγξτε indexing status

## Testing Workflow

### Before Commit

```bash
# 1. Run static tests
npm run test:seo

# 2. Fix any issues
# ... make changes ...

# 3. Run again
npm run test:seo
```

### Before Deploy

```bash
# 1. Start dev server
npm run dev

# 2. Run local tests (in another terminal)
npm run test:seo:local

# 3. Fix any issues
# ... make changes ...

# 4. Rebuild and test
npm run build
npm run start
# Test in browser manually

# 5. Deploy
# ... deploy to production ...
```

### After Deploy

```bash
# 1. Test production endpoints
curl https://inventagious.com/robots.txt
curl https://inventagious.com/sitemap.xml

# 2. Use online validators
# - Google Rich Results Test
# - Schema.org Validator

# 3. Submit to Google Search Console
# - Submit sitemap
# - Request indexing
```

## Troubleshooting

### "Cannot find module 'tsx'"

```bash
npm install --save-dev tsx
```

### "Request timed out" (Local Tests)

- Βεβαιωθείτε ότι το dev server τρέχει: `npm run dev`
- Ελέγξτε ότι το port 3000 είναι διαθέσιμο
- Δοκιμάστε: `TEST_URL=http://localhost:3001 npm run test:seo:local`

### "Failed to fetch" Errors

- Ελέγξτε network connectivity
- Ελέγξτε ότι το server τρέχει
- Ελέγξτε firewall settings

### Tests Pass But Google Doesn't Index

1. Υποβάλετε το sitemap στο Google Search Console
2. Κάντε request indexing για την homepage
3. Περιμένετε 24-48 ώρες
4. Ελέγξτε το Search Console για errors

## Best Practices

1. **Τρέξτε tests πριν κάθε commit** - Catch issues early
2. **Test locally πριν deploy** - Verify endpoints work
3. **Monitor Search Console** - Track indexing status
4. **Update sitemap regularly** - Keep it current
5. **Validate structured data** - Use online validators

## Additional Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [SEO_INDEXING_FIX.md](./SEO_INDEXING_FIX.md) - Fix guide

