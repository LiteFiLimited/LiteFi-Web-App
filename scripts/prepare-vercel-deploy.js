const fs = require('fs');
const path = require('path');

// Check if the out directory exists
const outDir = path.join(__dirname, '..', 'out');
if (!fs.existsSync(outDir)) {
  console.error('Error: out directory does not exist. Run npm run build first.');
  process.exit(1);
}

// Create an empty routes-manifest.json file if it doesn't exist
// This is a workaround for Vercel deployment with static exports
const routesManifestPath = path.join(outDir, 'routes-manifest.json');
if (!fs.existsSync(routesManifestPath)) {
  console.log('Creating empty routes-manifest.json for Vercel compatibility');
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
}

console.log('Vercel deployment preparation complete!'); 