# Temple API - Complete Documentation

## 📚 Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Endpoints](#endpoints)
5. [Data Schemas](#data-schemas)
6. [Usage Examples](#usage-examples)
7. [Error Handling](#error-handling)
8. [Rate Limits](#rate-limits)
9. [Filtering & Searching](#filtering--searching)
10. [Best Practices](#best-practices)

---

## Overview

The Temple API provides comprehensive, up-to-date information about all temples of The Church of Jesus Christ of Latter-day Saints. The API is:

- ✅ **Free** - No API key required
- ✅ **Open Source** - MIT Licensed
- ✅ **Auto-updated** - Weekly updates every Monday
- ✅ **Fast** - Served via GitHub Pages CDN
- ✅ **Complete** - 387 temples with detailed data

**Current Data (as of June 2026):**
- 221 Dedicated Temples
- 60 Temples Under Construction
- 103 Announced Temples

---

## Base URL

```
https://smootar.github.io/temple-api
```

All endpoints are relative to this base URL.

---

## Authentication

**No authentication required!** All endpoints are publicly accessible.

---

## Endpoints

### 1. Get All Temples

Returns a list of all temples with summary information.

**Endpoint:**
```
GET /api/v1/temples.json
```

**Parameters:** None

**Response:**
```json
{
  "temples": [
    {
      "id": "salt-lake-temple",
      "name": "Salt Lake Temple",
      "location": "Salt Lake City, Utah, USA",
      "status": "Dedicated",
      "dedicated": "April 6, 1893",
      "coordinates": {
        "latitude": 40.7704,
        "longitude": -111.8918
      },
      "image": "/images/salt-lake-temple.jpg",
      "thumbnail": "/images/thumbs/salt-lake-temple.jpg"
    }
    // ... 386 more temples
  ]
}
```

**Example:**
```bash
curl https://smootar.github.io/temple-api/api/v1/temples.json
```

---

### 2. Get Single Temple

Returns detailed information for a specific temple.

**Endpoint:**
```
GET /api/v1/temples/{temple-id}.json
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `temple-id` | string | Yes | Unique temple identifier (kebab-case) |

**Temple ID Format:**
- Lowercase letters
- Hyphens instead of spaces
- Example: `"salt-lake-temple"`, `"manila-philippines-temple"`

**Response:**
```json
{
  "id": "salt-lake-temple",
  "name": "Salt Lake Temple",
  "location": "Salt Lake City, Utah, United States",
  "country": "United States",
  "state": "Utah",
  "status": "Dedicated",
  "address": "50 W North Temple, Salt Lake City, UT 84150",
  "coordinates": {
    "latitude": 40.7704,
    "longitude": -111.8918
  },
  "timeline": [
    {
      "milestone": "Announced",
      "date": "January 1, 1853"
    },
    {
      "milestone": "Groundbreaking",
      "date": "February 14, 1853"
    },
    {
      "milestone": "Dedicated",
      "date": "April 6, 1893",
      "by": "Wilford Woodruff"
    }
  ],
  "facts": [
    "Construction took 40 years to complete",
    "Features six spires with the tallest at 210 feet",
    "Built with granite from Little Cottonwood Canyon"
  ],
  "imageUrl": "https://churchofjesuschristtemples.org/assets/img/temples/salt-lake-temple/salt-lake-temple-main.jpg"
}
```

**Example:**
```bash
curl https://smootar.github.io/temple-api/api/v1/temples/salt-lake-temple.json
```

---

### 3. Get Dedicated Temples

Returns only temples that have been dedicated.

**Endpoint:**
```
GET /api/v1/temples/dedicated.json
```

**Alternative:**
```
GET /api/v1/temples/status/dedicated.json
```

**Parameters:** None

**Response:**
```json
{
  "temples": [
    // Array of 221 dedicated temples (summary format)
  ]
}
```

**Example:**
```bash
curl https://smootar.github.io/temple-api/api/v1/temples/dedicated.json
```

---

### 4. Get Temples Under Construction

Returns temples currently under construction.

**Endpoint:**
```
GET /api/v1/temples/status/under-construction.json
```

**Parameters:** None

**Response:**
```json
{
  "temples": [
    // Array of 60 temples under construction (summary format)
  ]
}
```

**Example:**
```bash
curl https://smootar.github.io/temple-api/api/v1/temples/status/under-construction.json
```

---

### 5. Get Announced Temples

Returns temples that have been announced but not yet dedicated.

**Endpoint:**
```
GET /api/v1/temples/status/announced.json
```

**Parameters:** None

**Response:**
```json
{
  "temples": [
    // Array of 103 announced temples (summary format)
  ]
}
```

**Example:**
```bash
curl https://smootar.github.io/temple-api/api/v1/temples/status/announced.json
```

---

### 6. Get API Metadata

Returns metadata about the API and dataset.

**Endpoint:**
```
GET /api/v1/metadata.json
```

**Response:**
```json
{
  "generatedAt": "2026-06-02T18:30:00.000Z",
  "totalTemples": 387,
  "byStatus": {
    "dedicated": 221,
    "underConstruction": 60,
    "announced": 103
  },
  "version": "1.0.0",
  "source": "churchofjesuschristtemples.org"
}
```

---

## Data Schemas

### Temple Summary Object

Used in list endpoints (`/api/v1/temples.json`, status endpoints).

```typescript
interface TempleSummary {
  id: string;                    // Unique identifier (kebab-case)
  name: string;                  // Full temple name
  location: string;              // "City, State, Country"
  status: string;                // "Dedicated" | "Under Construction" | "Announced"
  dedicated: string;             // Dedication date or "Not yet dedicated"
  coordinates?: {
    latitude: number;            // Decimal degrees
    longitude: number;           // Decimal degrees
  };
  image: string;                 // Relative path to full-size image
  thumbnail: string;             // Relative path to thumbnail image
}
```

### Temple Detail Object

Used in single temple endpoint (`/api/v1/temples/{id}.json`).

```typescript
interface TempleDetail {
  id: string;                    // Unique identifier (kebab-case)
  name: string;                  // Full temple name
  location: string;              // "City, State, Country"
  country: string;               // Country name
  state?: string;                // State/province (if applicable)
  status: string;                // "Dedicated" | "Under Construction" | "Announced"
  address?: string;              // Full street address
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timeline: TimelineEntry[];     // Chronological events
  facts: string[];               // Interesting facts (3-10 items)
  imageUrl: string;              // Full URL to temple image
}

interface TimelineEntry {
  milestone: string;             // "Announced" | "Groundbreaking" | "Dedicated" | etc.
  date: string;                  // Human-readable date (e.g., "April 6, 1893")
  by?: string;                   // Person who performed ceremony (optional)
}
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique kebab-case identifier | `"salt-lake-temple"` |
| `name` | string | Official temple name | `"Salt Lake Temple"` |
| `location` | string | Human-readable location | `"Salt Lake City, Utah, USA"` |
| `country` | string | Country name | `"United States"` |
| `state` | string? | State/province if applicable | `"Utah"` |
| `status` | enum | Temple status | `"Dedicated"`, `"Under Construction"`, `"Announced"` |
| `dedicated` | string | Dedication date or status | `"April 6, 1893"` or `"Not yet dedicated"` |
| `address` | string? | Full street address | `"50 W North Temple, Salt Lake City, UT 84150"` |
| `coordinates` | object? | GPS coordinates | `{ latitude: 40.7704, longitude: -111.8918 }` |
| `timeline` | array | Chronological events | See TimelineEntry schema |
| `facts` | array | Interesting information | Array of strings |
| `imageUrl` | string | Full image URL | `"https://..."` |

---

## Usage Examples

### JavaScript / TypeScript

```javascript
// Fetch all temples
async function getAllTemples() {
  const response = await fetch('https://smootar.github.io/temple-api/api/v1/temples.json');
  const data = await response.json();
  return data.temples;
}

// Fetch single temple
async function getTemple(templeId) {
  const response = await fetch(`https://smootar.github.io/temple-api/api/v1/temples/${templeId}.json`);
  return await response.json();
}

// Fetch dedicated temples only
async function getDedicatedTemples() {
  const response = await fetch('https://smootar.github.io/temple-api/api/v1/temples/dedicated.json');
  const data = await response.json();
  return data.temples;
}

// Example: Find temples by location
async function findTemplesByLocation(searchTerm) {
  const temples = await getAllTemples();
  return temples.filter(t => 
    t.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Example: Get temples near coordinates
async function getNearbyTemples(lat, lon, radiusMiles = 50) {
  const temples = await getAllTemples();
  
  return temples
    .filter(t => t.coordinates)
    .map(t => ({
      ...t,
      distance: calculateDistance(lat, lon, t.coordinates.latitude, t.coordinates.longitude)
    }))
    .filter(t => t.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

### Swift (iOS/macOS)

```swift
import Foundation

struct TempleResponse: Codable {
    let temples: [Temple]
}

struct Temple: Codable {
    let id: String
    let name: String
    let location: String
    let status: String
    let dedicated: String
    let coordinates: Coordinates?
    let image: String
    let thumbnail: String
}

struct TempleDetail: Codable {
    let id: String
    let name: String
    let location: String
    let country: String
    let state: String?
    let status: String
    let address: String?
    let coordinates: Coordinates?
    let timeline: [TimelineEntry]
    let facts: [String]
    let imageUrl: String
}

struct Coordinates: Codable {
    let latitude: Double
    let longitude: Double
}

struct TimelineEntry: Codable {
    let milestone: String
    let date: String
    let by: String?
}

class TempleService {
    private let baseURL = "https://smootar.github.io/temple-api/api/v1"
    
    // Fetch all temples
    func getAllTemples() async throws -> [Temple] {
        let url = URL(string: "\(baseURL)/temples.json")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let response = try JSONDecoder().decode(TempleResponse.self, from: data)
        return response.temples
    }
    
    // Fetch single temple
    func getTemple(id: String) async throws -> TempleDetail {
        let url = URL(string: "\(baseURL)/temples/\(id).json")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(TempleDetail.self, from: data)
    }
    
    // Fetch dedicated temples
    func getDedicatedTemples() async throws -> [Temple] {
        let url = URL(string: "\(baseURL)/temples/dedicated.json")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let response = try JSONDecoder().decode(TempleResponse.self, from: data)
        return response.temples
    }
    
    // Find temples by location
    func findTemples(location: String) async throws -> [Temple] {
        let temples = try await getAllTemples()
        return temples.filter { 
            $0.location.localizedCaseInsensitiveContains(location) 
        }
    }
}

// Usage
let service = TempleService()

Task {
    // Get all temples
    let temples = try await service.getAllTemples()
    print("Total temples: \(temples.count)")
    
    // Get specific temple
    let saltLake = try await service.getTemple(id: "salt-lake-temple")
    print("Temple: \(saltLake.name)")
    
    // Find Utah temples
    let utahTemples = try await service.findTemples(location: "Utah")
    print("Utah temples: \(utahTemples.count)")
}
```

### Python

```python
import requests
from typing import List, Dict, Optional

BASE_URL = "https://smootar.github.io/temple-api/api/v1"

def get_all_temples() -> List[Dict]:
    """Fetch all temples"""
    response = requests.get(f"{BASE_URL}/temples.json")
    response.raise_for_status()
    return response.json()["temples"]

def get_temple(temple_id: str) -> Dict:
    """Fetch single temple by ID"""
    response = requests.get(f"{BASE_URL}/temples/{temple_id}.json")
    response.raise_for_status()
    return response.json()

def get_dedicated_temples() -> List[Dict]:
    """Fetch only dedicated temples"""
    response = requests.get(f"{BASE_URL}/temples/dedicated.json")
    response.raise_for_status()
    return response.json()["temples"]

def find_temples_by_location(location: str) -> List[Dict]:
    """Search temples by location"""
    temples = get_all_temples()
    return [t for t in temples if location.lower() in t["location"].lower()]

def find_temples_by_country(country: str) -> List[Dict]:
    """Get all temples in a specific country"""
    temples = get_all_temples()
    results = []
    
    for temple_id in [t["id"] for t in temples]:
        try:
            detail = get_temple(temple_id)
            if detail.get("country", "").lower() == country.lower():
                results.append(detail)
        except:
            continue
    
    return results

# Example usage
if __name__ == "__main__":
    # Get all temples
    temples = get_all_temples()
    print(f"Total temples: {len(temples)}")
    
    # Get specific temple
    salt_lake = get_temple("salt-lake-temple")
    print(f"Temple: {salt_lake['name']}")
    print(f"Dedicated: {salt_lake['timeline'][-1]['date']}")
    
    # Find Utah temples
    utah_temples = find_temples_by_location("Utah")
    print(f"Utah temples: {len(utah_temples)}")
    
    # Get all US temples
    us_temples = find_temples_by_country("United States")
    print(f"US temples: {len(us_temples)}")
```

### React Component Example

```jsx
import { useState, useEffect } from 'react';

function TempleList() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTemples();
  }, [filter]);

  const fetchTemples = async () => {
    setLoading(true);
    try {
      const endpoint = filter === 'all' 
        ? 'temples.json'
        : `temples/status/${filter}.json`;
      
      const response = await fetch(
        `https://smootar.github.io/temple-api/api/v1/${endpoint}`
      );
      const data = await response.json();
      setTemples(data.temples);
    } catch (error) {
      console.error('Error fetching temples:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading temples...</div>;

  return (
    <div>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('dedicated')}>Dedicated</button>
        <button onClick={() => setFilter('under-construction')}>Under Construction</button>
        <button onClick={() => setFilter('announced')}>Announced</button>
      </div>

      <div className="temple-grid">
        {temples.map(temple => (
          <TempleCard key={temple.id} temple={temple} />
        ))}
      </div>
    </div>
  );
}

function TempleCard({ temple }) {
  return (
    <div className="temple-card">
      <img 
        src={`https://smootar.github.io/temple-api${temple.image}`}
        alt={temple.name}
      />
      <h3>{temple.name}</h3>
      <p>{temple.location}</p>
      <span className={`status ${temple.status.toLowerCase()}`}>
        {temple.status}
      </span>
    </div>
  );
}
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| 200 | OK | Request succeeded |
| 404 | Not Found | Temple ID doesn't exist or invalid endpoint |
| 500 | Server Error | GitHub Pages error (rare) |

### Error Response Format

When a temple is not found:
```json
{
  "error": "Not Found",
  "message": "Temple with ID 'invalid-temple' does not exist"
}
```

### Handling Errors in Code

```javascript
async function getTempleSafe(templeId) {
  try {
    const response = await fetch(
      `https://smootar.github.io/temple-api/api/v1/temples/${templeId}.json`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Temple '${templeId}' not found`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching temple:', error);
    return null;
  }
}
```

---

## Rate Limits

**No rate limits!** The API is served via GitHub Pages CDN and can handle high traffic.

**Best Practices:**
- Cache responses when possible
- Don't make unnecessary requests
- Use the appropriate endpoint (don't fetch all temples if you only need dedicated ones)

---

## Filtering & Searching

The API provides static JSON files. For advanced filtering, fetch the data and filter client-side:

### Common Search Patterns

**1. Search by Name:**
```javascript
temples.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
```

**2. Search by Location (City, State, or Country):**
```javascript
temples.filter(t => t.location.toLowerCase().includes(query.toLowerCase()))
```

**3. Filter by Status:**
```javascript
// Use dedicated endpoint OR filter client-side
temples.filter(t => t.status === 'Dedicated')
```

**4. Find by Coordinates (Geospatial Search):**
```javascript
function findNearby(temples, lat, lon, radiusMiles) {
  return temples
    .filter(t => t.coordinates)
    .map(t => ({
      ...t,
      distance: haversineDistance(lat, lon, t.coordinates.latitude, t.coordinates.longitude)
    }))
    .filter(t => t.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);
}
```

**5. Sort by Dedication Date:**
```javascript
temples.sort((a, b) => {
  const dateA = new Date(a.dedicated);
  const dateB = new Date(b.dedicated);
  return dateA - dateB;
});
```

---

## Best Practices

### 1. Caching

Cache API responses to reduce requests:

```javascript
// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

async function fetchWithCache(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}
```

### 2. Use Appropriate Endpoints

Don't fetch all temples if you only need dedicated ones:

```javascript
// ❌ Inefficient
const all = await fetch('/api/v1/temples.json');
const dedicated = all.temples.filter(t => t.status === 'Dedicated');

// ✅ Better
const dedicated = await fetch('/api/v1/temples/dedicated.json');
```

### 3. Handle Missing Data Gracefully

Not all temples have all fields:

```javascript
function renderCoordinates(temple) {
  if (!temple.coordinates || !temple.coordinates.latitude) {
    return 'Coordinates not available';
  }
  return `${temple.coordinates.latitude}, ${temple.coordinates.longitude}`;
}
```

### 4. Lazy Load Details

Load summary data first, then fetch details on demand:

```javascript
// Load list
const temples = await fetch('/api/v1/temples.json');

// Load details only when user clicks
async function showTempleDetails(templeId) {
  const detail = await fetch(`/api/v1/temples/${templeId}.json`);
  renderDetail(detail);
}
```

### 5. Optimize Images

Temple images can be large. Consider:
- Using thumbnails for list views
- Lazy loading images
- Implementing responsive images

```html
<img 
  src="thumbnail.jpg" 
  loading="lazy"
  alt="Temple name"
/>
```

---

## Data Update Schedule

The API is automatically updated every **Monday at 3:15 AM UTC-11** (2:15 PM UTC).

**What Gets Updated:**
- New temple announcements
- Temple dedications
- Status changes (announced → under construction → dedicated)
- Timeline updates
- New temple images

**Manual Updates:**
You don't need to do anything! The API refreshes automatically via GitHub Actions.

---

## CORS Support

**CORS is enabled for all origins.** You can call the API from any domain:

```javascript
// Works from any website
fetch('https://smootar.github.io/temple-api/api/v1/temples.json')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Data Sources

All data is sourced from official Church websites:
- [churchofjesuschristtemples.org](https://churchofjesuschristtemples.org/temples/)
- [churchofjesuschrist.org](https://www.churchofjesuschrist.org/temples)

Data is verified and validated before publication.

---

## Support & Contributions

**Issues:** Report bugs or request features at [GitHub Issues](https://github.com/SmootAR/temple-api/issues)

**Contributions:** See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines

**License:** MIT License - Free for any use

---

## Quick Reference

### Endpoints Summary

| Endpoint | Description | Count |
|----------|-------------|-------|
| `/api/v1/temples.json` | All temples (summary) | 387 |
| `/api/v1/temples/{id}.json` | Single temple (detailed) | 1 |
| `/api/v1/temples/dedicated.json` | Dedicated temples only | 221 |
| `/api/v1/temples/status/under-construction.json` | Under construction | 60 |
| `/api/v1/temples/status/announced.json` | Announced temples | 103 |
| `/api/v1/metadata.json` | API metadata | - |

### Common Temple IDs

```
salt-lake-temple
provo-city-center-temple
manila-philippines-temple
tokyo-japan-temple
london-england-temple
são-paulo-brazil-temple
sydney-australia-temple
```

---

**Happy coding! 🏛️**

For questions or issues, open an issue on [GitHub](https://github.com/SmootAR/temple-api).
