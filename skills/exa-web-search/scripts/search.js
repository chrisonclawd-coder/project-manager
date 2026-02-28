#!/usr/bin/env node

/**
 * Exa Web Search
 * AI-optimized search using Exa API (no shell execution)
 */

import fs from 'fs';
import path from 'path';

// Load API key from openclaw.json
const openclawConfigPath = path.join(process.cwd(), '../../../openclaw.json');
const configContent = fs.readFileSync(openclawConfigPath, 'utf-8');
const config = JSON.parse(configContent);

const EXA_API_KEY = config.env?.vars?.EXA_API_KEY;

if (!EXA_API_KEY) {
  console.error('Error: EXA_API_KEY not found in openclaw.json');
  console.error('Please set it in env.vars.EXA_API_KEY');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
let query = '';
let count = 5;

// Parse args
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '-n' || arg === '--count') {
    count = parseInt(args[++i]) || 5;
  } else if (arg.startsWith('-')) {
    console.error(`Unknown flag: ${arg}`);
    process.exit(1);
  } else {
    query = arg;
  }
}

if (!query) {
  console.error('Error: Search query required');
  console.error('Usage: node search.js <query> [options]');
  console.error('Options:');
  console.error('  -n, --count N    Number of results (default: 5)');
  process.exit(1);
}

// Exa API endpoint
const baseUrl = 'https://api.exa.ai/search';
const countParam = Math.min(count, 100); // Exa limit is 100

// Make search request to Exa API using fetch (no shell execution)
async function searchExa() {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EXA_API_KEY,
      },
      body: JSON.stringify({
        query: query,
        numResults: countParam,
        useAutoprompt: true
      }),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Exa API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Error: Request timed out');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

searchExa();
