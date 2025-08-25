import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, Table, Badge, Button, 
  Navbar, Alert, Spinner 
} from 'react-bootstrap';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load real data from backend
      const [transactionsResponse, cardsResponse] = await Promise.all([
        adminAPI.getAllTransactions(),
        adminAPI.getAllCards()
      ]);

      setTransactions(transactionsResponse.data);
      setCards(cardsResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in and is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.username || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    loadData();
  }, [navigate, loadData]);

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

  // Calculate statistics
  const totalTransactions = transactions.length;
  const successfulTransactions = transactions.filter(t => t.status === 'SUCCESS').length;
  const totalCards = cards.length;
  const withdrawalTransactions = transactions.filter(t => t.type === 'WITHDRAW').length;
  const successfulWithdrawals = transactions.filter(t => t.type === 'WITHDRAW' && t.status === 'SUCCESS').length;
  const topupTransactions = transactions.filter(t => t.type === 'TOPUP').length;
  const successfulTopups = transactions.filter(t => t.type === 'TOPUP' && t.status === 'SUCCESS').length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Banking System - Super Admin Dashboard</Navbar.Brand>
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
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-number">{totalTransactions}</div>
                <div className="stats-label">Total Transactions</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-number">{successfulTransactions}</div>
                <div className="stats-label">Successful Transactions</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-number">{totalCards}</div>
                <div className="stats-label">Total Cards</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <div className="stats-number">{successfulTransactions > 0 ? Math.round((successfulTransactions / totalTransactions) * 100) : 0}%</div>
                <div className="stats-label">Success Rate</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Withdrawal Statistics */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="stats-card" style={{ borderLeft: '4px solid #ffc107' }}>
              <Card.Body>
                <div className="stats-number">{withdrawalTransactions}</div>
                <div className="stats-label">Total Withdrawals</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card" style={{ borderLeft: '4px solid #28a745' }}>
              <Card.Body>
                <div className="stats-number">{successfulWithdrawals}</div>
                <div className="stats-label">Successful Withdrawals</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card" style={{ borderLeft: '4px solid #007bff' }}>
              <Card.Body>
                <div className="stats-number">{topupTransactions}</div>
                <div className="stats-label">Total Top-ups</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">All Transactions</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Card Number</th>
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
                          <td>{transaction.cardNumber}</td>
                          <td>
                            <Badge bg={transaction.type === 'WITHDRAW' ? 'warning' : 'primary'}>
                              {transaction.type}
                            </Badge>
                          </td>
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
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Card Information</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Card Number</th>
                        <th>Balance</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cards.map((card, index) => (
                        <tr key={index}>
                          <td>{card.cardNumber}</td>
                          <td>{formatAmount(card.balance)}</td>
                          <td>
                            {card.cardNumber.startsWith('4') 
                              ? <Badge bg="success">Supported</Badge>
                              : <Badge bg="warning" text="dark">Unsupported</Badge>
                            }
                          </td>
                          <td>{formatDate(card.createdAt)}</td>
                          <td>{formatDate(card.updatedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard; 