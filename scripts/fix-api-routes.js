const fs = require('fs');
const path = require('path');

// Function to recursively find all route.ts files in the api directory
function findRouteFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively search directories
      results = results.concat(findRouteFiles(filePath));
    } else if (file === 'route.ts' || file === 'route.js') {
      // Found a route file
      results.push(filePath);
    }
  }
  
  return results;
}

// Function to add dynamic = 'force-static' to a route file if it doesn't already have it
function addDynamicExport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if dynamic export already exists
  if (!content.includes('export const dynamic')) {
    // Add the dynamic export after the imports
    const lines = content.split('\n');
    let importEndIndex = 0;
    
    // Find the last import statement
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        importEndIndex = i;
      }
    }
    
    // Insert the dynamic export after the imports
    lines.splice(importEndIndex + 1, 0, '', '// Add this line to make the route compatible with static exports', 'export const dynamic = \'force-static\';');
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Updated ${filePath}`);
    return true;
  } else {
    console.log(`Skipped ${filePath} (already has dynamic export)`);
    return false;
  }
}

// Main function
function main() {
  const apiDir = path.join(__dirname, '..', 'app', 'api');
  const routeFiles = findRouteFiles(apiDir);
  
  console.log(`Found ${routeFiles.length} route files`);
  
  let updatedCount = 0;
  for (const file of routeFiles) {
    if (addDynamicExport(file)) {
      updatedCount++;
    }
  }
  
  console.log(`Updated ${updatedCount} files`);
}

main(); 