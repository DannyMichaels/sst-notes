import { useState, useEffect } from 'react';
import { useAppContext } from '../lib/contextLib';
import ListGroup from 'react-bootstrap/ListGroup';
import { onError } from '../lib/errorLib';
import './Home.css';
import { API } from 'aws-amplify';
import { LinkContainer } from 'react-router-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';

const getNotes = () => API.get('notes', '/notes');

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  const renderNotesList = () => {
    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>
        {notes.map((note) => (
          <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {note.content.trim().split('\n')[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(note.createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  };

  const renderLander = () => {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Scratch</h1>
          <p className="text-muted">A simple note taking app</p>
        </div>
      </div>
    );
  };

  const renderNotes = () => {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  };

  useEffect(() => {
    const fetchNotes = async () => {
      if (!isAuthenticated) return;

      try {
        const notes = await getNotes(); // only gets notes that belong to that user
        setNotes(notes);
      } catch (error) {
        onError(error);
      }
      setIsLoading(false);
    };
    fetchNotes();
  }, [isAuthenticated]);

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
