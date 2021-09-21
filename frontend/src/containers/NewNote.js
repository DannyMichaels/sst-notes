import { useState, useMemo, useRef } from 'react';
import config from '../config';
import Form from 'react-bootstrap/Form';
import LoaderButton from '../components/LoaderButton';
import { onError } from '../lib/errorLib';
import { useHistory } from 'react-router-dom';
import { API } from 'aws-amplify';
import './NewNote.css';
import { s3Upload } from '../lib/awsLib';

export default function NewNote() {
  const file = useRef(null);
  const history = useHistory();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = useMemo(() => content.length > 0, [content]);

  const handleFileChange = (e) => {
    file.current = e.target.files[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB`
      );
      return;
    }
    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      let newNote = {
        content,
        attachment,
      };

      await createNote(newNote);

      history.push('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };

  const createNote = (note) => {
    // api name notes, api route /notes
    return API.post('notes', '/notes', {
      body: note,
    });
  };

  return (
    <div className="NewNote">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={content}
            as="textarea"
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!isFormValid}>
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}
