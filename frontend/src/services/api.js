import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transaction API
export const transactionAPI = {
  processTransaction: (transactionData) => 
    api.post('/transaction', transactionData),
  
  processDirect: (transactionData) => 
    api.post('/process', transactionData),
};

// Admin API
export const adminAPI = {
  getAllTransactions: () => 
    api.get('/admin/transactions'),
  
  getAllCards: () => 
    api.get('/admin/cards'),
  
  getTransactionsByStatus: (status) => 
    api.get(`/admin/transactions/status/${status}`),
};

// Customer API
export const customerAPI = {
  getTransactions: (cardNumber) => 
    api.get(`/customer/transactions/${cardNumber}`),
  
  getBalance: (cardNumber) => 
    api.get(`/customer/balance/${cardNumber}`),
  
  initiateTopup: (topupData) => 
    api.post('/customer/topup', topupData),
};

// Test data for demo purposes
export const testData = {
  cards: [
    { cardNumber: '4000123456789012', pin: '1234', balance: 1000.00 },
    { cardNumber: '4000123456789013', pin: '5678', balance: 500.00 },
    { cardNumber: '5000123456789012', pin: '9999', balance: 2000.00 },
  ],
  users: [
    { username: 'admin', password: 'admin123', role: 'ADMIN' },
    { username: 'customer', password: 'customer123', role: 'CUSTOMER' },
  ],
};

export default api; 