import { useState, useMemo } from 'react';
import { Auth } from 'aws-amplify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = useMemo(
    () => email.length > 0 && password.length > 0,
    [email, password]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const signedInUser = await Auth.signIn(email, password);
      console.log({ signedInUser });
      alert('Logged in!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!isFormValid}>
          Login
        </Button>
      </Form>
    </div>
  );
}
