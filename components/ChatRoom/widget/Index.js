import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import noop from 'lodash/noop';
import get from 'lodash/get';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import cx from 'classnames';

// context
import { useDigitalHumanPreview } from '@chatbot-test/core/digitalHumanPreview/PreviewContext';

// components
import Div100vh from 'react-div-100vh';
import Spinner from '@/chatbot-packages/ui/shared-components/Spinner';
import ChatHistory from './ChatZone/ChatContent';
import InputSection from './ChatZone/InputSection';

// hooks
import { useMount } from 'ahooks';

// contansts
import { DEFAULT_WIDGET_UI_CONFIG } from '@chatbot-test/components/UIConfig/defaultUIConfig/index';

// styles
import { getStyle } from '../basicChatRoomUIStyles';

const StyledWidgetEntrancePage = styled(Div100vh)`
  ${getStyle('widget')}
`;

export default function WidgetEntrancePage({
  isPresenterViewOnlyChatbotPageStyle = {},
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
  isPageLoading = true,
  isChatHistoryMode = true,
  isConfigCreator = false,
  creatorStyleConfig = {},
  profileStyleConfig = {},
  isHideDigitalHuman = false,
  sessionStartTime = null,
  isFullScreenChatbotOnMobile = false,
  onEnableAudioInteractiveClick = noop,
  onSendMessage = noop,
  setPlayedHistoryIndexArray = noop,
  setPlayedResponseIndexArray = noop,
  onPlaybackVideoClick = noop,
}) {
  const [isOnMobile, setIsOnMobile] = useState(false);

  const {
    // modelPositionConfig,
    chatZoneWrapConfig,
    chatZoneConfig,
    modelWrapConfig,
    subtitleConfig,
    subtitleStyleConfig,
    skipButtonConfig,
    widgetLayoutConfig,
    headerStyleConfig,
    sessionStartTimeConfig,
    inputContentConfig,
    inputContentWrapConfig,
    messageBoxCustomStyle,
    sessionStartDateFormat,
    choiceCustomStyle,
    choiceWrapCustomStyle,
  } = useMemo(() => {
    let targetConfigFile = '';

    if (isConfigCreator) {
      targetConfigFile = creatorStyleConfig;
    } else if (Object.keys(profileStyleConfig).length > 0) {
      targetConfigFile = profileStyleConfig;
    } else {
      targetConfigFile = DEFAULT_WIDGET_UI_CONFIG;
    }

    const widgetConfig = get(targetConfigFile, 'widgetConfig', {});
    const allSessionStartTimeConfig = get(widgetConfig, 'sessionStartTimeConfig', {});
    const { sessionTimeFormat, ...filteredSessionStartTimeStyle } = allSessionStartTimeConfig;
    return {
      chatZoneWrapConfig: get(widgetConfig, 'chatZoneWrapStyle', {}),
      chatZoneConfig: get(widgetConfig, 'chatZoneStyle', {}),
      modelWrapConfig: get(widgetConfig, 'modelWrapStyle', {}),
      modelPositionConfig: get(widgetConfig, 'modelPositionConfig', {}),
      subtitleConfig: get(widgetConfig, 'subtitleConfig', {}),
      subtitleStyleConfig: get(widgetConfig, 'subtitleStyleConfig', {}),
      widgetLayoutConfig: get(widgetConfig, 'widgetLayoutConfig', {}),
      skipButtonConfig: get(widgetConfig, 'skipButtonConfig', {}),
      headerStyleConfig: get(widgetConfig, 'headerStyleConfig', {}),
      sessionStartTimeConfig: filteredSessionStartTimeStyle,
      inputContentConfig: get(widgetConfig, 'inputContentConfig', {}),
      inputContentWrapConfig: get(widgetConfig, 'inputContentWrapConfig', {}),
      messageBoxCustomStyle: get(widgetConfig, 'messageBoxCustomStyle', {}),
      sessionStartDateFormat: sessionTimeFormat,
      choiceCustomStyle: get(widgetConfig, 'choiceCustomStyle', {}),
      choiceWrapCustomStyle: get(widgetConfig, 'choiceWrapCustomStyle', {}),
    };
  }, [creatorStyleConfig, isConfigCreator, profileStyleConfig]);

  const formattedSessionStartTime = useMemo(() => {
    const dateFormat = sessionStartDateFormat || 'yyyy-MM-dd, HH:mm';
    return isValid(sessionStartTime)
      ? format(sessionStartTime, dateFormat)
      : format(Date.now(), dateFormat);
  }, [sessionStartDateFormat, sessionStartTime]);

  const { genDigitalHumanPreview } = useDigitalHumanPreview();

  useMount(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsOnMobile(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent));
  });

  return (
    <StyledWidgetEntrancePage
      className={cx('chatbot-widget-page', {
        'full-screen-chatbot-on-mobile': isOnMobile && isFullScreenChatbotOnMobile,
      })}
      style={{ ...isPresenterViewOnlyChatbotPageStyle, ...widgetLayoutConfig }}
    >
      <div
        className="widget-header"
        style={{
          position: 'absolute',
          top: '0px',
          ...headerStyleConfig,
        }}
      />

      {!isHideDigitalHuman && (
        <div
          className="chat-room-content-wrap"
          style={
            isOnMobile && isFullScreenChatbotOnMobile
              ? {
                  width: '55%',
                  display: 'flex',
                  zIndex: 5,
                  ...modelWrapConfig,
                }
              : {
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  zIndex: 5,
                  ...modelWrapConfig,
                }
          }
        >
          <div className="chat-room-content">
            {genDigitalHumanPreview({
              modelPositionConfig:
                isOnMobile && isFullScreenChatbotOnMobile
                  ? {
                      top: '20px',
                      transform: 'scale(1.25)',
                    }
                  : {
                      top: '0px',
                      transform: 'scale(1)',
                    },
              subtitleConfig,
              subtitleStyleConfig,
              skipButtonConfig,
            })}
          </div>
        </div>
      )}

      <div
        className="chat-zone"
        style={
          isHideDigitalHuman
            ? {
                padding: '8px',
                ...chatZoneWrapConfig,
              }
            : { ...chatZoneWrapConfig }
        }
      >
        <div
          className="widget-header"
          style={{
            display: 'none',
            height: '12px',
            textAlign: 'center',
            lineHeight: '200%',
            ...sessionStartTimeConfig,
          }}
        >
          {formattedSessionStartTime}
        </div>

        <ChatHistory
          isChatHistoryMode={isChatHistoryMode}
          isShowing={isChatHistoryMode}
          isWaitForResponseBoomerangMode={isWaitForResponseBoomerangMode}
          chatHistoryArray={chatHistoryArray}
          isStopRecording={isStopRecording}
          isVideoPlaying={isVideoPlaying}
          isReadyToPlay={isResponseLoadedAndReadyToPlay}
          playedHistoryIndexArray={playedHistoryIndexArray}
          playedResponseIndexArray={playedResponseIndexArray}
          isLastContentAlreadyDisplay={isLastContentAlreadyDisplay}
          isWaitingPlaybackVideo={isWaitingPlaybackVideo}
          customClientChatBackgroundColor={get(chatZoneConfig, 'clientChatBackgroundColor', '')}
          customClientChatTextColor={get(chatZoneConfig, 'clientChatTextColor', '')}
          isHideDigitalHuman={isHideDigitalHuman}
          themeColor={get(chatZoneConfig, 'themeColor', '')}
          messageBoxCustomStyle={messageBoxCustomStyle}
          choiceCustomStyle={choiceCustomStyle}
          choiceWrapCustomStyle={choiceWrapCustomStyle}
          onSendMessage={onSendMessage}
          onPlaybackVideoClick={onPlaybackVideoClick}
          setPlayedHistoryIndexArray={setPlayedHistoryIndexArray}
          setPlayedResponseIndexArray={setPlayedResponseIndexArray}
        />

        <InputSection
          isLoadingResponseMsg={isLoadingResponseMsg}
          isConnectionValid={isConnectionValid}
          isStopRecording={isStopRecording}
          isLastContentAlreadyDisplay={isLastContentAlreadyDisplay}
          isWaitingPlaybackVideo={isWaitingPlaybackVideo}
          chatHistoryArray={chatHistoryArray}
          themeColor={get(chatZoneConfig, 'themeColor', '')}
          inputPlaceholderChat={get(chatZoneConfig, 'inputPlaceholderChat', '')}
          inputContentWrapConfig={inputContentWrapConfig}
          isShowInsideInputRecord={get(inputContentConfig, 'isShowInsideInputRecord', true)}
          isShowOutsideRecord={get(inputContentConfig, 'isShowOutsideRecord', false)}
          isShowSendButton={get(inputContentConfig, 'isShowSendButton', true)}
          sendButtonText={get(inputContentConfig, 'sendButtonText', 'Enter')}
          sendButtonRight={get(inputContentConfig, 'sendButtonRight', '2px')}
          onSendMessage={onSendMessage}
          onEnableAudioInteractiveClick={onEnableAudioInteractiveClick}
        />
      </div>

      {isPageLoading && (
        <div className="loading-spinner">
          <Spinner />
        </div>
      )}
    </StyledWidgetEntrancePage>
  );
}
