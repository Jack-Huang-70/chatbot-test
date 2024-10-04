import React from 'react';
import styled from 'styled-components';
import noop from 'lodash/noop';

// components
import { Modal } from 'antd';
import ChatRoomConfig from './ChatRoomConfig';

const StyledChatModal = styled(Modal)`
  width: 90% !important;
`;

export default function ChatRoomConfigModal({
  open = false,
  title = '',
  onCancel = noop,

  isShowPresenterPreviewState = false,
  isConnectionValid = false,
  isDesktop = false,
  onPresenterPreviewSelect = noop,
  onDisconnectClick = noop,
}) {
  return (
    <StyledChatModal
      className="chat-room-config-modal"
      title={title || `Profile config - Copyright © Pantheon Lab`}
      open={open}
      footer={null}
      centered={true}
      destroyOnClose={true}
      onCancel={onCancel}
    >
      <ChatRoomConfig
        isShowPresenterPreviewState={isShowPresenterPreviewState}
        isConnectionValid={isConnectionValid}
        isDesktop={isDesktop}
        onPresenterPreviewSelect={onPresenterPreviewSelect}
        onDisconnectClick={onDisconnectClick}
      />
    </StyledChatModal>
  );
}
