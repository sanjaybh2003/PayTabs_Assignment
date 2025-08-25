#!/bin/bash

# Banking System POC - Setup Script
# This script helps set up and run the banking system

echo "=== Banking System POC Setup ==="
echo ""

# Check if Java is installed
echo "Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 11 or higher."
    echo "   Download from: https://adoptium.net/"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 11 ]; then
    echo "❌ Java version $JAVA_VERSION detected. Java 11 or higher is required."
    exit 1
fi

echo "✅ Java version $(java -version 2>&1 | head -n 1 | cut -d'"' -f2) detected"

# Check if Maven is installed
echo "Checking Maven installation..."
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6 or higher."
    echo "   Download from: https://maven.apache.org/download.cgi"
    exit 1
fi

echo "✅ Maven version $(mvn -version | head -n 1 | cut -d' ' -f3) detected"

# Check if Node.js is installed
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Node.js 14 or higher is required."
    exit 1
fi

echo "✅ Node.js version $(node -v) detected"

# Check if npm is installed
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version $(npm -v) detected"

echo ""
echo "=== Building Backend ==="

# Build the backend
cd backend
echo "Building Spring Boot application..."
mvn clean install -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Backend build failed. Please check the error messages above."
    exit 1
fi

echo "✅ Backend built successfully"

echo ""
echo "=== Setting up Frontend ==="

# Install frontend dependencies
cd ../frontend
echo "Installing React dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Frontend setup failed. Please check the error messages above."
    exit 1
fi

echo "✅ Frontend dependencies installed"

cd ..

echo ""
echo "=== Setup Complete ==="
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend"
echo "   mvn spring-boot:run"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8080"
echo "   - H2 Database Console: http://localhost:8080/h2-console"
echo ""
echo "4. Test credentials:"
echo "   - Admin: username=admin, password=admin123"
echo "   - Customer: username=customer, password=customer123"
echo ""
echo "5. Test API endpoints:"
echo "   ./test-api.sh"
echo ""
echo "Happy banking! 🏦" 