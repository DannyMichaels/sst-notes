import React, { useRef, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { onError } from '../lib/errorLib';
import config from '../config';
import Form from 'react-bootstrap/Form';
import LoaderButton from '../components/LoaderButton';
import { s3Upload } from '../lib/awsLib';
import './NoteDetail.css';

function getOneNote(id) {
  return API.get('notes', `/notes/${id}`);
}

function saveNote(id, noteData) {
  return API.put('notes', `/notes/${id}`, {
    body: noteData,
  });
}

function deleteNote(id) {
  return API.del('notes', `/notes/${id}`);
}

export default function NoteDetail() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, '');
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    let newAttachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        newAttachment = await s3Upload(file.current);
      }

      let updateNoteData = {
        content,
        attachment: newAttachment || note.attachment,
      };
      await saveNote(id, updateNoteData);
      history.push('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    );

    if (!confirmed) {
      return;
    }
    setIsDeleting(true);

    try {
      await deleteNote(id);
      history.push('/');
    } catch (error) {
      onError(error);
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    async function fetchNoteData() {
      try {
        const note = await getOneNote(id);
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
        setIsLoading(false);
      } catch (e) {
        onError(e);
      }
    }

    fetchNoteData();
  }, [id]);

  return (
    <div className="NoteDetail">
      {note && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {note.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${note.attachmentURL}`}>
                  {formatFilename(note.attachment)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}>
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}>
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}
