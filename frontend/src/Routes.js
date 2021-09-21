import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Signup from './containers/Signup';
import NewNote from './containers/NewNote';
import NoteDetail from './containers/NoteDetail';

export default function Routes() {
  return (
    <Switch>
      <Route exact path={['/', '/notes']} component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/notes/new" component={NewNote} />
      <Route exact path="/notes/:id" component={NoteDetail} />

      <Route component={NotFound} />
    </Switch>
  );
}
