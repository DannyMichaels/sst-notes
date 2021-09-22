import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Link } from 'react-router-dom';
import {
  Alert as HelpBlock,
  FormGroup,
  FormControl,
  FormLabel as ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import { useFormFields } from '../lib/hooksLib';
import { onError } from '../lib/errorLib';
import './ResetPassword.css';

const Glyphicon = () => <span></span>;

/*
 We ask the user to put in the email address for their account in the
renderRequestCodeForm().
• Once the user submits this form, we start the process by calling
Auth.forgotPassword(fields.email). Where Auth is a part of the AWS Amplify library.
• This triggers Cognito to send a verification code to the specified email address.
• Then we present a form where the user can input the code that Cognito sends them. This form
is rendered in renderConfirmationForm(). And it also allows the user to put in their new
password.
• Once they submit this form with the code and their new password, we call
Auth.forgotPasswordSubmit(fields.email, fields.code, fields.password).
This resets the password for the account.
• Finally, we show the user a sign telling them that their password has been successfully reset.
We also link them to the login page where they can login using their new details.
*/

export default function ResetPassword() {
  const [fields, handleChange] = useFormFields({
    code: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [codeSent, setCodeSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  function validateCodeForm() {
    return fields.email.length > 0;
  }

  function validateResetForm() {
    return (
      fields.code.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  async function handleSendCodeClick(event) {
    event.preventDefault();
    setIsSendingCode(true);
    try {
      await Auth.forgotPassword(fields.email);
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
      await Auth.forgotPasswordSubmit(
        fields.email,
        fields.code,
        fields.password
      );
      setConfirmed(true);
    } catch (error) {
      onError(error);
      setIsConfirming(false);
    }
  }

  function renderRequestCodeForm() {
    return (
      <form onSubmit={handleSendCodeClick}>
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
          disabled={!validateCodeForm()}>
          Send Confirmation
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
        <hr />
        <FormGroup bsSize="large" controlId="password">
          <ControlLabel>New Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup bsSize="large" controlId="confirmPassword">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            type="password"
            value={fields.confirmPassword}
            onChange={handleChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isConfirming}
          disabled={!validateResetForm()}>
          Confirm
        </LoaderButton>
      </form>
    );
  }

  function renderSuccessMessage() {
    return (
      <div className="success">
        <Glyphicon glyph="ok" />
        <p>Your password has been reset.</p>
        <p>
          <Link to="/login">
            Click here to login with your new credentials.
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="ResetPassword">
      {!codeSent
        ? renderRequestCodeForm()
        : !confirmed
        ? renderConfirmationForm()
        : renderSuccessMessage()}
    </div>
  );
}
