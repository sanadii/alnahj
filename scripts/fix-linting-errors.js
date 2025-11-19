#!/usr/bin/env node

/**
 * Automated Linting Error Fixer
 * Fixes common TypeScript/ESLint errors in the frontend codebase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting automated linting error fixes...\n');

// Common unused imports to remove
const unusedImports = [
  "import MainCard from 'ui-component/cards/MainCard';",
  "import { Card } from '@mui/material';",
  "import { Stack } from '@mui/material';",
  "import { Divider } from '@mui/material';",
  "import { Paper } from '@mui/material';",
  "import { Tooltip } from '@mui/material';",
  "import { IconButton } from '@mui/material';",
  "import { alpha } from '@mui/material';",
  "import { useTheme } from '@mui/material';",
];

// Function to recursively find all .tsx and .ts files
function findFiles(dir, ext = ['.tsx', '.ts']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules
      if (file === 'node_modules' || file === 'dist' || file === 'build') {
        return;
      }
      results = results.concat(findFiles(filePath, ext));
    } else {
      if (ext.some(e => filePath.endsWith(e))) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to remove unused imports from a file
function removeUnusedImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  unusedImports.forEach(importLine => {
    if (content.includes(importLine)) {
      const regex = new RegExp(`^.*${importLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*$`, 'gm');
      const newContent = content.replace(regex, '');
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Main execution
const frontendDir = path.join(__dirname, '..', 'frontend', 'src');
console.log(`📂 Scanning directory: ${frontendDir}\n`);

const files = findFiles(frontendDir);
console.log(`📄 Found ${files.length} TypeScript/React files\n`);

let fixedFiles = 0;

files.forEach(file => {
  if (removeUnusedImports(file)) {
    fixedFiles++;
    console.log(`✅ Fixed: ${path.relative(frontendDir, file)}`);
  }
});

console.log(`\n✨ Fixed ${fixedFiles} files\n`);

// Run prettier to fix formatting
console.log('🎨 Running Prettier to fix formatting...\n');
try {
  execSync('cd frontend && npm run lint -- --fix', { stdio: 'inherit' });
  console.log('\n✅ Prettier fixes applied\n');
} catch (error) {
  console.error('⚠️  Some linting errors remain - manual intervention required\n');
}

console.log('🎉 Automated linting fixes complete!\n');
console.log('ℹ️  Run "npm run lint" in the frontend directory to check remaining errors\n');

