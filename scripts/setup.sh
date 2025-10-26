#!/bin/bash

# Create server .env
cat > ../server/.env << EOL
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:5173
DATABASE_URL=mysql://root:@localhost:3306/taptask
JWT_SECRET=dev_jwt_secret_key_123
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
EOL

# Create client .env
cat > ../client/.env << EOL
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
EOL

# Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS taptask;"

# Install dependencies
cd ..
npm install

cd client
npm install

cd ../server
npm install

cd ../shared
npm install

# Run database migrations
cd ../server
npx drizzle-kit push:mysql

echo "Setup complete! You can now start the development servers:"
echo "Terminal 1: cd server && npm run dev"
echo "Terminal 2: cd client && npm run dev"
