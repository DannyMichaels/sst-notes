import React, { useState, useMemo } from 'react';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import {
  Alert as HelpBlock,
  FormGroup,
  FormControl,
  FormLabel as ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import { useFormFields } from '../lib/hooksLib';
import { onError } from '../lib/errorLib';
import './ChangeEmail.css';

export default function ChangeEmail() {
  const history = useHistory();
  const [codeSent, setCodeSent] = useState(false);
  const [fields, handleChange] = useFormFields({
    code: '',
    email: '',
  });
  const [userAttributes, setUserAttributes] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const emailVerified = useMemo(
    () => userAttributes[1]?.Value === 'true' ?? false,
    [userAttributes]
  );

  function validateEmailForm() {
    return fields.email.length > 0;
  }

  function validateConfirmForm() {
    return fields.code.length > 0;
  }

  async function handleUpdateClick(event) {
    event.preventDefault();
    setIsSendingCode(true);
    try {
      const user = await Auth.currentAuthenticatedUser();

      await Auth.updateUserAttributes(user, {
        email: fields.email,
      });

      let userAttributes = await Auth.userAttributes(user);
      setUserAttributes(userAttributes);

      setCodeSent(true);
    } catch (error) {
      onError(error);
      setIsSendingCode(false);
    }
  }

  async function handleConfirmClick(event) {
    event.preventDefault();
    setIsConfirming(true);

    try {
      await Auth.verifyCurrentUserAttributeSubmit('email', fields.code);
      history.push('/settings');
    } catch (error) {
      onError(error);
      setIsConfirming(false);
    }
  }

  function renderUpdateForm() {
    return (
      <form onSubmit={handleUpdateClick}>
        <FormGroup bsSize="large" controlId="email">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isSendingCode}
          disabled={!validateEmailForm()}>
          Update Email
        </LoaderButton>
      </form>
    );
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmClick}>
        <FormGroup bsSize="large" controlId="code">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={fields.code}
            onChange={handleChange}
          />
          <HelpBlock>
            Please check your email ({fields.email}) for the confirmation code.
          </HelpBlock>
        </FormGroup>

        {!emailVerified && (
          <div
            style={{ cursor: 'pointer', color: 'blue', padding: '10px' }}
            onClick={handleUpdateClick}>
            Re-send confirmation code
          </div>
        )}
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isConfirming}
          disabled={!validateConfirmForm()}>
          Confirm
        </LoaderButton>
      </form>
    );
  }

  return (
    <div className="ChangeEmail">
      {!codeSent ? renderUpdateForm() : renderConfirmationForm()}
    </div>
  );
}
