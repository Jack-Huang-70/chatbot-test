import React, { useMemo, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// lodash
import noop from 'lodash/noop';
import get from 'lodash/get';

// context
import { useDigitalHumanPreview } from '@chatbot-test/core/digitalHumanPreview/PreviewContext';

// contanst
import { DEFAULT_VERTICAL_UI_CONFIG } from '@chatbot-test/components/UIConfig/defaultUIConfig/index';

// hooks
import useShowDrawer from '@/chatbot-packages/hooks/useShowDrawer.js';

// components
import { Modal } from 'antd';
import Hidden from '@mui/material/Hidden';
import Spinner from '@/chatbot-packages/ui/shared-components/Spinner';
import RatingBox from '@/chatbot-packages/ui/shared-components/RatingBox';
import AgreementPopupModal from '@/chatbot-packages/ui/shared-components/Modals/AgreementPopupModal';
import ChatRoomConfigModal from '@chatbot-test/components/UIConfig/configCreator/ChatRoomConfigModal';
import VerticalHeader from './ChatZone/VerticalHeader';
import VerticalButtonSet from './ChatZone/VerticalButtonSet';
import ChatContent from './ChatZone/ChatContent/Index';
import InputSection from './ChatZone/InputSection';

// styles
import { getStyle } from '../basicChatRoomUIStyles';

const StyledVerticalEntrancePage = styled.div`
  ${getStyle('vertical')}
`;

const StyledRatingBoxModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
  }
