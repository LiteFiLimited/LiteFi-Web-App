#!/bin/bash

# Manual deployment script for LiteFi Web App
# Use this to trigger a build manually without pushing to staging

set -e

PROJECT_ID="atomic-key-464116-m5"
REGION="us-central1"

echo "🚀 Triggering manual deployment for LiteFi Web App"

# Set the project
gcloud config set project $PROJECT_ID

# Get the latest commit SHA
COMMIT_SHA=$(git rev-parse HEAD)
echo "Current commit: $COMMIT_SHA"

# Submit build manually
echo "Submitting build to Cloud Build..."
gcloud builds submit \
    --config=cloudbuild.yaml \
    --substitutions=COMMIT_SHA=$COMMIT_SHA \
    .

echo "✅ Build submitted successfully!"
echo "Monitor progress at: https://console.cloud.google.com/cloud-build/builds"
