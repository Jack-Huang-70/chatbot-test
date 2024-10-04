import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import noop from 'lodash/noop';

// components
import { Input, Button } from 'antd';

const StyledUserAuthSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function UserAuthChecker({ onSubmit = noop }) {
  const [usernameState, setUsernameState] = useState('');
  const [passwordState, setPasswordState] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);

  const isValid = usernameState && passwordState;

  const submit = useCallback(() => {
    if (!submitClicked) {
      setSubmitClicked(true);
    }

    if (isValid) {
      onSubmit(usernameState, passwordState);
    }
  }, [isValid, onSubmit, passwordState, usernameState, submitClicked]);

  return (
    <StyledUserAuthSection className="user-auth-section">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '16px',
          }}
        >
          <p
            style={{
              width: '112px',
            }}
          >
            User Name:
          </p>
          <Input.Group compact>
            <Input
              value={usernameState}
              onChange={(evt) => {
                setUsernameState(evt.target.value);

                if (submitClicked) {
                  setSubmitClicked(false);
                }
              }}
              onPressEnter={submit}
            />
          </Input.Group>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '16px',
          }}
        >
          <p>Password:</p>
          <Input.Group compact>
            <Input
              type="password"
              value={passwordState}
              onChange={(evt) => {
                setPasswordState(evt.target.value);

                if (submitClicked) {
                  setSubmitClicked(false);
                }
              }}
              onPressEnter={submit}
            />
          </Input.Group>
        </div>

        <div className="buttons-section">
          <Button
            danger
            style={{
              marginRight: '16px',
            }}
            onClick={() => {
              setUsernameState('');
              setPasswordState('');
              setSubmitClicked(false);
            }}
          >
            Reset
          </Button>

          <Button type="primary" disabled={!isValid} onClick={submit}>
            Send
          </Button>
        </div>
      </div>

      {submitClicked && (
        <p
          style={{
            color: '#ff4d4f',
          }}
        >
          incorrect username or password
        </p>
      )}
    </StyledUserAuthSection>
  );
}
