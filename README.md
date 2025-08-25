# Banking System POC

A simplified banking system that demonstrates core banking functionalities, transaction processing, card validation, and role-based transaction monitoring with secure practices.

## Architecture

The system consists of two interconnected systems:

### System 1 (Transaction Gateway)
- Accepts transaction requests (withdrawals and top-ups) via API
- Performs basic validation
- Routes transactions to System 2 based on card number range
- Only processes cards starting with '4' (Visa simulation)

### System 2 (Transaction Processor)
- Validates card details and authenticates PIN using SHA-256 hashing
- Checks and updates card balance
- Processes withdrawals and top-ups
- Returns success/failure responses

### Frontend (React.js)
- **Super Admin UI**: Monitors all transactions across the system
- **Customer UI**: Views transaction history, balance, and initiates top-ups

## Technology Stack

- **Backend**: Java Spring Boot
- **Frontend**: React.js
- **Database**: In-memory H2 database
- **Security**: SHA-256 hashing for PINs
- **Build Tool**: Maven

## Project Structure

```
PayTabs_Assignment/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/java/
│   │   │   └── com/banking/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       ├── config/
│   │   │       └── util/
│   │   └── resources/
│   └── pom.xml
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── public/
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 11 or higher
- Node.js 14 or higher
- Maven 3.6 or higher

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

## API Endpoints

### System 1 (Transaction Gateway)
- `POST /api/transaction` - Process transaction requests

### System 2 (Transaction Processor)
- `POST /api/process` - Validate and process transactions

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Admin APIs
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/cards` - Get all cards

### Customer APIs
- `GET /api/customer/transactions` - Get customer transactions
- `GET /api/customer/balance/{cardNumber}` - Get card balance
- `POST /api/customer/topup` - Initiate top-up

## Test Data

The system comes pre-loaded with test data:

### Cards
- Card: `4000123456789012`, PIN: `1234`, Balance: `1000.00`
- Card: `4000123456789013`, PIN: `5678`, Balance: `500.00`
- Card: `5000123456789012`, PIN: `9999`, Balance: `2000.00` (unsupported range)

### Users
- **Super Admin**: username: `admin`, password: `admin123`
- **Customer**: username: `customer`, password: `customer123`

## Example API Requests

### Transaction Request (System 1)
```bash
curl -X POST http://localhost:8080/api/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "cardNumber": "4000123456789012",
    "pin": "1234",
    "amount": 100.00,
    "type": "withdraw"
  }'
```

### Top-up Request
```bash
curl -X POST http://localhost:8080/api/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "cardNumber": "4000123456789012",
    "pin": "1234",
    "amount": 50.00,
    "type": "topup"
  }'
```

## Test Cases

### Successful Scenarios
1. Valid withdrawal with sufficient balance
2. Valid top-up with correct PIN
3. Super Admin can view all transactions
4. Customer can view own transactions and balance

### Failure Scenarios
1. Invalid card number
2. Invalid PIN
3. Insufficient balance for withdrawal
4. Unsupported card range (not starting with '4')
5. Negative amount
6. Invalid transaction type

## Security Features

- PIN hashing using SHA-256
- No plain-text PIN storage or logging
- Role-based access control
- Input validation and sanitization

## UI Access

- **Super Admin**: http://localhost:3000/admin
- **Customer**: http://localhost:3000/customer

Login with the provided test credentials to access the respective interfaces. 