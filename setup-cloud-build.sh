#!/bin/bash

# LiteFi Web App Cloud Build Setup Script
# This script sets up Cloud Build triggers and removes manually deployed services

set -e

PROJECT_ID="atomic-key-464116-m5"
REPO_NAME="LiteFi-Web-App"
REPO_OWNER="LiteFiLimited"
SERVICE_NAME="litefi-frontend"
REGION="us-central1"

echo "🚀 Setting up Cloud Build for LiteFi Web App"
echo "Project: $PROJECT_ID"
echo "Repository: $REPO_OWNER/$REPO_NAME"

# Set the project
echo "Setting GCP project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Check if the manual service exists and delete it
echo "Checking for existing manually deployed services..."
if gcloud run services describe $SERVICE_NAME --region=$REGION --quiet 2>/dev/null; then
    echo "⚠️  Found existing service: $SERVICE_NAME"
    echo "🗑️  Deleting manually deployed service..."
    gcloud run services delete $SERVICE_NAME --region=$REGION --quiet
    echo "✅ Manually deployed service deleted"
else
    echo "ℹ️  No existing service found"
fi

# Create Cloud Build trigger for staging branch
echo "Creating Cloud Build trigger for staging branch..."
gcloud builds triggers create github \
    --repo-name=$REPO_NAME \
    --repo-owner=$REPO_OWNER \
    --branch-pattern="^staging$" \
    --build-config=cloudbuild.yaml \
    --name="litefi-webapp-staging" \
    --description="Deploy LiteFi Web App from staging branch" \
    --include-logs-with-status

echo "✅ Cloud Build trigger created successfully!"

# Set up IAM permissions for Cloud Build
echo "Setting up IAM permissions..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Grant Cloud Run Admin role to Cloud Build service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$CLOUD_BUILD_SA" \
    --role="roles/run.admin"

# Grant Service Account User role to Cloud Build service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$CLOUD_BUILD_SA" \
    --role="roles/iam.serviceAccountUser"

echo "✅ IAM permissions configured"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Summary:"
echo "- Enabled required APIs"
echo "- Removed manually deployed service (if existed)"
echo "- Created Cloud Build trigger for 'staging' branch"
echo "- Configured IAM permissions"
echo ""
echo "📝 Next steps:"
echo "1. Push your code to the 'staging' branch"
echo "2. The trigger will automatically build and deploy your app"
echo "3. Monitor the build at: https://console.cloud.google.com/cloud-build/triggers"
echo ""
echo "🔗 Your app will be deployed to:"
echo "   https://litefi-frontend-741585839791.us-central1.run.app"
