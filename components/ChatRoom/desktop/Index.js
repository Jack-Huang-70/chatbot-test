import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import noop from 'lodash/noop';
import get from 'lodash/get';
import Image from 'next/image';

// hooks
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';

// context
import { useDigitalHumanPreview } from '@chatbot-test/core/digitalHumanPreview/PreviewContext';

// contanst
import {
  DEFAULT_DESKTOP_UI_CONFIG,
  DEFAULT_VERTICAL_UI_CONFIG,
  TYPE_V1_UI_CONFIG,
} from '@chatbot-test/components/UIConfig/defaultUIConfig/index';

// components
import { Dropdown } from 'antd';
import Hidden from '@mui/material/Hidden';
import Spinner from '@/chatbot-packages/ui/shared-components/Spinner';
import AgreementPopupModal from '@/chatbot-packages/ui/shared-components/Modals/AgreementPopupModal';
import ChatRoomConfigModal from '@chatbot-test/components/UIConfig/configCreator/ChatRoomConfigModal';
import PresenterInfoBar from './PresenterInfoBar';
import ChatHistory from './ChatZone/ChatContent';
import InputSection from './ChatZone/InputSection';

// styles
import PantheonlabLogo from '@chatbot-test/public/test/assets/pantheon_lab_logo.png';

import { getStyle } from '../basicChatRoomUIStyles';

const StyledCDesktopEntrancePage = styled.div`
  ${getStyle('desktop')}
`;

