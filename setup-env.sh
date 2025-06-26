#!/bin/bash

# Hoppn Environment Setup Script
echo "🍽️  Hoppn Environment Setup"
echo "=========================="
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Copy template to .env
cp env.template .env

echo "✅ .env file created from template!"
echo ""
echo "📝 Next steps:"
echo "1. Open the .env file in your editor"
echo "2. Replace the placeholder values with your actual credentials"
echo "3. Save the file"
echo ""
echo "🔑 Required credentials to get:"
echo "   - Supabase Project URL (from supabase.com dashboard)"
echo "   - Supabase Anon Key (from supabase.com dashboard)"
echo ""
echo "📱 For now, you only need the Supabase credentials to get started."
echo "   The other services (Stripe, Mapbox, etc.) can be added later."
echo ""
echo "🚀 After updating .env, run 'npm run dev' to test the connection!" 