#!/bin/bash

# RCE Career Hub - Environment Setup Script

echo "Setting up RCE Career Hub..."
echo ""
echo "Please provide the following information:"
echo ""

read -p "Enter MongoDB Atlas URI (mongodb+srv://...): " MONGODB_URI
read -p "Enter Google Client ID: " GOOGLE_CLIENT_ID
read -p "Enter Google Client Secret: " GOOGLE_CLIENT_SECRET
read -p "Enter JWT Secret (any random string): " JWT_SECRET
read -p "Enter Email User (for notifications): " EMAIL_USER
read -p "Enter Email Password (for notifications): " EMAIL_PASSWORD

# Create .env.local file
cat > .env.local << EOF
# MongoDB
MONGODB_URI=$MONGODB_URI

# Google OAuth
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
NEXTAUTH_URL=http://localhost:3000

# Security
JWT_SECRET=$JWT_SECRET

# Email Notifications
EMAIL_USER=$EMAIL_USER
EMAIL_PASSWORD=$EMAIL_PASSWORD

# App Config
NEXT_PUBLIC_APP_NAME=RCE Career Hub
NEXT_PUBLIC_APP_DESCRIPTION=College Placement Portal
EOF

echo ""
echo "✓ Environment file created at .env.local"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your actual values"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo ""
