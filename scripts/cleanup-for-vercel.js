const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if the out directory exists
const outDir = path.join(__dirname, '..', 'out');
if (!fs.existsSync(outDir)) {
  console.error('Error: out directory does not exist. Run npm run build first.');
  process.exit(1);
}

// Remove all middleware-related files and directories
console.log('Removing middleware-related files...');

// List of patterns to search for and remove
const patternsToRemove = [
  'middleware',
  'server',
  'routes-manifest.json',
  '_middleware'
];

// Find and remove files matching patterns
try {
  patternsToRemove.forEach(pattern => {
    try {
      // Find files matching the pattern
      const files = execSync(`find ${outDir} -name "*${pattern}*" 2>/dev/null || true`, { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(Boolean);
      
      // Remove each file
      files.forEach(file => {
        try {
          if (fs.existsSync(file)) {
            if (fs.lstatSync(file).isDirectory()) {
              console.log(`Removing directory: ${file}`);
              fs.rmSync(file, { recursive: true, force: true });
            } else {
              console.log(`Removing file: ${file}`);
              fs.unlinkSync(file);
            }
          }
        } catch (err) {
          console.error(`Error removing ${file}: ${err.message}`);
        }
      });
    } catch (err) {
      console.error(`Error finding ${pattern} files: ${err.message}`);
    }
  });
} catch (err) {
  console.error(`Error executing find command: ${err.message}`);
}

// Create minimal files needed for Vercel
console.log('Creating minimal files needed for Vercel...');

// Create a minimal .vercel/output/config.json file
const vercelOutputDir = path.join(__dirname, '..', '.vercel', 'output');
if (!fs.existsSync(vercelOutputDir)) {
  fs.mkdirSync(vercelOutputDir, { recursive: true });
}

// Create a proper config.json file for Vercel
const configPath = path.join(vercelOutputDir, 'config.json');
fs.writeFileSync(configPath, JSON.stringify({
  "version": 3,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}, null, 2));

// Create a proper routes.json file in the output directory
const routesPath = path.join(outDir, 'routes.json');
fs.writeFileSync(routesPath, JSON.stringify({
  "version": 3,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}, null, 2));

// Create an empty routes-manifest.json file
const routesManifestPath = path.join(outDir, 'routes-manifest.json');
fs.writeFileSync(routesManifestPath, JSON.stringify({
  version: 3,
  basePath: "",
  pages404: true,
  redirects: [],
  headers: [],
  dynamicRoutes: [],
  staticRoutes: [],
  dataRoutes: [],
  rewrites: []
}, null, 2));

// Create a .nojekyll file to prevent GitHub Pages from ignoring files that start with an underscore
const nojekyllPath = path.join(outDir, '.nojekyll');
fs.writeFileSync(nojekyllPath, '');

console.log('Cleanup complete!');

// Clean up unnecessary script files
const scriptsToRemove = [
  'disable-middleware-completely.js',
  'prepare-vercel-deploy.js',
  'clean-vercel-deploy.js'
];

console.log('Removing unnecessary script files...');
scriptsToRemove.forEach(script => {
  const scriptPath = path.join(__dirname, script);
  if (fs.existsSync(scriptPath)) {
    console.log(`Removing script: ${scriptPath}`);
    fs.unlinkSync(scriptPath);
  }
});

console.log('All cleanup tasks completed successfully!'); 