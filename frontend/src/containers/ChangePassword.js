import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
  FormLabel as ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import { useFormFields } from '../lib/hooksLib';
import { onError } from '../lib/errorLib';
import './ChangePassword.css';

export default function ChangePassword() {
  const [isChanging, setIsChanging] = useState(false);
  const history = useHistory();

  const [fields, handleChange] = useFormFields({
    password: '', // new password
    oldPassword: '',
    confirmPassword: '', // confirm new password
  });

  function validateForm() {
    return (
      fields.oldPassword.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  async function handleSubmitClick(event) {
    event.preventDefault();
    setIsChanging(true);
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(
        currentUser,
        fields.oldPassword,
        fields.password
      );
      history.push('/settings');
    } catch (error) {
      onError(error);
      setIsChanging(false);
    }
  }

  return (
    <div className="ChangePassword">
      <form onSubmit={handleSubmitClick}>
        <FormGroup bsSize="large" controlId="oldPassword">
          <ControlLabel>Old Password</ControlLabel>
          <FormControl
            type="password"
            onChange={handleChange}
            value={fields.oldPassword}
          />
        </FormGroup>
        <hr />
        <FormGroup bsSize="large" controlId="password">
          <ControlLabel>New Password</ControlLabel>
          <FormControl
            type="password"
            onChange={handleChange}
            value={fields.password}
          />
        </FormGroup>
        <FormGroup bsSize="large" controlId="confirmPassword">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            type="password"
            onChange={handleChange}
            value={fields.confirmPassword}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          disabled={!validateForm()}
          isLoading={isChanging}>
          Change Password
        </LoaderButton>
      </form>
    </div>
  );
}
