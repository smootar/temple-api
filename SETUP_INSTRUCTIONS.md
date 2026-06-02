# Setup Instructions for Temple API

## ✅ Repository Created

The repository has been created at: **https://github.com/smootar/temple-api**

Status: **Private** (ready for open-source in the future)

## 🔧 Manual Setup Required

### 1. Add GitHub Workflows

The workflow files couldn't be pushed due to OAuth scope limitations. Please add them manually:

**Option A: Via GitHub Web Interface**
1. Go to https://github.com/smootar/temple-api
2. Create `.github/workflows/deploy.yml`
3. Create `.github/workflows/update-data.yml`
4. Copy content from local files

**Option B: Via Git with Personal Access Token**
```bash
cd /Users/SmootAR/GitHub/temple-api
git restore --staged .github/workflows/*.yml
git restore .github/workflows/*.yml
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflows"
git push
```

### 2. Enable GitHub LFS

```bash
cd /Users/SmootAR/GitHub/temple-api
git lfs install
git lfs track "images/*.jpg" "images/*.jpeg" "images/*.png"
git add .gitattributes
git commit -m "chore: configure Git LFS for images"
git push
```

### 3. Enable GitHub Pages

1. Go to https://github.com/smootar/temple-api/settings/pages
2. Under "Build and deployment":
   - Source: **GitHub Actions**
3. Save

The site will be available at: `https://smootar.github.io/temple-api`

### 4. Add Workflow Results

Once the multi-agent workflow completes:

1. Check the workflow output for scraped temple data
2. Save the generated JSON files to `api/v1/`
3. Download temple images to `images/`
4. Commit and push:

```bash
git add api/ images/
git commit -m "feat: add initial temple data

- 217+ dedicated temples
- Complete timeline and location data
- High-quality temple images
- All data validated"
git push
```

## 🔄 Checking Workflow Status

The multi-agent scraping workflow is running. To check status:

```
# In Claude Code
/workflows
```

Or check the transcript directory:
```
/Users/SmootAR/.claude/projects/-Users-SmootAR-GitHub-templequest/
  63f23e92-cd65-40e1-81bb-ecece2088101/subagents/workflows/wf_c300a6af-0ff/
```

## 📊 Expected Results

The workflow will generate:
- `api/v1/temples.json` - All temples (217+ items)
- `api/v1/temples/{id}.json` - Individual temple files
- `api/v1/temples/dedicated.json` - Dedicated temples only
- `api/v1/temples/status/dedicated.json` - Status filter
- List of temple image URLs to download

## 🎯 Post-Setup Tasks

1. **Review scraped data** for accuracy
2. **Download images** from the URLs in the scraped data
3. **Create thumbnails** (800px width) for each image
4. **Test API** at https://smootar.github.io/temple-api/api/v1/temples.json
5. **Verify auto-updates** work on Mondays

## 🚀 Making It Public

When ready to open-source:

1. Go to https://github.com/smootar/temple-api/settings
2. Scroll to "Danger Zone"
3. Click "Change visibility"
4. Select "Public"
5. Confirm

Then announce on:
- Reddit /r/latterdaysaints
- LDS Dev communities
- Twitter/X
- GitHub topics

## 📝 Current Status

- ✅ Repository created (private)
- ✅ Initial code committed
- ✅ README and documentation complete
- 🔄 Multi-agent data scraping in progress
- ⏳ Workflows need to be added manually
- ⏳ GitHub Pages needs to be enabled
- ⏳ Temple images need to be downloaded

## 🛟 Need Help?

If the workflow encounters issues or you need to restart:

```javascript
// In Claude Code, run:
Workflow({
  scriptPath: "/Users/SmootAR/GitHub/temple-api/scripts/scrape-temples-workflow.js",
  resumeFromRunId: "wf_c300a6af-0ff"  // Resume from where it left off
})
```

---

Next steps: Wait for workflow completion, then add the data and images!
