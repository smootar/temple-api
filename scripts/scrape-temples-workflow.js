export const meta = {
  name: 'scrape-temples',
  description: 'Scrape all temple data from churchofjesuschristtemples.org using parallel agents',
  phases: [
    { title: 'Discover', detail: 'Find all temple URLs from the main listing' },
    { title: 'Scrape', detail: 'Parallel scraping of individual temple pages' },
    { title: 'Validate', detail: 'Cross-check data quality and completeness' },
    { title: 'Generate', detail: 'Build JSON API files and indexes' }
  ]
}

// Schema for temple list discovery
const TEMPLE_LIST_SCHEMA = {
  type: 'object',
  properties: {
    temples: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          url: { type: 'string' },
          status: { type: 'string', enum: ['Dedicated', 'Under Construction', 'Announced'] }
        },
        required: ['name', 'url', 'status']
      }
    }
  },
  required: ['temples']
}

// Schema for individual temple scraping
const TEMPLE_DETAIL_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    location: { type: 'string' },
    country: { type: 'string' },
    state: { type: 'string' },
    status: { type: 'string' },
    timeline: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          milestone: { type: 'string' },
          date: { type: 'string' },
          by: { type: 'string' }
        }
      }
    },
    coordinates: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' }
      }
    },
    address: { type: 'string' },
    facts: { type: 'array', items: { type: 'string' } },
    imageUrl: { type: 'string' }
  },
  required: ['id', 'name', 'location', 'status']
}

// ========================================
// Phase 1: Discover all temple URLs
// ========================================
phase('Discover')

log('Fetching temple list from churchofjesuschristtemples.org...')

const templeListPrompt = `
Visit https://churchofjesuschristtemples.org/temples/ and extract ALL temple listings.

For each temple, extract:
1. Name (full temple name)
2. URL (link to the temple's detail page)
3. Status (Dedicated, Under Construction, or Announced)

Return a complete list of ALL temples on the page. There should be 200+ temples.

IMPORTANT:
- Include ALL temples, not just a sample
- Extract the full URL for each temple
- Correctly identify the status based on the page indicators
`

const templeList = await agent(templeListPrompt, {
  label: 'discover-temples',
  schema: TEMPLE_LIST_SCHEMA
})

if (!templeList || !templeList.temples || templeList.temples.length === 0) {
  log('❌ Failed to discover temples')
  return { error: 'No temples found' }
}

log(`✅ Discovered ${templeList.temples.length} temples`)

// Filter to dedicated temples only for initial release
const dedicatedTemples = templeList.temples.filter(t => t.status === 'Dedicated')
log(`📊 Filtering to ${dedicatedTemples.length} dedicated temples`)

// ========================================
// Phase 2: Scrape individual temples in parallel
// ========================================
phase('Scrape')

log(`Scraping ${dedicatedTemples.length} temple pages in parallel...`)

const scrapedTemples = await pipeline(
  dedicatedTemples,

  // Stage 1: Scrape each temple's detail page
  temple => agent(
    `Scrape comprehensive data for ${temple.name} from ${temple.url}

Extract ALL available information:

1. **Basic Info**:
   - ID: Generate from name (lowercase, hyphens, e.g., "salt-lake-temple")
   - Name: Full temple name
   - Location: City, State/Province, Country
   - Country: Extract country
   - State: Extract state/province if applicable
   - Status: "${temple.status}"

2. **Timeline** (all dates you can find):
   - Announced: Date announced (if available)
   - Site Dedicated: Site dedication date
   - Groundbreaking: Groundbreaking ceremony date
   - Cornerstone: Cornerstone laying date (if applicable)
   - Dedicated: Dedication date (PRIMARY - most important)
   - Rededicated: Rededication dates (if any)
   - Include who performed ceremony when available

3. **Location Details**:
   - Address: Full street address
   - Coordinates: Latitude and longitude (look for maps or embedded coordinates)

4. **Facts** (interesting details about the temple):
   - Architectural features
   - Historical significance
   - Unique characteristics
   - Construction details
   - Size/capacity information
   - 3-5 notable facts minimum

5. **Images**:
   - imageUrl: Primary/featured temple image URL (full resolution)

IMPORTANT:
- Be thorough - extract ALL available information
- Timeline dates should be in "Month Day, Year" format (e.g., "April 6, 1893")
- Generate a clean ID from the temple name
- Include coordinates if you can find them on the page
- Extract the highest quality image URL available

Return comprehensive, accurate data.`,
    {
      label: `scrape:${temple.name}`,
      phase: 'Scrape',
      schema: TEMPLE_DETAIL_SCHEMA
    }
  )
)

