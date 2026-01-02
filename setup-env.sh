#!/bin/bash

# Setup script to create .env.local from template

echo "Setting up environment file for NeonDB and Cloudinary..."
echo ""

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy template to .env.local
if [ -f env.template ]; then
    cp env.template .env.local
    echo "✅ Created .env.local from template"
    echo ""
    echo "📝 Next steps:"
    echo "1. Open .env.local in your editor"
    echo "2. Replace the placeholder values with your actual credentials:"
    echo "   - DATABASE_URL: Get from https://console.neon.tech"
    echo "   - CLOUDINARY_CLOUD_NAME: Get from https://console.cloudinary.com"
    echo "   - CLOUDINARY_API_KEY: Get from https://console.cloudinary.com"
    echo "   - CLOUDINARY_API_SECRET: Get from https://console.cloudinary.com"
    echo ""
    echo "3. Save the file and restart your development server"
else
    echo "❌ Error: env.template file not found!"
    exit 1
fi

