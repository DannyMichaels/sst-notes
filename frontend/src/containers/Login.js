import { useState, useMemo } from 'react';
import { Auth } from 'aws-amplify';
import Form from 'react-bootstrap/Form';
import './Login.css';
import { useAppContext } from '../lib/contextLib';
import { useHistory } from 'react-router';
import LoaderButton from '../components/LoaderButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { userHasAuthenticated } = useAppContext();
  const history = useHistory();

  const isFormValid = useMemo(
    () => email.length > 0 && password.length > 0,
    [email, password]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const signedInUser = await Auth.signIn(email, password);
      console.log({ signedInUser });
      userHasAuthenticated(true);
      history.push('/');
    } catch (error) {
      alert(error.message);
      setIsLoading(false);
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
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!isFormValid}>
          Login
        </LoaderButton>
      </Form>
    </div>
  );
}
