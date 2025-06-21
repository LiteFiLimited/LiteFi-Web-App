#!/bin/bash

# Script to build, export, and zip LiteFi Web App for cPanel deployment
# Created: $(date)

# Set deployment directory
DEPLOY_DIR="/Users/dreytech/Projects/LiteFi-Web-App/deployment"
ZIP_FILE="$DEPLOY_DIR/CPanel-deployment.zip"
PROJECT_DIR="/Users/dreytech/Projects/LiteFi-Web-App"

echo "=== LiteFi Web App cPanel Deployment Script ==="
echo "This script will prepare the app for cPanel deployment using https://litefi-backend.onrender.com as the API endpoint."

# Create deployment directory if it doesn't exist
if [ ! -d "$DEPLOY_DIR" ]; then
  echo "Creating deployment directory: $DEPLOY_DIR"
  mkdir -p "$DEPLOY_DIR"
fi

# Navigate to project directory
cd "$PROJECT_DIR" || { echo "Failed to navigate to project directory"; exit 1; }

# Step 1: Update the API configuration to use the Render backend
echo "Updating API configuration to use https://litefi-backend.onrender.com..."

# Create a production .env file
cat > .env.production << EOL
NEXT_PUBLIC_API_URL=https://litefi-backend.onrender.com
BACKEND_API_URL=https://litefi-backend.onrender.com
EOL

# Also create a .env file to be bundled with the deployment
cat > .env << EOL
NEXT_PUBLIC_API_URL=https://litefi-backend.onrender.com
BACKEND_API_URL=https://litefi-backend.onrender.com
EOL

# Backup the original api.ts file
echo "Backing up original api.ts file..."
cp lib/api.ts lib/api.original.ts

# Copy the deployment version of api.ts
echo "Using deployment-ready api.ts file..."
cp lib/api.deploy.ts lib/api.ts

# Step 2: Build the Next.js application
echo "Building the Next.js application..."
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed! Exiting."
  exit 1
fi

# Step 3: Clean the deployment directory and copy build files
echo "Cleaning deployment directory..."
rm -rf "$DEPLOY_DIR"/*

# Create a temporary directory for the build files
TEMP_BUILD_DIR="$DEPLOY_DIR/build_files"
mkdir -p "$TEMP_BUILD_DIR"

# Copy the build files to the temporary directory
echo "Copying build files to temporary directory..."
cp -R out/* "$TEMP_BUILD_DIR"

# Copy the .env file to ensure the correct API URL is used
echo "Adding environment configuration..."
cp .env "$TEMP_BUILD_DIR/.env"

# Add the API connection test script
echo "Adding API connection test script..."
mkdir -p "$TEMP_BUILD_DIR/js"
cp lib/deploy-test.js "$TEMP_BUILD_DIR/js/api-test.js"

# Create a small HTML file to test the API connection
cat > "$TEMP_BUILD_DIR/api-test.html" << EOL
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LiteFi API Connection Test</title>
  <script src="/js/api-test.js"></script>
</head>
<body>
  <h1 style="text-align:center;margin-top:50px;">LiteFi API Connection Test</h1>
  <div style="text-align:center;">
    <p>This page tests the connection to the LiteFi backend API.</p>
    <p>API URL: https://litefi-backend.onrender.com</p>
    <button id="test-button" style="padding:10px 20px;background-color:#f44336;color:white;border:none;border-radius:4px;cursor:pointer;">
      Test Backend Connection
    </button>
    <div id="result" style="margin:20px;padding:10px;"></div>
  </div>
  <script>
    document.getElementById('test-button').addEventListener('click', async function() {
      const resultDiv = document.getElementById('result');
      resultDiv.innerText = 'Testing connection...';
      resultDiv.style.backgroundColor = '#fffde7';
      resultDiv.style.padding = '10px';
      resultDiv.style.borderRadius = '4px';
      
      try {
        const response = await fetch('https://litefi-backend.onrender.com');
        const data = await response.text();
        
        resultDiv.innerText = `Connection successful! Server responded with status: ${response.status}`;
        resultDiv.style.backgroundColor = '#e8f5e9';
        console.log('Connection test success:', data);
      } catch (error) {
        resultDiv.innerText = `Connection failed: ${error.message}`;
        resultDiv.style.backgroundColor = '#ffebee';
        console.error('Connection test failed:', error);
      }
    });
  </script>
</body>
</html>
EOL

# Create a .htaccess file for cPanel
cat > "$TEMP_BUILD_DIR/.htaccess" << EOL
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOL

# Step 4: Zip the deployment directory
echo "Creating zip file for cPanel deployment..."
cd "$TEMP_BUILD_DIR" || { echo "Failed to navigate to build directory"; exit 1; }
zip -r "$ZIP_FILE" .

# Clean up the temporary build directory, leaving only the zip file
echo "Cleaning up temporary files..."
cd "$DEPLOY_DIR" || { echo "Failed to navigate to deployment directory"; exit 1; }
rm -rf "$TEMP_BUILD_DIR"

# Step 5: Cleanup and finalize
echo "Deployment package created successfully!"
echo "ZIP file is available at: $ZIP_FILE"
echo "Ready for cPanel upload."

# Restore original api.ts file to not affect local development
cd "$PROJECT_DIR" || { echo "Failed to navigate to project directory"; exit 1; }
if [ -f "lib/api.original.ts" ]; then
  echo "Restoring original api.ts file..."
  mv lib/api.original.ts lib/api.ts
fi

echo "=== Deployment process completed ==="
