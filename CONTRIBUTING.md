# Contributing to Temple API

Thank you for your interest in contributing to Temple API! This project aims to provide accurate, comprehensive data about temples of The Church of Jesus Christ of Latter-day Saints.

## 🚧 Current Status

This project is currently **private** but is being prepared for open-source release. This guide outlines how contributions will work once the project is public.

## How to Contribute

### Reporting Issues

If you find inaccurate data, missing information, or technical problems:

1. Check if an issue already exists
2. Open a new issue with:
   - Clear description of the problem
   - Specific temple(s) affected
   - Expected vs. actual data
   - Source for correct information (official Church website links)

### Data Corrections

To suggest corrections to temple data:

1. Fork the repository
2. Make changes to the relevant JSON files in `api/v1/temples/`
3. Include sources in your pull request description
4. Submit a pull request

**Data Source Requirements:**
- ✅ churchofjesuschrist.org
- ✅ churchofjesuschristtemples.org
- ❌ Unofficial sources
- ❌ Wikipedia (unless citing official sources)

### Adding New Temples

When a new temple is dedicated:

1. Run the scraper to update data: `npm run scrape`
2. Verify the new temple data is accurate
3. Download temple images (following guidelines below)
4. Submit a pull request

### Image Guidelines

**Image Requirements:**
- High quality (min 1200px width)
- Professional photography
- Shows temple exterior clearly
- Properly attributed/licensed

**Sources:**
- Official Church media library
- Church newsroom
- With explicit permission

**Adding Images:**
1. Place full-size image in `images/`
2. Create thumbnail (800px width) in `images/thumbs/`
3. Commit via Git LFS
4. Update temple JSON with image paths

## Development

### Setup

```bash
git clone https://github.com/SmootAR/temple-api.git
cd temple-api
npm install
```

### Running the Scraper

```bash
npm run scrape
```

### Building API Files

```bash
npm run build
```

### Validation

```bash
npm run validate
```

## Code Style

- Use 2 spaces for indentation
- Follow existing JSON structure
- Keep commits focused and atomic
- Write clear commit messages

## Pull Request Process

1. **Fork and Branch**
   - Fork the repository
   - Create a feature branch: `git checkout -b fix/temple-name-issue`

2. **Make Changes**
   - Follow data source requirements
   - Test your changes
   - Update documentation if needed

3. **Commit**
   - Write descriptive commit messages
   - Reference issues: `Fixes #123`

4. **Submit PR**
   - Describe what you changed and why
   - Link to data sources
   - Explain any non-obvious decisions

5. **Review**
   - Respond to feedback
   - Make requested changes
   - Be patient - reviews may take time

## Data Schema

### Temple Object

```json
{
  "id": "temple-name",
  "name": "Temple Name",
  "location": "City, State, Country",
  "country": "Country",
  "state": "State/Province",
  "status": "Dedicated | Under Construction | Announced",
  "timeline": [
    {
      "milestone": "Announced | Groundbreaking | Dedicated",
      "date": "Month Day, Year",
      "by": "Church Leader Name"
    }
  ],
  "coordinates": {
    "latitude": 40.7704,
    "longitude": -111.8918
  },
  "address": "Street Address",
  "facts": [
    "Interesting fact about the temple",
    "Another fact"
  ],
  "image": "/images/temple-name.jpg",
  "thumbnail": "/images/thumbs/temple-name.jpg"
}
```

### Required Fields

- `id` - Kebab-case identifier
- `name` - Full temple name
- `location` - City, State, Country
- `status` - Current temple status
- `timeline` - Must include dedication date for dedicated temples

### Optional Fields

- `coordinates` - GPS coordinates
- `address` - Street address
- `facts` - Interesting information
- `country` - Country name
- `state` - State/province name

## Automated Updates

The repository automatically updates every Monday at 3:15 AM UTC-11 via GitHub Actions. Manual scraping should only be needed for:

- Newly dedicated temples
- Corrections to existing data
- After major website changes

## Questions?

Open an issue with the `question` label, and we'll be happy to help!

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to uphold this code.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Temple API better! 🏛️
