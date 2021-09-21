import { useState, useMemo } from 'react';
import { Auth } from 'aws-amplify';
import Form from 'react-bootstrap/Form';
import './Login.css';
import { useAppContext } from '../lib/contextLib';
import { useHistory } from 'react-router';
import LoaderButton from '../components/LoaderButton';
import { onError } from '../lib/errorLib';
import { useFormFields } from '../lib/hooksLib';

export default function Login() {
  const [fields, handleChange] = useFormFields({
    email: '',
    password: '',
  });
  const { email, password } = fields;

  const [isLoading, setIsLoading] = useState(false);
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
      await Auth.signIn(email, password); // returns a signed in user object in promise
      userHasAuthenticated(true);
      history.push('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        {/* bootstrap makes controlId render id in inspect tab */}
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={handleChange}
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
