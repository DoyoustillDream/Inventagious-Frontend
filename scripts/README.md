# SEO Testing Scripts

Αυτός ο φάκελος περιέχει scripts για testing των SEO configurations.

## Scripts

### `test-seo.ts`
Static tests που ελέγχουν τη δομή και configuration των SEO αρχείων.

**Usage:**
```bash
npm run test:seo
```

**Τι ελέγχει:**
- Site configuration
- Metadata structure
- Sitemap file structure
- Robots.txt file structure
- Structured data schemas

### `test-seo-local.ts`
Dynamic tests που ελέγχουν τα actual endpoints στο local dev server.

**Usage:**
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run test:seo:local
```

**Τι ελέγχει:**
- robots.txt endpoint
- sitemap.xml endpoint
- Homepage metadata tags

## Requirements

- `tsx` package (installed as dev dependency)
- Node.js 18+

## See Also

- [SEO_TESTING_GUIDE.md](../SEO_TESTING_GUIDE.md) - Complete testing guide
- [SEO_INDEXING_FIX.md](../SEO_INDEXING_FIX.md) - SEO fix documentation