const LANGUAGES_LIST_LABEL_MAP = {
  en_US: 'English',
  zh_HK: '廣東話',
  zh_CN: '普通話',
  ja_JP: '日本語',
};
export default function DesktopEntrancePage({
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
  isDesktop = true,
  isVertical = false,
  isChatHistoryMode = true,
  isMultipleLanguages = false,
  isConfigCreator = false,
  creatorStyleConfig = {},
  isNeedStopRecord = false,
  isNeedStartRecord = false,
  isLogined = false,
  checkLoginStatus = 'checking',
  isMobile = false,
  isNeedPrivacyPolicy = false,
  isUseTWDomain = false,
  isHideDigitalHuman = false,
  selectedServiceLanguage = 'en-US',

  onEnableAudioInteractiveClick = noop,
  setIsShowConfig = noop,
  onSendMessage = noop,
  setPlayedHistoryIndexArray = noop,
  setPlayedResponseIndexArray = noop,
  setIsShowPresenterPreviewState = noop,
  onDisconnectClick = noop,
  onPlaybackVideoClick = noop,
  onClearChatButtonClick = noop,
  onShowPresenterClickCallback = noop,
  setSelectedServiceLanguage = noop,
  setIsNeedStopRecord = noop,
  setIsNeedStartRecord = noop,
}) {
  const { cachedFrontendProfileJson } = useProfileConfig();

  const [isShowAgreementPopup, setIsShowAgreementPopup] = useState(false);

  const { profileStyleConfig, isHasLogo, logoDetail, isNeedMultipleLanguages, languagesList } =
    useMemo(() => {
      return {
        profileStyleConfig: get(cachedFrontendProfileJson, 'data', {}),
        isHasLogo:
          get(cachedFrontendProfileJson, ['data', 'basicConfig', 'logoConfig'], null) !== null,
        logoDetail: get(cachedFrontendProfileJson, ['data', 'basicConfig', 'logoConfig'], {}),
        isNeedMultipleLanguages: get(
          cachedFrontendProfileJson,
          ['data', 'basicConfig', 'isNeedMultipleLanguages'],
          false,
        ),
        languagesList: get(
          cachedFrontendProfileJson,
          ['data', 'basicConfig', 'languagesList'],
          ['en-US', 'zh-HK', 'zh-CN'],
        ),
      };
    }, [cachedFrontendProfileJson]);

  const {
    chatRoomContentWrapConfig,
    chatRoomContentConfig,
    chatZoneWrapConfig,
    chatZoneConfig,
    modelPositionConfig,
    placeholderConfig,
    subtitleConfig,
    subtitleStyleConfig,
    skipButtonConfig,
    isShowPresenterInfo,
    isShowButtonSet,
    isShowInputSectionClearButton,
    isShowInputSectionInputBar,
    isShowPresenterIconButtonSet,
    isHideInputAtPlaceholder,
  } = useMemo(() => {
    let targetConfigFile = '';

    if (isConfigCreator) {
      targetConfigFile = creatorStyleConfig;
    } else if (!isShowPresenterPreviewState) {
      targetConfigFile = TYPE_V1_UI_CONFIG;
    } else if (Object.keys(profileStyleConfig).length > 0 && !isPresenterViewOnly) {
      targetConfigFile = profileStyleConfig;
    } else if (isDesktop) {
      targetConfigFile = DEFAULT_DESKTOP_UI_CONFIG;
    } else if (isVertical) {
      targetConfigFile = DEFAULT_VERTICAL_UI_CONFIG;
    } else {
      targetConfigFile = TYPE_V1_UI_CONFIG;
    }

    return {
      chatRoomContentWrapConfig: get(targetConfigFile, 'chatRoomContentWrapStyle', {}),
      chatRoomContentConfig: get(targetConfigFile, 'chatRoomContentStyle', {}),
      chatZoneWrapConfig: get(targetConfigFile, 'chatZoneWrapStyle', {}),
      chatZoneConfig: get(targetConfigFile, 'chatZoneStyle', {}),
      modelPositionConfig:
        Object.keys(profileStyleConfig).length > 0 && isPresenterViewOnly
          ? get(profileStyleConfig, 'modelPositionConfig', {})
          : get(targetConfigFile, 'modelPositionConfig', {}),
      placeholderConfig: get(targetConfigFile, 'chatPlaceholderStyle', {}),
      subtitleConfig: get(targetConfigFile, 'subtitleConfig', {}),
      subtitleStyleConfig: get(targetConfigFile, 'subtitleStyleConfig', {}),
      skipButtonConfig: get(targetConfigFile, 'skipButtonConfig', {}),
      isShowPresenterInfo: get(targetConfigFile, 'isShowPresenterInfo', false),
      isShowButtonSet: get(targetConfigFile, 'isShowButtonSet', false),
      isShowInputSectionClearButton: get(targetConfigFile, 'isShowInputSectionClearButton', false),
      isShowInputSectionInputBar: get(targetConfigFile, 'isShowInputSectionInputBar', true),
      isShowPresenterIconButtonSet: get(targetConfigFile, 'isShowPresenterIconButtonSet', false),
      isHideInputAtPlaceholder: get(
        targetConfigFile,
        ['chatPlaceholderStyle', 'isHideInput'],
        false,
      ),
    };
  }, [
    creatorStyleConfig,
    isConfigCreator,
    isVertical,
    isPresenterViewOnly,
    isShowPresenterPreviewState,
    isDesktop,
    profileStyleConfig,
  ]);

  const languagesItems = useMemo(() => {
    return languagesList.map((data, index) => {
      const label = get(LANGUAGES_LIST_LABEL_MAP, `${data.replace('-', '_')}`, data);
      return {
        label: (
          <div
            style={{
              height: '48px',
              backgroundColor: '#87D2E6',
              color: 'white',
              fontSize: '24px',
              textAlign: 'center',
              fontFamily: 'Lexend',
              marginBottom: '2px',
              paddingTop: '8px',
            }}
            onClick={() => {
              onClearChatButtonClick();
              setSelectedServiceLanguage(data);
            }}
          >
            {label}
          </div>
        ),
        key: `${1 + index}`,
      };
    });
  }, [languagesList, onClearChatButtonClick, setSelectedServiceLanguage]);

  const { genDigitalHumanPreview } = useDigitalHumanPreview();

  useEffect(() => {
    if (checkLoginStatus === 'checking' || checkLoginStatus === 'success' || !isNeedPrivacyPolicy) {
      setIsShowAgreementPopup(false);
    } else {
      setIsShowAgreementPopup(true);
    }
  }, [checkLoginStatus, isNeedPrivacyPolicy]);

  const viewUnit = useMemo(() => (isVertical ? 'vh' : 'vw'), [isVertical]);

  return (
    <StyledCDesktopEntrancePage
      className="chat-room-page"
      style={isPresenterViewOnlyChatbotPageStyle}
      viewUnit={viewUnit}
    >
      {!isHideDigitalHuman && (
        <div
          className="chat-room-content-wrap"
          style={isPresenterViewOnly ? {} : chatRoomContentWrapConfig}
        >
          <div className="chat-room-content" style={chatRoomContentConfig}>
            {genDigitalHumanPreview({
              modelPositionConfig,
              subtitleConfig,
              subtitleStyleConfig,
              skipButtonConfig,
              isShowPresenterIconButtonSet,
            })}
          </div>
        </div>
      )}
      {!isPresenterViewOnly && (
        <div
          className="chat-zone-wrap"
          style={
            isShowPresenterPreviewState
              ? chatZoneWrapConfig
              : {
                  ...chatZoneWrapConfig,
                  width: 'calc(100% - 48px)',
                  left: '24px',
                }
          }
        >
          {isShowPresenterInfo && (
            <PresenterInfoBar
              isMultipleLanguages={isMultipleLanguages}
              selectedServiceLanguage={selectedServiceLanguage}
            />
          )}
          <div className="chat-zone" style={chatZoneConfig}>
            <ChatHistory
              isChatHistoryMode={isChatHistoryMode}
              isShowing={isChatHistoryMode}
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
              viewUnit={viewUnit}
              customClientChatBackgroundColor={get(chatZoneConfig, 'clientChatBackgroundColor', '')}
              placeholderConfig={placeholderConfig}
              customFontSize={get(chatZoneConfig, 'fontSize', 0.83)}
              isUseTWDomain={isUseTWDomain}
              onSendMessage={onSendMessage}
              onPlaybackVideoClick={onPlaybackVideoClick}
              setPlayedHistoryIndexArray={setPlayedHistoryIndexArray}
              setPlayedResponseIndexArray={setPlayedResponseIndexArray}
              setSelectedServiceLanguage={setSelectedServiceLanguage}
            />

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
              isMultipleLanguages={isMultipleLanguages || isNeedMultipleLanguages}
              viewUnit={viewUnit}
              authWithPasscode={passcode}
              isShowInputSectionClearButton={isShowInputSectionClearButton}
              isShowInputSectionInputBar={isShowInputSectionInputBar}
              isNeedStopRecord={isNeedStopRecord}
              isNeedStartRecord={isNeedStartRecord}
              isHideInputAtPlaceholder={isHideInputAtPlaceholder}
              onSendMessage={onSendMessage}
              onEnableAudioInteractiveClick={onEnableAudioInteractiveClick}
              onClearChatButtonClick={onClearChatButtonClick}
              onShowPresenterClick={onShowPresenterClickCallback}
              setIsNeedStopRecord={setIsNeedStopRecord}
              setIsNeedStartRecord={setIsNeedStartRecord}
              setSelectedServiceLanguage={setSelectedServiceLanguage}
            />
          </div>
        </div>
      )}
      {isShowButtonSet && (
        <div className="control-button-wrap">
          {isNeedMultipleLanguages && (
            <div
              className="control-button"
              style={{ width: `7${viewUnit}`, height: `2.5${viewUnit}`, padding: '0px' }}
            >
              <Dropdown
                menu={{
                  items: languagesItems,
                  style: {
                    backgroundColor: '#87D2E6',
                  },
                }}
                trigger={['click']}
              >
                <p
                  style={{
                    opacity: isChatHistoryMode ? 1 : 0.4,
                  }}
                >
                  {selectedServiceLanguage.includes('zh') ? '語言' : 'Languages'}
                </p>
              </Dropdown>
            </div>
          )}
          {!isLogined && (
            <div
              className="control-button"
              onClick={() => (window.location.href = '/')}
              style={{ width: `6${viewUnit}`, height: `2.5${viewUnit}` }}
            >
              <p>Login</p>
            </div>
          )}
          <div
            className="control-button"
            onClick={onClearChatButtonClick}
            style={{ width: `6${viewUnit}`, height: `2.5${viewUnit}` }}
          >
            <p>{selectedServiceLanguage.includes('zh') ? '重新開始' : 'Restart'}</p>
          </div>
        </div>
      )}

      {isHasLogo && (
        <div
          style={{
            position: 'absolute',
            zIndex: 5,
            bottom: get(logoDetail, 'bottom', '12px') || '24px',
            left: get(logoDetail, 'left', '12px') || '24px',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '17%',
            flexDirection: 'column',
            padding: '16px',
            backgroundColor: 'rgba(135,210,210,1)',
          }}
        >
          {get(logoDetail, 'images', []).map((data, index) => {
            if (data === 'Company') {
              return (
                <Image
                  src={PantheonlabLogo}
                  alt="pantheon-lab-logo"
                  height="50"
                  key={`logo-image-${index}`}
                  style={{ objectFit: 'contain' }}
                />
              );
            }
            return (
              <Image
                src={data}
                alt={`other-logo`}
                key={`logo-image-${index}`}
                style={{ objectFit: 'contain' }}
                width="100"
                height="50"
              />
            );
          })}
        </div>
      )}

      {isPageLoading && (
        <div className="loading-spinner">
          <Spinner />
        </div>
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
        isDesktop={isDesktop}
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
    </StyledCDesktopEntrancePage>
  );
}