`;

const VIEW_UNIT = 'vh';

export default function VerticalEntrancePage({
  isPresenterViewOnlyChatbotPageStyle = {},
  isShowConfig = false,
  isShowPresenterPreviewState = true,
  isPresenterViewOnly = false,
  isVideoPlaying = false,
  isWaitForResponseBoomerangMode = false,
  chatHistoryArray = [],
  isStopRecording = false,
  isResponseLoadedAndReadyToPlay = false,
  playedHistoryIndexArray = [],
  playedResponseIndexArray = [],
  isLastContentAlreadyDisplay = false,
  isWaitingPlaybackVideo = false,
  isLoadingResponseMsg = false,
  isConnectionValid = false,
  serviceName = '',
  isPageLoading = true,
  passcode = '',
  isVertical = false,
  isMultipleLanguages = false,
  selectedServiceLanguage = '',
  profileStyleConfig = {},
  isNeedStopRecord = false,
  isNeedStartRecord = false,
  isLogined = false,
  checkLoginStatus = 'checking',
  isMobile = false,
  isConfigCreator = false,
  creatorStyleConfig = {},

  onEnableAudioInteractiveClick = noop,
  onSendMessage = noop,
  onDisconnectClick = noop,
  onPlaybackVideoClick = noop,
  onClearChatButtonClick = noop,
  onShowPresenterClickCallback = noop,
  setIsShowLoginTab = noop,
  setIsShowConfig = noop,
  setPlayedHistoryIndexArray = noop,
  setPlayedResponseIndexArray = noop,
  setIsShowPresenterPreviewState = noop,
  setIsNeedStopRecord = noop,
  setIsNeedStartRecord = noop,
  setSelectedServiceLanguage = noop,
  handleLiveChatPopup = noop,
  setIsNeedSkipVideo = noop,
}) {
  const {
    genDigitalHumanPreview,
    eventActiveConfig,
    isEventActive,
    eventActiveModelPositionStyle = {},
  } = useDigitalHumanPreview();

  const isDrawerActiveRef = useRef(true);

  const [isShowAgreementPopup, setIsShowAgreementPopup] = useState(false);
  const [isUsingAzure, setIsUsingAzure] = useState(false);
  const [isShowRatingBox, setIsShowRatingBox] = useState(false);

  const { updateDrawerConfig = noop, DrawerBoxContentComponent = null } = useShowDrawer({
    isDrawerActive: isDrawerActiveRef?.current,
  });

  const {
    chatRoomContentWrapConfig,
    chatRoomContentConfig,
    chatZoneWrapConfig,
    chatZoneConfig,
    modelPositionConfig,
    subtitleConfig,
    subtitleStyleConfig,
    skipButtonConfig,
    isShowButtonSet,
    isShowInputSectionClearButton,
    isShowInputSectionInputBar,
    isShowPresenterIconButtonSet,
    currentHeaderConfig,
    currentButtonSetConfig,
    currentChatZoneConfig,
    currentModelKioskConfig,
  } = useMemo(() => {
    const targetConfigFile = isConfigCreator ? creatorStyleConfig : DEFAULT_VERTICAL_UI_CONFIG;
    return {
      chatRoomContentWrapConfig: get(targetConfigFile, 'chatRoomContentWrapStyle', {}),
      chatRoomContentConfig: get(targetConfigFile, 'chatRoomContentStyle', {}),
      chatZoneWrapConfig: get(targetConfigFile, 'chatZoneWrapStyle', {}),
      chatZoneConfig: get(targetConfigFile, 'chatZoneStyle', {}),
      modelPositionConfig:
        Object.keys(profileStyleConfig).length > 0 && isPresenterViewOnly
          ? get(profileStyleConfig, 'modelPositionConfig', {})
          : get(targetConfigFile, 'modelPositionConfig', {}),
      subtitleConfig: get(targetConfigFile, 'subtitleConfig', {}),
      subtitleStyleConfig: get(targetConfigFile, 'subtitleStyleConfig', {}),
      skipButtonConfig: get(targetConfigFile, 'skipButtonConfig', {}),
      isShowPresenterInfo: get(targetConfigFile, 'isShowPresenterInfo', false),
      isShowButtonSet: get(targetConfigFile, 'isShowButtonSet', false),
      isShowInputSectionClearButton: get(targetConfigFile, 'isShowInputSectionClearButton', false),
      isShowInputSectionInputBar: get(targetConfigFile, 'isShowInputSectionInputBar', true),
      isShowPresenterIconButtonSet: get(targetConfigFile, 'isShowPresenterIconButtonSet', false),
      currentHeaderConfig: get(targetConfigFile, 'currentHeaderConfig', {}),
      currentButtonSetConfig: get(targetConfigFile, 'currentButtonSetConfig', {}),
      currentChatZoneConfig: get(targetConfigFile, 'currentChatZoneConfig', {}),
      currentModelKioskConfig: isEventActive
        ? {
            ...get(targetConfigFile, 'currentModelKioskConfig', {}),
            ...eventActiveModelPositionStyle,
          }
        : {
            ...get(targetConfigFile, 'currentModelKioskConfig', {
              marginLeft: '35%',
              transform: 'scale(0.7)',
              bottom: '-15%',
            }),
          },
    };
  }, [
    isPresenterViewOnly,
    profileStyleConfig,
    creatorStyleConfig,
    isConfigCreator,
    isEventActive,
    eventActiveModelPositionStyle,
  ]);

  useEffect(() => {
    if (checkLoginStatus === 'checking' || checkLoginStatus === 'success') {
      setIsShowAgreementPopup(false);
    } else {
      setIsShowAgreementPopup(true);
    }
  }, [checkLoginStatus]);

  return (
    <StyledVerticalEntrancePage
      className="chat-room-page"
      style={isPresenterViewOnlyChatbotPageStyle}
      viewUnit={VIEW_UNIT}
    >
      <div
        className="chat-room-content-wrap"
        style={isPresenterViewOnly ? {} : chatRoomContentWrapConfig}
      >
        <div className="chat-room-content" style={chatRoomContentConfig}>
          {genDigitalHumanPreview({
            modelPositionConfig: currentModelKioskConfig || modelPositionConfig,
            subtitleConfig,
            subtitleStyleConfig,
            skipButtonConfig,
            isShowPresenterIconButtonSet,
          })}
        </div>
      </div>

      {isPageLoading && (
        <div className="loading-spinner">
          <Spinner />
        </div>
      )}

      {!isPresenterViewOnly && (
        <div
          className="chat-zone-wrap"
          style={
            isShowPresenterPreviewState
              ? { ...chatZoneWrapConfig, opacity: isEventActive ? '0' : '1' }
              : {
                  ...chatZoneWrapConfig,
                  width: 'calc(100% - 48px)',
                  left: '24px',
                  opacity: isEventActive ? '0' : '1',
                }
          }
        >
          <div className="chat-zone" style={chatZoneConfig}>
            <ChatContent
              isChatHistoryMode={true}
              isSHowing={true}
              isWaitForResponseBoomerangMode={isWaitForResponseBoomerangMode}
              chatHistoryArray={chatHistoryArray}
              isStopRecording={isStopRecording}
              isVideoPlaying={isVideoPlaying}
              isVertical={isVertical}
              isReadyToPlay={isResponseLoadedAndReadyToPlay}
              playedHistoryIndexArray={playedHistoryIndexArray}
              playedResponseIndexArray={playedResponseIndexArray}
              isLastContentAlreadyDisplay={isLastContentAlreadyDisplay}
              isWaitingPlaybackVideo={isWaitingPlaybackVideo}
              isMultipleLanguages={isMultipleLanguages}
              selectedServiceLanguage={selectedServiceLanguage}
              viewUnit={VIEW_UNIT}
              customClientChatBackgroundColor={get(chatZoneConfig, 'clientChatBackgroundColor', '')}
              customFontSize={get(chatZoneConfig, 'fontSize', 1.2)}
              onSendMessage={onSendMessage}
              onPlaybackVideoClick={onPlaybackVideoClick}
              setPlayedHistoryIndexArray={setPlayedHistoryIndexArray}
              setPlayedResponseIndexArray={setPlayedResponseIndexArray}
              currentChatZoneConfig={currentChatZoneConfig}
              updateDrawerConfig={updateDrawerConfig}
              updateIsShowRatingBox={setIsShowRatingBox}
              onClearChatButtonClick={onClearChatButtonClick}
            />
          </div>

          <InputSection
            isVertical={isVertical}
            isLoadingResponseMsg={isLoadingResponseMsg}
            isConnectionValid={isConnectionValid && !isShowAgreementPopup}
            isStopRecording={isStopRecording}
            isLastContentAlreadyDisplay={isLastContentAlreadyDisplay}
            isWaitingPlaybackVideo={isWaitingPlaybackVideo}
            isShowPresenterPreviewState={isShowPresenterPreviewState}
            chatHistoryArray={chatHistoryArray}
            selectedServiceLanguage={selectedServiceLanguage}
            isMultipleLanguages={isMultipleLanguages}
            viewUnit={VIEW_UNIT}
            authWithPasscode={passcode}
            isShowInputSectionClearButton={isShowInputSectionClearButton}
            isShowInputSectionInputBar={isShowInputSectionInputBar}
            isNeedStopRecord={isNeedStopRecord}
            isNeedStartRecord={isNeedStartRecord}
            isUsingAzure={isUsingAzure}
            onSendMessage={onSendMessage}
            onEnableAudioInteractiveClick={onEnableAudioInteractiveClick}
            onClearChatButtonClick={onClearChatButtonClick}
            onShowPresenterClick={onShowPresenterClickCallback}
            setIsNeedStopRecord={setIsNeedStopRecord}
            setIsNeedStartRecord={setIsNeedStartRecord}
            setIsNeedSkipVideo={setIsNeedSkipVideo}
          />
        </div>
      )}
      <VerticalHeader
        clearSocket={onClearChatButtonClick}
        serviceName={serviceName}
        passcode={passcode}
        setIsShowLoginTab={setIsShowLoginTab}
        setSelectedServiceLanguage={setSelectedServiceLanguage}
        isUsingAzure={isUsingAzure}
        setIsUsingAzure={setIsUsingAzure}
        currentHeaderConfig={currentHeaderConfig}
      />

      <VerticalButtonSet
        handleLiveChatPopup={handleLiveChatPopup}
        currentButtonSetConfig={currentButtonSetConfig}
      />
      {isShowButtonSet && (
        <>
          <div className="control-button-wrap">
            {!isLogined && (
              <div
                className="control-button"
                onClick={() => setIsShowLoginTab(true)}
                style={{ width: `6${VIEW_UNIT}`, height: `2.5${VIEW_UNIT}` }}
              >
                <p>Login</p>
              </div>
            )}
            <div
              className="control-button"
              onClick={onClearChatButtonClick}
              style={{ width: `6${VIEW_UNIT}`, height: `2.5${VIEW_UNIT}` }}
            >
              <p>
                {isMultipleLanguages && selectedServiceLanguage.includes('zh')
                  ? '重新開始'
                  : 'Restart'}
              </p>
            </div>
          </div>
        </>
      )}

      {isDrawerActiveRef?.current && DrawerBoxContentComponent}

      {isShowRatingBox && (
        <StyledRatingBoxModal
          open={isShowRatingBox}
          width={668}
          height={256}
          style={{ top: '70vh' }}
          footer={null}
          closable={false}
          onCancel={() => {
            onSendMessage('5');
            setIsShowRatingBox(false);
          }}
        >
          <RatingBox
            starNumber={5}
            onSubmit={(score) => {
              onSendMessage(String(score));
              setIsShowRatingBox(false);
            }}
          />
        </StyledRatingBoxModal>
      )}

      <ChatRoomConfigModal
        title={`Profile config - Copyright © Pantheon Lab`}
        open={isShowConfig}
        onCancel={() => {
          setIsShowConfig(false);

          window.setTimeout(() => {
            window.location.href = `${window.location.origin}${
              window.location.pathname
            }?service=${serviceName}&passcode=${passcode}${
              isMultipleLanguages ? '&isMultipleLanguages=true' : ''
            }${isVertical ? '&kiosk=true' : ''}`;
          });
        }}
        isShowPresenterPreviewState={isShowPresenterPreviewState}
        isConnectionValid={isConnectionValid}
        onPresenterPreviewSelect={(value) => {
          if (value === 'show') {
            setIsShowPresenterPreviewState(true);
          } else if (value === 'hide') {
            setIsShowPresenterPreviewState(false);
          } else {
            Object.assign(document.createElement('a'), {
              target: '_blank',
              rel: 'noopener noreferrer',
              href: `${window.location.origin}${window.location.pathname}?service=${serviceName}&presenterViewOnly=true&passcode=${passcode}`,
            }).click();
          }
        }}
        onDisconnectClick={onDisconnectClick}
      />

      {isShowAgreementPopup && !isMobile && (
        <Hidden initialWidth="sm" lgDown>
          <AgreementPopupModal
            open={isShowAgreementPopup}
            onAgreebuttonClick={() => {
              setIsShowAgreementPopup(false);
            }}
          />
        </Hidden>
      )}

      {isEventActive && get(eventActiveConfig, 'EventSubtitleComponent', null)}
    </StyledVerticalEntrancePage>
  );
}