const successfulScrapes = scrapedTemples.filter(Boolean)
log(`✅ Successfully scraped ${successfulScrapes.length}/${dedicatedTemples.length} temples`)

if (successfulScrapes.length === 0) {
  return { error: 'All scraping attempts failed' }
}

// ========================================
// Phase 3: Validate data quality
// ========================================
phase('Validate')

log('Validating scraped data...')

const validationResults = await parallel(
  [
    // Check for missing critical fields
    () => agent(
      `Review ${successfulScrapes.length} scraped temples and identify any that are missing critical data:

- Name (required)
- Location (required)
- Dedicated date (for dedicated temples)
- Image URL

Return a list of temple names that have missing required fields and what fields are missing.`,
      {
        label: 'validate-required',
        phase: 'Validate',
        schema: {
          type: 'object',
          properties: {
            issues: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  temple: { type: 'string' },
                  missingFields: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    ),

    // Check for duplicate IDs
    () => agent(
      `Review the temple IDs and check for duplicates:

${successfulScrapes.map(t => t.id).join(', ')}

Return any duplicate IDs found.`,
      {
        label: 'validate-duplicates',
        phase: 'Validate',
        schema: {
          type: 'object',
          properties: {
            duplicates: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    )
  ]
)

const [requiredCheck, duplicateCheck] = validationResults

if (requiredCheck && requiredCheck.issues && requiredCheck.issues.length > 0) {
  log(`⚠️  ${requiredCheck.issues.length} temples have missing required fields`)
}

if (duplicateCheck && duplicateCheck.duplicates && duplicateCheck.duplicates.length > 0) {
  log(`⚠️  Found ${duplicateCheck.duplicates.length} duplicate temple IDs`)
}

// ========================================
// Phase 4: Generate JSON API files
// ========================================
phase('Generate')

log('Generating JSON API files...')

// Sort temples by name
const sortedTemples = successfulScrapes.sort((a, b) => a.name.localeCompare(b.name))

// Generate summary data for main temples list
const templesSummary = sortedTemples.map(t => ({
  id: t.id,
  name: t.name,
  location: t.location,
  status: t.status,
  dedicated: t.timeline?.find(e => e.milestone === 'Dedicated')?.date || 'Not yet dedicated',
  coordinates: t.coordinates,
  image: `/images/${t.id}.jpg`,
  thumbnail: `/images/thumbs/${t.id}.jpg`
}))

// Group by status
const byStatus = {
  dedicated: templesSummary.filter(t => t.status === 'Dedicated'),
  underConstruction: templesSummary.filter(t => t.status === 'Under Construction'),
  announced: templesSummary.filter(t => t.status === 'Announced')
}

return {
  success: true,
  summary: {
    total: successfulScrapes.length,
    dedicated: byStatus.dedicated.length,
    underConstruction: byStatus.underConstruction.length,
    announced: byStatus.announced.length
  },
  temples: sortedTemples,
  templesSummary: templesSummary,
  byStatus: byStatus,
  validationIssues: {
    missingFields: requiredCheck?.issues || [],
    duplicates: duplicateCheck?.duplicates || []
  }
}
