import './App.css';
import Navbar from 'react-bootstrap/Navbar';

function App() {
  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
        <Navbar.Brand className="font-weight-bold text-muted">
          Scratch
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar>
    </div>
  );
}

export default App;
