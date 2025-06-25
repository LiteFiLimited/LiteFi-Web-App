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

// Create an empty middleware-manifest.json file
// This is a workaround for Vercel deployment with static exports
const middlewareManifestPath = path.join(outDir, 'middleware-manifest.json');
if (!fs.existsSync(middlewareManifestPath)) {
  console.log('Creating empty middleware-manifest.json for Vercel compatibility');
  fs.writeFileSync(middlewareManifestPath, JSON.stringify({
    version: 3,
    sortedMiddleware: [],
    middleware: {},
    functions: {},
    matchers: {}
  }, null, 2));
}

// Create an empty server directory with a middleware.js file
// This is needed because Vercel expects middleware files in the server directory
const serverDir = path.join(outDir, 'server');
if (!fs.existsSync(serverDir)) {
  console.log('Creating server directory for Vercel compatibility');
  fs.mkdirSync(serverDir, { recursive: true });
}

// Create a dummy middleware.js file that does nothing
const middlewarePath = path.join(serverDir, 'middleware.js');
if (!fs.existsSync(middlewarePath)) {
  console.log('Creating dummy middleware.js for Vercel compatibility');
  fs.writeFileSync(middlewarePath, `
// This is a dummy middleware file for static exports
// It does nothing and is only here to satisfy Vercel's expectations
export default function middleware() {
  return Response.next();
}
  `);
}

console.log('Vercel deployment preparation complete!'); 