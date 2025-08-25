import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Table, Badge, Button, 
  Navbar, Alert, Spinner, Form, Modal 
} from 'react-bootstrap';
import { customerAPI, transactionAPI } from '../services/api';

const CustomerDashboard = () => {
  const [selectedCard, setSelectedCard] = useState('');
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupPin, setTopupPin] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPin, setWithdrawPin] = useState('');
  const [topupLoading, setTopupLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const navigate = useNavigate();

  const loadCardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Load balance from backend
      const balanceResponse = await customerAPI.getBalance(selectedCard);
      setBalance(balanceResponse.data.balance);

      // Load transactions from backend
      const transactionsResponse = await customerAPI.getTransactions(selectedCard);
      setTransactions(transactionsResponse.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading card data:', err);
      setError('Failed to load card data');
      setLoading(false);
    }
  }, [selectedCard]);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.username) {
      navigate('/login');
      return;
    }

    // Set default card for demo
    setSelectedCard('4000123456789012');
  }, [navigate]);

  useEffect(() => {
    if (selectedCard) {
      loadCardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCard, loadCardData]);

  const handleTransaction = async (e, type) => {
    e.preventDefault();
    
    const amount = type === 'topup' ? topupAmount : withdrawAmount;
    const pin = type === 'topup' ? topupPin : withdrawPin;
    const setLoading = type === 'topup' ? setTopupLoading : setWithdrawLoading;
    
    if (!amount || !pin) {
      setError('Please fill in all fields');
      return;
    }

    // Validate PIN (numbers only)
    if (!/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Call backend API for transaction
      const response = await transactionAPI.processTransaction({
        cardNumber: selectedCard,
        pin: pin,
        amount: numAmount,
        type: type
      });

      if (response.data.success) {
        // Update balance and transactions
        await loadCardData();
        
        // Reset form
        if (type === 'topup') {
          setTopupAmount('');
          setTopupPin('');
          setShowTopupModal(false);
        } else {
          setWithdrawAmount('');
          setWithdrawPin('');
          setShowWithdrawModal(false);
        }
        
        alert(`${type === 'topup' ? 'Top-up' : 'Withdrawal'} successful!`);
      } else {
        setError(response.data.message || `${type === 'topup' ? 'Top-up' : 'Withdrawal'} failed`);
      }
    } catch (err) {
      console.error(`${type} error:`, err);
      setError(err.response?.data?.message || `${type === 'topup' ? 'Top-up' : 'Withdrawal'} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (e, setPin) => {
    const value = e.target.value;
    // Only allow numbers and limit to 4 digits
    if (/^\d{0,4}$/.test(value)) {
      setPin(value);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge bg="success">Success</Badge>;
      case 'FAILED':
        return <Badge bg="danger">Failed</Badge>;
      case 'DECLINED':
        return <Badge bg="warning" text="dark">Declined</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Banking System - Customer Dashboard</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="dashboard-container">
        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Select Card</Form.Label>
              <Form.Select 
                value={selectedCard} 
                onChange={(e) => setSelectedCard(e.target.value)}
              >
                <option value="4000123456789012">4000123456789012</option>
                <option value="4000123456789013">4000123456789013</option>
                <option value="5000123456789012">5000123456789012</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-end gap-2">
            <Button 
              variant="primary" 
              onClick={() => setShowTopupModal(true)}
              disabled={!selectedCard}
            >
              Initiate Top-up
            </Button>
            <Button 
              variant="warning" 
              onClick={() => setShowWithdrawModal(true)}
              disabled={!selectedCard}
            >
              Initiate Withdrawal
            </Button>
          </Col>
        </Row>

        {balance !== null && (
          <Row className="mb-4">
            <Col>
              <Card className="balance-display">
                <Card.Body>
                  <h4>Current Balance</h4>
                  <h2>{formatAmount(balance)}</h2>
                  <small>Card: {selectedCard}</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Transaction History</h5>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Message</th>
                          <th>Balance After</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.type}</td>
                            <td>{formatAmount(transaction.amount)}</td>
                            <td>{getStatusBadge(transaction.status)}</td>
                            <td>{transaction.message}</td>
                            <td>
                              {transaction.balanceAfter 
                                ? formatAmount(transaction.balanceAfter)
                                : '-'
                              }
                            </td>
                            <td>{formatDate(transaction.timestamp)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Top-up Modal */}
      <Modal show={showTopupModal} onHide={() => setShowTopupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Initiate Top-up</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => handleTransaction(e, 'topup')}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                value={selectedCard}
                disabled
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter amount"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>PIN (4 digits only)</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter 4-digit PIN"
                value={topupPin}
                onChange={(e) => handlePinChange(e, setTopupPin)}
                maxLength="4"
                pattern="[0-9]{4}"
                required
              />
              <Form.Text className="text-muted">
                Enter exactly 4 digits
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTopupModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={topupLoading}>
              {topupLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Processing...
                </>
              ) : (
                'Submit Top-up'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Withdrawal Modal */}
      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Initiate Withdrawal</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => handleTransaction(e, 'withdraw')}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                value={selectedCard}
                disabled
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0.01"
                max={balance || 0}
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Available balance: {formatAmount(balance || 0)}
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>PIN (4 digits only)</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter 4-digit PIN"
                value={withdrawPin}
                onChange={(e) => handlePinChange(e, setWithdrawPin)}
                maxLength="4"
                pattern="[0-9]{4}"
                required
              />
              <Form.Text className="text-muted">
                Enter exactly 4 digits
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowWithdrawModal(false)}>
              Cancel
            </Button>
            <Button variant="warning" type="submit" disabled={withdrawLoading}>
              {withdrawLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Processing...
                </>
              ) : (
                'Submit Withdrawal'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerDashboard; 