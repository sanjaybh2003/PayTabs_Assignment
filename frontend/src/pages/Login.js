import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { testData } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple authentication (in a real app, this would be handled by the backend)
    const user = testData.users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // Store user info in localStorage for demo purposes
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/customer');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <h2>Banking System POC</h2>
          <p>Please sign in to continue</p>
        </div>

        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Sign In
          </Button>
        </Form>

        <div className="mt-4">
          <h6>Test Credentials:</h6>
          <div className="small text-muted">
            <div><strong>Admin:</strong> username=admin, password=admin123</div>
            <div><strong>Customer:</strong> username=customer, password=customer123</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login; 