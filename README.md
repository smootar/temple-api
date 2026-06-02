# Temple API

A comprehensive, open-source REST API providing data for all temples of The Church of Jesus Christ of Latter-day Saints.

## Features

- ✅ Complete data for all 217+ dedicated temples
- ✅ Detailed information: dates, locations, status, facts, coordinates
- ✅ High-quality temple images hosted via GitHub LFS
- ✅ Automatic weekly updates (Mondays 3:15 AM UTC-11)
- ✅ JSON API served via GitHub Pages
- ✅ MIT Licensed - free for any use

## API Endpoints

Base URL: `https://smootar.github.io/temple-api`

### All Temples
```
GET /api/v1/temples.json
```
Returns all temples with basic information.

### Individual Temple
```
GET /api/v1/temples/{temple-id}.json
```
Returns detailed information for a specific temple.

Example: `/api/v1/temples/salt-lake-temple.json`

### Temples by Status
```
GET /api/v1/temples/dedicated.json
GET /api/v1/temples/under-construction.json
GET /api/v1/temples/announced.json
```

### By Status Parameter
```
GET /api/v1/temples/status/dedicated.json
GET /api/v1/temples/status/under-construction.json
GET /api/v1/temples/status/announced.json
```

## Data Structure

### Temple List Item
```json
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
```

### Detailed Temple Data
```json
{
  "id": "salt-lake-temple",
  "name": "Salt Lake Temple",
  "location": "Salt Lake City, Utah, USA",
  "country": "United States",
  "state": "Utah",
  "status": "Dedicated",
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
  "coordinates": {
    "latitude": 40.7704,
    "longitude": -111.8918
  },
  "address": "50 W North Temple, Salt Lake City, UT 84150",
  "facts": [
    "The Salt Lake Temple took 40 years to build.",
    "It is the largest temple of The Church of Jesus Christ of Latter-day Saints.",
    "Features six spires, the tallest reaching 210 feet."
  ],
  "image": "/images/salt-lake-temple.jpg",
  "thumbnail": "/images/thumbs/salt-lake-temple.jpg",
  "images": [
    "/images/salt-lake-temple-1.jpg",
    "/images/salt-lake-temple-2.jpg"
  ]
}
```

## Data Sources

All data is sourced from official Church websites:
- [churchofjesuschristtemples.org](https://churchofjesuschristtemples.org/temples/)
- [churchofjesuschrist.org](https://www.churchofjesuschrist.org/temples)

Data is automatically updated weekly to ensure accuracy.

## Usage Examples

### JavaScript/TypeScript
```typescript
// Fetch all temples
const response = await fetch('https://smootar.github.io/temple-api/api/v1/temples.json');
const temples = await response.json();

// Fetch specific temple
const temple = await fetch('https://smootar.github.io/temple-api/api/v1/temples/salt-lake-temple.json');
const data = await temple.json();
```

### Swift
```swift
let url = URL(string: "https://smootar.github.io/temple-api/api/v1/temples.json")!
let (data, _) = try await URLSession.shared.data(from: url)
let temples = try JSONDecoder().decode([Temple].self, from: data)
```

### cURL
```bash
curl https://smootar.github.io/temple-api/api/v1/temples.json
```

## Contributing

This project is currently private but will be open-sourced in the future. Contributions will include:

- Data corrections and updates
- Additional temple information
- New features and endpoints
- Documentation improvements

## Update Schedule

The API is automatically updated every Monday at 3:15 AM UTC-11 (2:15 PM UTC) via GitHub Actions.

## License

MIT License - See [LICENSE](LICENSE) for details.

The temple images and data are sourced from official Church websites and are used in accordance with their terms of service.

## Disclaimer

This is an independent project and is not affiliated with or endorsed by The Church of Jesus Christ of Latter-day Saints. For official information, please visit [churchofjesuschrist.org](https://www.churchofjesuschrist.org).

## Roadmap

- [ ] Initial data collection (217 dedicated temples)
- [ ] Image hosting via GitHub LFS
- [ ] API deployment to GitHub Pages
- [ ] Weekly auto-update via GitHub Actions
- [ ] Documentation website
- [ ] Temples under construction
- [ ] Announced temples
- [ ] Historical temple data
- [ ] Geospatial queries
- [ ] GraphQL endpoint

## Contact

For questions or issues, please open an issue in this repository.

---

**Note**: This project is currently in development. Initial data collection in progress.
