import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import noop from 'lodash/noop';

// conext
import { useDigitalHumanPreview } from '@chatbot-test/core/digitalHumanPreview/PreviewContext';

// hooks
import { useDebounceFn } from 'ahooks';

// styles
const StyledChatPlaceholder = styled.div`
  width: 494px;
  height: 295px;
  margin-top: 60px;

  .welcome-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 10px;
    padding: 24px 61px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);

    p {
      color: #54565a;
      text-align: center;
      font-family: 'Helvetica Neue';
      font-size: 20px;
      font-style: normal;
      font-weight: 300;
      line-height: normal;
    }

    .title {
      font-weight: 500;
    }
  }
`;

export default function ChatPlaceholder({ viewUnit = 'vw', onChatPlaceholderClick = noop }) {
  const { isInitComplete } = useDigitalHumanPreview();
  const [clicked, setClicked] = useState(false);

  const { run: clickChatPlaceholder } = useDebounceFn(
    () => {
      onChatPlaceholderClick();
    },
    { wait: 1000 },
  );

  useEffect(() => {
    if (isInitComplete && !clicked) {
      clickChatPlaceholder();
      setClicked(true);
    }
  }, [isInitComplete, clicked, clickChatPlaceholder]);

  return (
    <StyledChatPlaceholder
      className="chat-placeholder"
      viewUnit={viewUnit}
      onClick={() => onChatPlaceholderClick('Hi')}
    >
      <div className="welcome-message">
        <p className="title">Welcome to the Self-Service Station</p>
        <p>Please touch the screen to chat with the virtual assistant</p>
      </div>
    </StyledChatPlaceholder>
  );
}
