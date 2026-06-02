#!/usr/bin/env node

/**
 * Multi-agent temple data scraper
 * Scrapes all temple data from churchofjesuschristtemples.org in parallel
 *
 * This script will be executed by Claude Code using the Workflow tool
 * to parallelize temple data collection across many agents.
 */

const TEMPLE_LIST_URL = 'https://churchofjesuschristtemples.org/temples/';

console.log('Temple API Scraper');
console.log('==================');
console.log('');
console.log('This script coordinates multi-agent scraping.');
console.log('Execute via Claude Code workflow for parallel collection.');
console.log('');
console.log(`Source: ${TEMPLE_LIST_URL}`);
console.log('');
console.log('To run: Use Claude Code Workflow tool with scrape-temples-workflow.js');
