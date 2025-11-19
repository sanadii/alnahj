/**
 * Script to update all API helpers to use responseNormalizer
 * 
 * This script:
 * 1. Adds import for wrapResponse/wrapListResponse
 * 2. Replaces `return response.data;` with `return wrapResponse(response.data);`
 * 3. Handles special cases (blob responses, already wrapped, etc.)
 * 
 * Usage: node scripts/update-api-helpers.js
 */

const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '../src/helpers/api');
const files = [
  'attendance.ts',
  'committees.ts',
  'users.ts',
  'user.ts',
  'voting.ts',
  'guarantees.ts',
  'elections.ts',
  'auth.ts',
  'account.ts'
];

const NORMALIZER_IMPORT = `import { wrapResponse, wrapListResponse } from './responseNormalizer';`;

function updateFile(filename) {
  const filepath = path.join(API_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`❌ File not found: ${filename}`);
    return;
  }

  let content = fs.readFileSync(filepath, 'utf8');
  let modified = false;

  // Check if already has import
  if (!content.includes('wrapResponse')) {
    // Find the last import statement
    const importMatch = content.match(/(import [^;]+;[\s\S]*?import [^;]+;)/);
    if (importMatch) {
      const lastImport = importMatch[0];
      content = content.replace(lastImport, `${lastImport}\n${NORMALIZER_IMPORT}`);
      modified = true;
      console.log(`✅ Added import to ${filename}`);
    }
  }

  // Count replacements
  let count = 0;

  // Replace return response.data (not in blob contexts)
  content = content.replace(
    /return response\.data;(?![\s\S]*?responseType.*?blob)/g,
    (match, offset) => {
      // Skip if in a comment or already has wrapResponse
      const before = content.substring(Math.max(0, offset - 100), offset);
      if (before.includes('//') || before.includes('wrapResponse')) {
        return match;
      }
      count++;
      return 'return wrapResponse(response.data);';
    }
  );

  if (count > 0) {
    modified = true;
    console.log(`✅ Updated ${count} returns in ${filename}`);
  }

  if (modified) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`💾 Saved ${filename}\n`);
  } else {
    console.log(`⏭️  No changes needed for ${filename}\n`);
  }
}

console.log('🚀 Starting API helpers update...\n');

files.forEach(updateFile);

console.log('✅ Update complete!');
console.log('\n📝 Next steps:');
console.log('1. Review changes in each file');
console.log('2. Check for blob/file download endpoints');
console.log('3. Test API calls in browser');
console.log('4. Run: npm run lint:fix');



