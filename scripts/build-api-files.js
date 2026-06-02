#!/usr/bin/env node

/**
 * Build API files from workflow result
 * Generates all JSON endpoints from scraped temple data
 */

const fs = require('fs');
const path = require('path');

console.log('🏗️  Building Temple API files...\n');

// Read workflow result
const workflowResult = JSON.parse(fs.readFileSync('workflow-result.json', 'utf8'));

if (!workflowResult.success) {
  console.error('❌ Workflow result indicates failure');
  process.exit(1);
}

const { temples, templesSummary, byStatus } = workflowResult;

console.log(`✅ Loaded ${temples.length} temples from workflow`);
console.log(`   • Dedicated: ${byStatus.dedicated.length}`);
console.log(`   • Under Construction: ${byStatus.underConstruction.length}`);
console.log(`   • Announced: ${byStatus.announced.length}`);
console.log('');

// Ensure directories exist
const dirs = [
  'api/v1',
  'api/v1/temples',
  'api/v1/temples/status'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// 1. Generate main temples list (summary data)
console.log('\n📝 Generating api/v1/temples.json...');
fs.writeFileSync(
  'api/v1/temples.json',
  JSON.stringify({ temples: templesSummary }, null, 2)
);
console.log(`   ✅ ${templesSummary.length} temples`);

// 2. Generate individual temple files
console.log('\n📝 Generating individual temple files...');
let count = 0;
temples.forEach(temple => {
  const filePath = `api/v1/temples/${temple.id}.json`;
  fs.writeFileSync(filePath, JSON.stringify(temple, null, 2));
  count++;
  if (count % 50 === 0) {
    console.log(`   Progress: ${count}/${temples.length}`);
  }
});
console.log(`   ✅ ${count} temple files created`);

// 3. Generate status-filtered lists
console.log('\n📝 Generating status-filtered lists...');

fs.writeFileSync(
  'api/v1/temples/dedicated.json',
  JSON.stringify({ temples: byStatus.dedicated }, null, 2)
);
console.log(`   ✅ dedicated.json (${byStatus.dedicated.length} temples)`);

fs.writeFileSync(
  'api/v1/temples/status/dedicated.json',
  JSON.stringify({ temples: byStatus.dedicated }, null, 2)
);
console.log(`   ✅ status/dedicated.json (${byStatus.dedicated.length} temples)`);

fs.writeFileSync(
  'api/v1/temples/status/under-construction.json',
  JSON.stringify({ temples: byStatus.underConstruction }, null, 2)
);
console.log(`   ✅ status/under-construction.json (${byStatus.underConstruction.length} temples)`);

fs.writeFileSync(
  'api/v1/temples/status/announced.json',
  JSON.stringify({ temples: byStatus.announced }, null, 2)
);
console.log(`   ✅ status/announced.json (${byStatus.announced.length} temples)`);

// 4. Generate metadata file
const metadata = {
  generatedAt: new Date().toISOString(),
  totalTemples: temples.length,
  byStatus: {
    dedicated: byStatus.dedicated.length,
    underConstruction: byStatus.underConstruction.length,
    announced: byStatus.announced.length
  },
  version: '1.0.0',
  source: 'churchofjesuschristtemples.org'
};

fs.writeFileSync(
  'api/v1/metadata.json',
  JSON.stringify(metadata, null, 2)
);
console.log('\n✅ metadata.json created');

console.log('\n' + '='.repeat(60));
console.log('✅ API files successfully generated!');
console.log('='.repeat(60));
console.log(`\nTotal files created: ${count + 7}`);
console.log(`   • Main list: api/v1/temples.json`);
console.log(`   • Individual: api/v1/temples/{id}.json (${count} files)`);
console.log(`   • By status: api/v1/temples/status/*.json (3 files)`);
console.log(`   • Dedicated: api/v1/temples/dedicated.json`);
console.log(`   • Metadata: api/v1/metadata.json`);
console.log('');
console.log('🎯 Next: Download temple images to images/ directory');
