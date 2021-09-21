import { useAppContext } from '../lib/contextLib';
import { Route, Redirect } from 'react-router-dom';

export default function UnauthenticatedRoute({ children, ...rest }) {
  const { isAuthenticated } = useAppContext();

  return (
    <Route {...rest}>{!isAuthenticated ? children : <Redirect to="/" />}</Route>
  );
}
