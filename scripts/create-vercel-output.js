const fs = require('fs');
const path = require('path');

// Define paths
const outDir = path.join(__dirname, '..', 'out');
const vercelOutputDir = path.join(__dirname, '..', '.vercel', 'output');
const vercelStaticDir = path.join(vercelOutputDir, 'static');

// Create directories if they don't exist
if (!fs.existsSync(vercelOutputDir)) {
  fs.mkdirSync(vercelOutputDir, { recursive: true });
}

if (!fs.existsSync(vercelStaticDir)) {
  fs.mkdirSync(vercelStaticDir, { recursive: true });
}

// Create config.json for Vercel
const configJson = {
  "version": 3,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "overrides": {
    "index.html": {
      "path": "index"
    }
  }
};

fs.writeFileSync(
  path.join(vercelOutputDir, 'config.json'),
  JSON.stringify(configJson, null, 2)
);

console.log('Created Vercel output config.json');

// Copy the entire 'out' directory to '.vercel/output/static'
// This is a simple recursive copy function
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  
  const files = fs.readdirSync(from);
  
  files.forEach(file => {
    const fromPath = path.join(from, file);
    const toPath = path.join(to, file);
    
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

// Copy the build output to the Vercel static directory
copyFolderSync(outDir, vercelStaticDir);

console.log('Copied build output to Vercel static directory');
console.log('Vercel output preparation complete!'); 