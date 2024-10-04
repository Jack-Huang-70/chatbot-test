import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import cx from 'classnames';

// lodash
import noop from 'lodash/noop';
import get from 'lodash/get';
import last from 'lodash/last';
import Image from 'next/image';

// hooks
import { usePrevious } from 'ahooks';
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';
import useAzureSpeechToText from '@/chatbot-packages/hooks/useAzureSpeechToText';
import useSpeechRecognition from '@/chatbot-packages/hooks/useSpeechRecognition';
import useHotKeyControl from '@/chatbot-packages/hooks/useHotKeyControl';

// utils
import getLanguageUICopyWriting from '@/chatbot-packages/utils/getLanguageUICopyWriting';

// components
import { message } from 'antd';

// styles
import RecordIcon from '@chatbot-test/public/test/assets/Voice_button.png';
import RecordingIcon from '@chatbot-test/public/test/assets/Voice_button_recording.png';
import RestartButton from '@chatbot-test/public/test/assets/mobileRestart.png';
import SoundWave from '@chatbot-test/public/test/assets/soundWave.png';
import { SelectOutlined } from '@ant-design/icons';

const StyledInputSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .clear-chat-button {
    width: 144px;
    height: 48px;
    margin-left: 16px;
    border-radius: 1000px;
    border: solid 1px #d9d9d9;
    background-color: #fff;

    > span {
      font-family: Lexend;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      color: #000;
    }

    &.disabled {
      background-color: lightgray;
      cursor: not-allowed;

      > span {
        color: #fff;
      }
    }
  }
  .input-box {
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;
    height: 4.44vh;
    margin-right: 40px;
    margin-left: 48px;
    padding: 14px 16px;
    border-radius: 1000px;
    border: solid 1px #d9d9d9;
    background-color: #fff;
    box-sizing: border-box;

    > input {
      width: 90%;
      padding: 0px 8px;
      border: none;

      &:focus-visible {
        outline-offset: 0px;
        outline: none;
      }
      &::placeholder {
        opacity: 0.25;
      }
    }
    .send-button {
      position: absolute;
      top: 0.9vh;
      right: 24px;
      padding: 0px;
      border: none;
      font-family: Lexend;
      font-size: 1.7vh;
      font-weight: 500;
      color: #8db5e6;

      &.disabled {
        cursor: not-allowed;
        color: lightgray;
      }
    }

    &.disabled {
      cursor: not-allowed;

      > input {
        cursor: not-allowed;
      }
    }
  }

  .record-button {
    height: 7.66vh;
    width: 7.66vh;
    background-position: center center;
    background-size: cover;
    background-color: transparent;
    background-image: transparent;
    cursor: pointer;
    border: none;

    &.disabled {
      filter: grayscale(1);
      cursor: not-allowed;
    }
  }
  .open-in-new-tab {
    position: absolute;
    left: 6px;
    bottom: 6px;
    z-index: 2;
    cursor: pointer;

    svg {
      width: 16px;
      height: 16px;
    }
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(240, 129, 128, 0.7);
    }
    80% {
      box-shadow: 0 0 0 14px rgba(240, 129, 128, 0);
    }
  }
