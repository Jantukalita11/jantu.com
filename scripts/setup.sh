#!/bin/bash

# Audio AI Studio Setup Script
echo "🚀 Setting up Audio AI Studio..."

# Check Node.js version
node_version=$(node --version 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$node_version" ] || [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js 18+ is required. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install shared package dependencies
echo "📦 Installing shared package dependencies..."
cd shared && npm install && npm run build && cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

echo "✅ Dependencies installed successfully!"

# Setup environment files
echo "🔧 Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "📝 Created backend/.env from example. Please update with your configuration."
fi

if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.example frontend/.env.local
    echo "📝 Created frontend/.env.local from example."
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database and service credentials"
echo "2. Start PostgreSQL and Redis services"
echo "3. Run database migrations: cd backend && npm run db:migrate"
echo "4. Seed the database: cd backend && npm run db:seed"
echo "5. Start the development servers: npm run dev"
echo ""
echo "For more information, see README.md"