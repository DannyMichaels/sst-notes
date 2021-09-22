import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Signup from './containers/Signup';
import NewNote from './containers/NewNote';
import NoteDetail from './containers/NoteDetail';
import Settings from './containers/Settings';
import ResetPassword from './containers/ResetPassword';

import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';

export default function Routes() {
  return (
    <Switch>
      <Route exact path={['/', '/notes']} component={Home} />
      <UnauthenticatedRoute exact path="/login" component={Login} />
      <UnauthenticatedRoute exact path="/signup" component={Signup} />
      <UnauthenticatedRoute
        exact
        path="/login/reset"
        component={ResetPassword}
      />
      <AuthenticatedRoute exact path="/notes/new" component={NewNote} />
      <AuthenticatedRoute exact path="/notes/:id" component={NoteDetail} />
      <AuthenticatedRoute exact path="/settings" component={Settings} />

      <Route component={NotFound} />
    </Switch>
  );
}
