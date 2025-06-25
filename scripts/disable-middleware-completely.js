const fs = require('fs');
const path = require('path');

// Check if the .next directory exists
const nextDir = path.join(__dirname, '..', '.next');
if (!fs.existsSync(nextDir)) {
  console.error('Error: .next directory does not exist. Run next build first.');
  process.exit(1);
}

// Check if the middleware files exist
const middlewareManifestPath = path.join(nextDir, 'server', 'middleware-manifest.json');
if (fs.existsSync(middlewareManifestPath)) {
  console.log('Disabling middleware in middleware-manifest.json');
  fs.writeFileSync(middlewareManifestPath, JSON.stringify({
    version: 1,
    sortedMiddleware: [],
    middleware: {},
    functions: {},
    matchers: {}
  }, null, 2));
}

// Check if the middleware files exist
const middlewareChunkPath = path.join(nextDir, 'server', 'middleware-build-manifest.js');
if (fs.existsSync(middlewareChunkPath)) {
  console.log('Removing middleware-build-manifest.js');
  fs.unlinkSync(middlewareChunkPath);
}

// Check if the middleware chunk exists
const middlewareChunkJSONPath = path.join(nextDir, 'server', 'middleware-build-manifest.json');
if (fs.existsSync(middlewareChunkJSONPath)) {
  console.log('Removing middleware-build-manifest.json');
  fs.unlinkSync(middlewareChunkJSONPath);
}

// Check if the middleware chunk exists
const middlewareManifestJSONPath = path.join(nextDir, 'server', 'middleware-manifest.json');
if (fs.existsSync(middlewareManifestJSONPath)) {
  console.log('Removing middleware-manifest.json');
  fs.unlinkSync(middlewareManifestJSONPath);
}

console.log('Middleware completely disabled!'); 