`;

const StyledMobileInputSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .clear-chat-button {
    height: 5vh;
    margin: 8px 12px 0px 0px;
    border-radius: 1000px;
    border: solid 1px #d9d9d9;
    background-color: #fff;

    > span {
      font-family: Lexend;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      color: #000;
    }

    &.disabled {
      background-color: lightgray;
      cursor: not-allowed;

      > span {
        color: #fff;
      }
    }
  }
  .input-box {
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;
    height: 5vh;
    padding: 14px 16px;
    border-radius: 1000px;
    border: solid 1px #d9d9d9;
    background-color: #fff;
    box-sizing: border-box;
    margin: 8px 12px 0px 12px;

    > input {
      width: 90%;
      padding: 0px 8px;
      border: none;

      &:focus-visible {
        outline-offset: 0px;
        outline: none;
      }
      &::placeholder {
        opacity: 0.25;
      }
    }
    .send-button {
      background: linear-gradient(145.93deg, #7399fb 8.85%, #8db5e6 87.18%);
      position: absolute;
      right: 4px;
      height: 95%;
      width: 23%;
      border-radius: 1000px;
      border: none;
      font-family: Lexend;
      font-size: 2.2vw;
      font-weight: 500;
      color: white;

      &.disabled {
        cursor: not-allowed;
        color: lightgray;
        background: gray;
      }
    }

    &.disabled {
      cursor: not-allowed;

      > input {
        cursor: not-allowed;
      }
    }
  }
  .mobile-record-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5vh;
    p {
      color: white;
      font-size: 1.5vh;
      font-family: Lexend;
    }
    &.disabled {
      filter: grayscale(1);
      cursor: not-allowed;
    }
  }
  .record-button {
    height: 4vh;
    background-color: transparent;
    background-image: transparent;
    cursor: pointer;
    border: none;
    display: flex;
    p {
      font-size: 20px;
      line-height: 0px;
    }

    &.disabled {
      filter: grayscale(1);
      cursor: not-allowed;
    }
  }
  .open-in-new-tab {
    position: absolute;
    left: 6px;
    bottom: 6px;
    z-index: 2;
    cursor: pointer;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const OVERTIME_TO_ABORT_LISTENING = 10 * 1000;

export default function InputSection({
  isShowPresenterPreviewState = true,
  isLoadingResponseMsg = false,
  isConnectionValid = true,
  isStopRecording = false,
  isLastContentAlreadyDisplay = true,
  isWaitingPlaybackVideo = false,
  authWithPasscode = '',
  isShowInputSectionClearButton = false,
  isShowInputSectionInputBar = true,
  chatHistoryArray = [],
  isMultipleLanguages = false,
  selectedServiceLanguage = '',
  viewUnit = 'vw',
  isMobile = false,
  isMobileRecordPart = false,
  isNeedStopRecord = false,
  isNeedStartRecord = false,
  isHideInputAtPlaceholder = false,

  onSendMessage = noop,
  onEnableAudioInteractiveClick = noop,
  onClearChatButtonClick = noop,
  onShowPresenterClick = noop,
  setIsNeedStopRecord = noop,
  setIsNeedStartRecord = noop,
}) {
  const { cachedProfileConfig, cachedFrontendProfileJson } = useProfileConfig();
  const languageUICopyWritingProps = getLanguageUICopyWriting();
  const previousSelectedLanguage = usePrevious(selectedServiceLanguage);

  const overtimeTimerIdRef = useRef();

  const [inputContent, setInputContent] = useState('');
  const [isEnableMicrophone, setIsEnableMicrophone] = useState(false);

  const {
    isContinuousRecord,
    isDisableInputWhenPlaying,
    languageCode,
    isShowClearButton,
    isNeedHotKey,
  } = useMemo(() => {
    const isContinuousRecordCache = get(
      cachedFrontendProfileJson,
      ['data', 'basicConfig', 'continuousRecord'],
      true,
    );

    const cachedLanguageCode =
      get(cachedFrontendProfileJson, ['data', 'basicConfig', 'defaultLanguage'], '') || 'en-us';
    const cachedShowClearButton = get(cachedProfileConfig, ['data', 'showClearChatButton'], true);
    const cachedIsNeedHotKey = get(
      cachedFrontendProfileJson,
      ['data', 'basicConfig', 'isNeedHotKey'],
      false,
    );
    return {
      isContinuousRecord: isContinuousRecordCache,
      isDisableInputWhenPlaying: true,
      languageCode: cachedLanguageCode,
      isShowClearButton: cachedShowClearButton,
      isNeedHotKey: cachedIsNeedHotKey,
    };
  }, [cachedProfileConfig, cachedFrontendProfileJson]);

  const {
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    interimLanguage,
    setInterimLanguage,
    setFinalTranscript,
    startRecord,
    stopRecord,
    addPhraseOnRecognizer,
    setSelectedLanguage,
  } = useAzureSpeechToText({
    languageCode,
    authWithPasscode,
    isAutoDetection: isMultipleLanguages,
  });

  const { startRecordReactSpeech, stopRecordReactSpeech, audioPlayer } = useSpeechRecognition({
    sendCommandWhenPaused: onSendMessage,
    startRecordAzure: () => {
      if (isLastContentAlreadyDisplay && !isStopRecording) {
        resetTranscript();
        startRecord();
        if (isContinuousRecord) {
          setIsEnableMicrophone(true);
        }
        if (!overtimeTimerIdRef.current) {
          overtimeTimerIdRef.current = window.setTimeout(() => {
            setInputContent('');
            resetTranscript();
            stopRecord();
            setIsNeedStopRecord(true);
            startRecordReactSpeech();
          }, OVERTIME_TO_ABORT_LISTENING);
        }
      }
    },
  });

  const { hotkeyReactElement } = useHotKeyControl({
    isEnableHotkeyControl: isNeedHotKey,
    clearTheFlow: () => {
      onClearChatButtonClick();
    },
    openMic: () => {
      if (!listening && !isStopRecording && chatHistoryArray.length !== 0) {
        resetTranscript();
        startRecord();
        stopRecordReactSpeech();
        if (isContinuousRecord) {
          setIsEnableMicrophone(true);
        }
        if (!overtimeTimerIdRef.current) {
          overtimeTimerIdRef.current = window.setTimeout(() => {
            setInputContent('');
            resetTranscript();
            stopRecord();
            startRecordReactSpeech();
            setIsNeedStopRecord(true);
          }, OVERTIME_TO_ABORT_LISTENING);
        }
      }
    },
    closeMic: () => {
      if (listening) {
        stopRecord();
        startRecordReactSpeech();
        if (isContinuousRecord) {
          setIsEnableMicrophone(false);
        }
        if (overtimeTimerIdRef.current) {
          window.clearTimeout(overtimeTimerIdRef.current);
          overtimeTimerIdRef.current = '';
        }
      }
    },
  });

  useEffect(() => {
    if (selectedServiceLanguage !== previousSelectedLanguage && isMultipleLanguages) {
      if (selectedServiceLanguage === '') {
        setSelectedLanguage('Auto Detect');
        setInterimLanguage('');
      } else {
        setSelectedLanguage(selectedServiceLanguage);
      }
    }
  }, [
    isMultipleLanguages,
    previousSelectedLanguage,
    selectedServiceLanguage,
    setInterimLanguage,
    setSelectedLanguage,
  ]);

  useEffect(() => {
    if (
      interimLanguage &&
      interimLanguage !== '' &&
      selectedServiceLanguage === '' &&
      finalTranscript !== '' &&
      isMultipleLanguages
    ) {
      let msg = '';

      if (interimLanguage === 'zh-HK' || finalTranscript.includes('粵語')) {
        msg = '粵語';
      }
      if (interimLanguage === 'zh-CN' || finalTranscript.includes('普通話')) {
        msg = '普通話';
      }
      if (interimLanguage === 'en-US' || finalTranscript.includes('English')) {
        msg = 'English';
      }
      onSendMessage(msg);
      setInterimLanguage('');
      setFinalTranscript('');
    }
  }, [
    finalTranscript,
    interimLanguage,
    isMultipleLanguages,
    onSendMessage,
    selectedServiceLanguage,
    setFinalTranscript,
    setInterimLanguage,
  ]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      message.error(`Browser doesn't support speech recognition.`);
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (chatHistoryArray.length > 0) {
      const next = chatHistoryArray.filter((history) => get(history, 'from', '') === 'chatbot');
      const choicesObj = get(last(next), ['choicesObj'], []);
      addPhraseOnRecognizer(choicesObj);
    }
  }, [addPhraseOnRecognizer, chatHistoryArray]);

  useEffect(() => {
    if (isConnectionValid && (finalTranscript || interimTranscript)) {
      setInputContent(finalTranscript || interimTranscript);
      if (overtimeTimerIdRef.current) {
        window.clearTimeout(overtimeTimerIdRef.current);
        overtimeTimerIdRef.current = '';
      }
    }
  }, [interimTranscript, finalTranscript, listening, isConnectionValid]);

  useEffect(() => {
    if (
      isConnectionValid &&
      finalTranscript &&
      (selectedServiceLanguage !== '' || !isMultipleLanguages) &&
      !isStopRecording
    ) {
      onSendMessage(finalTranscript);
      setInputContent('');
      resetTranscript();
      window.setTimeout(() => {
        if (isContinuousRecord) {
          startRecord();
        }
      }, 400);
      stopRecord();
      startRecordReactSpeech();
    }
  }, [
    finalTranscript,
    isConnectionValid,
    isContinuousRecord,
    isMultipleLanguages,
    isStopRecording,
    onSendMessage,
    resetTranscript,
    selectedServiceLanguage,
    startRecord,
    startRecordReactSpeech,
    stopRecord,
  ]);

  const isInterActiveDisabled = useMemo(
    () => !isConnectionValid || !isLastContentAlreadyDisplay || isWaitingPlaybackVideo,
    [isConnectionValid, isLastContentAlreadyDisplay, isWaitingPlaybackVideo],
  );

  const isButtonPlayingAndDisabled = useMemo(
    () => isInterActiveDisabled || (isDisableInputWhenPlaying && isStopRecording),
    [isDisableInputWhenPlaying, isInterActiveDisabled, isStopRecording],
  );

  useEffect(() => {
    if (!isLoadingResponseMsg) {
      setInputContent('');
      resetTranscript();
    }
  }, [isLoadingResponseMsg, resetTranscript]);

  useEffect(() => {
    if (!isButtonPlayingAndDisabled && !isNeedHotKey) {
      const inputArea = document.getElementById('chatbot-input-area');
      if (inputArea) {
        inputArea?.focus();
      }
    }
  }, [isButtonPlayingAndDisabled, isNeedHotKey]);

  useEffect(() => {
    if (isEnableMicrophone) {
      if (isStopRecording || isInterActiveDisabled) {
        stopRecord();
        startRecordReactSpeech();
        if (overtimeTimerIdRef.current) {
          window.clearTimeout(overtimeTimerIdRef.current);
          overtimeTimerIdRef.current = '';
        }
      } else {
        setInputContent('');
        resetTranscript();
        startRecord();
        stopRecordReactSpeech();
        if (!overtimeTimerIdRef.current) {
          overtimeTimerIdRef.current = window.setTimeout(() => {
            setInputContent('');
            resetTranscript();
            stopRecord();
            setIsNeedStopRecord(true);
          }, OVERTIME_TO_ABORT_LISTENING);
        }
      }
    }
  }, [
    isContinuousRecord,
    isEnableMicrophone,
    isInterActiveDisabled,
    isStopRecording,
    languageCode,
    listening,
    resetTranscript,
    setIsNeedStopRecord,
    startRecord,
    startRecordReactSpeech,
    stopRecord,
    stopRecordReactSpeech,
  ]);

  useEffect(() => {
    if (!isStopRecording && !isNeedHotKey) {
      const inputArea = document.getElementById('chatbot-input-area');
      if (inputArea) {
        inputArea?.focus();
      }
    }
  }, [isNeedHotKey, isStopRecording]);

  useEffect(() => {
    if (isNeedStopRecord) {
      stopRecord();
      startRecordReactSpeech();
      if (isContinuousRecord) {
        setIsEnableMicrophone(false);
      }
      setIsNeedStopRecord(false);
    }
  }, [
    isContinuousRecord,
    isMultipleLanguages,
    isNeedStopRecord,
    setIsNeedStopRecord,
    startRecordReactSpeech,
    stopRecord,
  ]);
  useEffect(() => {
    if (isNeedStartRecord) {
      startRecord();
      stopRecordReactSpeech();
      resetTranscript();
      if (isContinuousRecord) {
        setIsEnableMicrophone(true);
      }
      setIsNeedStartRecord(false);
    }
  }, [
    isContinuousRecord,
    isMultipleLanguages,
    isNeedStartRecord,
    resetTranscript,
    setIsNeedStartRecord,
    startRecord,
    stopRecordReactSpeech,
  ]);

  return !isMobile ? (
    <StyledInputSection
      className="input-section"
      viewUnit={viewUnit}
      style={{ opacity: isHideInputAtPlaceholder && chatHistoryArray.length === 0 ? 0 : 1 }}
    >
      {audioPlayer}
      {hotkeyReactElement}
      {!isShowPresenterPreviewState && (
        <div className="open-in-new-tab" onClick={onShowPresenterClick}>
          <SelectOutlined
            style={{
              color: 'dimgray',
            }}
          />
        </div>
      )}
      {isShowClearButton && isShowInputSectionClearButton && (
        <button
          type="button"
          className={cx('clear-chat-button', {
            disabled: isButtonPlayingAndDisabled,
          })}
          disabled={isButtonPlayingAndDisabled}
          onClick={isButtonPlayingAndDisabled ? noop : onClearChatButtonClick}
        >
          <span>
            {isMultipleLanguages
              ? selectedServiceLanguage === 'zh-HK'
                ? '重新開始'
                : 'Clear Chat'
              : get(languageUICopyWritingProps, 'clear', 'Clear Chat')}
          </span>
        </button>
      )}
      {isShowInputSectionInputBar && (
        <div className={cx('input-box', { disabled: isInterActiveDisabled })}>
          <input
            id="chatbot-input-area"
            className="qa-text-input"
            type="text"
            style={{
              fontFamily: 'Lexend',
              fontSize: '1.7vh',
              fontWeight: '500',
              textAlign: 'left',
            }}
            placeholder={
              !isInterActiveDisabled
                ? isMultipleLanguages
                  ? selectedServiceLanguage.includes('zh')
                    ? '與我們的數位人聊天'
                    : 'Chat with our digital human'
                  : get(languageUICopyWritingProps, 'chatWithInput', 'Chat with our digital human')
                : ''
            }
            disabled={isButtonPlayingAndDisabled}
            value={inputContent}
            onChange={
              isButtonPlayingAndDisabled
                ? noop
                : (evt) => {
                    setInputContent(evt.target.value);
                  }
            }
            onKeyUp={
              isButtonPlayingAndDisabled
                ? noop
                : (evt) => {
                    if (evt.keyCode === 13 && inputContent) {
                      setInputContent('');
                      onSendMessage(inputContent);
                    }
                  }
            }
          />

          <button
            type="button"
            className={cx('send-button', {
              disabled: !inputContent || isInterActiveDisabled,
            })}
            disabled={!inputContent || isInterActiveDisabled}
            onClick={
              !inputContent || isInterActiveDisabled
                ? noop
                : () => {
                    setInputContent('');
                    onSendMessage(inputContent);
                  }
            }
          >
            {isMultipleLanguages
              ? selectedServiceLanguage.includes('zh')
                ? '發送'
                : 'Send'
              : get(languageUICopyWritingProps, 'send', 'Send')}
          </button>
        </div>
      )}
      <button
        type="button"
        className={cx('record-button', {
          disabled: isInterActiveDisabled || !browserSupportsSpeechRecognition || isStopRecording,
        })}
        disabled={isInterActiveDisabled || !browserSupportsSpeechRecognition || isStopRecording}
        onClick={
          !isConnectionValid || !browserSupportsSpeechRecognition || isStopRecording
            ? noop
            : () => {
                onEnableAudioInteractiveClick();
                if (!listening) {
                  resetTranscript();
                  startRecord();
                  stopRecordReactSpeech();
                  if (isContinuousRecord) {
                    setIsEnableMicrophone(true);
                  }
                } else {
                  stopRecord();
                  startRecordReactSpeech();
                  if (isContinuousRecord) {
                    setIsEnableMicrophone(false);
                  }
                }
              }
        }
      >
        {!listening ? (
          <Image
            src={RecordIcon}
            style={{ height: '100%', width: '100%' }}
            alt="record-icon"
            className="qa-record-button"
          />
        ) : (
          <>
            <Image
              src={RecordingIcon}
              className="qa-recording-button"
              style={{
                height: '100%',
                width: '100%',
                borderRadius: '50%',
                animationName:
                  isInterActiveDisabled ||
                  !browserSupportsSpeechRecognition ||
                  isStopRecording ||
                  !listening
                    ? 'none'
                    : 'pulse',
                animationDuration: '2s',
                animationTimingFunction: 'ease-out',
                animationIterationCount: 'infinite',
              }}
              alt="recording-icon"
            />
          </>
        )}
      </button>
    </StyledInputSection>
  ) : isMobileRecordPart ? (
    <StyledMobileInputSection
      className="input-section"
      viewUnit={viewUnit}
      style={{ width: '100%', justifyContent: 'center', marginTop: '32px' }}
    >
      <div
        className="mobile-record-wrap"
        disabled={isInterActiveDisabled || !browserSupportsSpeechRecognition || isStopRecording}
        onClick={
          !isConnectionValid || !browserSupportsSpeechRecognition || isStopRecording
            ? noop
            : () => {
                onEnableAudioInteractiveClick();
                if (!listening) {
                  resetTranscript();
                  startRecord();
                  stopRecordReactSpeech();
                  if (isContinuousRecord) {
                    setIsEnableMicrophone(true);
                  }
                } else {
                  stopRecord();
                  startRecordReactSpeech();
                  if (isContinuousRecord) {
                    setIsEnableMicrophone(false);
                  }
                }
              }
        }
      >
        <Image
          src={SoundWave}
          alt="record-icon"
          className="qa-record-button"
          style={{ height: '100%', objectFit: 'scale-down' }}
        />
        {!listening ? <p> Press to start recording</p> : <p> Recording your sound...</p>}
      </div>
    </StyledMobileInputSection>
  ) : (
    <StyledMobileInputSection className="input-section" viewUnit={viewUnit}>
      {isShowInputSectionInputBar && (
        <div className={cx('input-box', { disabled: isInterActiveDisabled })}>
          <input
            id="chatbot-input-area"
            className="qa-text-input"
            type="text"
            style={{
              fontFamily: 'Lexend',
              fontSize: '2.3vw',
              fontWeight: '500',
              textAlign: 'left',
            }}
            placeholder={'Chat with our digital assistant'}
            disabled={isButtonPlayingAndDisabled}
            value={inputContent}
            onChange={
              isButtonPlayingAndDisabled
                ? noop
                : (evt) => {
                    setInputContent(evt.target.value);
                  }
            }
            onKeyUp={
              isButtonPlayingAndDisabled
                ? noop
                : (evt) => {
                    if (evt.keyCode === 13 && inputContent) {
                      setInputContent('');
                      onSendMessage(inputContent);
                    }
                  }
            }
          />

          <button
            type="button"
            className={cx('send-button', {
              disabled: !inputContent || isInterActiveDisabled,
            })}
            disabled={!inputContent || isInterActiveDisabled}
            onClick={
              !inputContent || isInterActiveDisabled
                ? noop
                : () => {
                    setInputContent('');
                    onSendMessage(inputContent);
                  }
            }
          >
            Enter
          </button>
        </div>
      )}
      <button
        type="button"
        className={cx('clear-chat-button', {
          disabled: isButtonPlayingAndDisabled,
        })}
        disabled={isButtonPlayingAndDisabled}
        onClick={isButtonPlayingAndDisabled ? noop : onClearChatButtonClick}
      >
        <Image
          src={RestartButton}
          style={{ height: '100%', width: 'fit-content' }}
          alt="record-icon"
          className="qa-record-button"
        />
      </button>
    </StyledMobileInputSection>
  );
}
