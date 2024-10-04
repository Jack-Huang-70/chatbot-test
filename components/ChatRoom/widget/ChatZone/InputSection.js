import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import noop from 'lodash/noop';
import get from 'lodash/get';
import last from 'lodash/last';
import Image from 'next/image';

// components
import { message } from 'antd';

// hooks
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';
import useAzureSpeechToText from '@/chatbot-packages/hooks/useAzureSpeechToText';

// utils
import getLanguageUICopyWriting from '@/chatbot-packages/utils/getLanguageUICopyWriting';

// styles
import RecordIcon from '@chatbot-test/public/test/assets/Voice_button_tr.png';
import RecordingIcon from '@chatbot-test/public/test/assets/Voice_button_recording.png';

const StyledInputSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 32px;
  .input-box {
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;
    width: 100%;
    height: 100%;
    padding: 14px 16px;
    border-radius: 1000px;
    border: solid 1px #d9d9d9;
    background-color: #fff;
    box-sizing: border-box;

    > input {
      width: 78%;
      padding: 0px 8px 0px 0px;
      font-size: 14px !important;
      border: none;
      transform: translateX(-13px);

      &:focus-visible {
        outline-offset: 0px;
        outline: none;
      }
      &::placeholder {
        opacity: 0.25;
      }
    }
    .send-button {
      width: 60px;
      height: 26px;
      position: absolute;
      top: 2px;
      right: 2px;
      padding: 0px;
      border: none;
      font-family: Lexend;
      font-size: 14px;
      font-weight: 500;
      border-radius: 14px;
      background-image: linear-gradient(123deg, #7399fb 8%, #8db5e6 75%);
      color: #fff;

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
    width: 26px;
    height: 26px;
    cursor: pointer;
    border: none;
    background-color: transparent;
    transform: translateX(-15px);
    &.disabled {
      filter: grayscale(1);
      cursor: not-allowed;
    }
  }
`;

const OVERTIME_TO_ABORT_LISTENING = 10 * 1000;

export default function WidgetInputSection({
  isLoadingResponseMsg = false,
  isConnectionValid = true,
  isStopRecording = false,
  isLastContentAlreadyDisplay = true,
  isWaitingPlaybackVideo = false,
  chatHistoryArray = [],
  themeColor = '',
  inputPlaceholderChat = '',
  inputContentWrapConfig = {},
  isShowInsideInputRecord = true,
  isShowOutsideRecord = false,
  isShowSendButton = true,
  sendButtonText = 'Enter',
  sendButtonRight = '2px',
  onSendMessage = noop,
  onEnableAudioInteractiveClick = noop,
}) {
  const { cachedProfileConfig, cachedWidgetProfileJson } = useProfileConfig();
  const languageUICopyWritingProps = getLanguageUICopyWriting();

  const overtimeTimerIdRef = useRef();
  const sendSpeechToContentModeRef = useRef('sendTheContentAutomatically');

  const [inputContent, setInputContent] = useState('');
  const [isEnableMicrophone, setIsEnableMicrophone] = useState(false);

  const { isContinuousRecord, isDisableInputWhenPlaying, languageCode } = useMemo(() => {
    const isContinuousRecordCache = get(cachedProfileConfig, ['data', 'continuousRecord'], true);
    const isDisableInputCache = get(
      cachedProfileConfig,
      ['data', 'disableInputWhenPlaying'],
      false,
    );
    const cachedLanguageCode =
      get(cachedWidgetProfileJson, ['data', 'defaultLanguage'], '') || 'en-us';
    const cachedShowClearButton = get(cachedProfileConfig, ['data', 'showClearChatButton'], true);
    return {
      isContinuousRecord: isContinuousRecordCache,
      isDisableInputWhenPlaying: isDisableInputCache,
      languageCode: cachedLanguageCode,
      isShowClearButton: cachedShowClearButton,
    };
  }, [cachedProfileConfig, cachedWidgetProfileJson]);

  const {
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    startRecord,
    stopRecord,
    addPhraseOnRecognizer,
  } = useAzureSpeechToText({ languageCode });

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      message.error(`Browser doesn't support speech recognition.`);
    }
  }, [browserSupportsSpeechRecognition]);

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
    // speech -> content to input box -> click send by the user
    if (sendSpeechToContentModeRef?.current === 'clickSendByTheUser') {
      if (!listening && finalTranscript) {
        setInputContent(finalTranscript);
      }
    }

    // speech -> content to input box -> send the content automatically
    if (sendSpeechToContentModeRef?.current === 'sendTheContentAutomatically') {
      if (chatHistoryArray.length > 0) {
        const next = chatHistoryArray.filter((history) => get(history, 'from', '') === 'chatbot');
        const choicesObj = get(last(next), ['choicesObj'], []);
        addPhraseOnRecognizer(choicesObj);
      }
    }
  }, [
    chatHistoryArray,
    finalTranscript,
    listening,
    addPhraseOnRecognizer,
    sendSpeechToContentModeRef,
  ]);

  useEffect(() => {
    if (isConnectionValid && finalTranscript) {
      onSendMessage(finalTranscript);
      setInputContent('');
      resetTranscript();
      stopRecord();
    }
  }, [
    finalTranscript,
    onSendMessage,
    resetTranscript,
    isConnectionValid,
    isContinuousRecord,
    languageCode,
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
    if (!isButtonPlayingAndDisabled) {
      const inputArea = document.getElementById('chatbot-input-area');
      if (inputArea) {
        inputArea?.focus();
      }
    }
  }, [isButtonPlayingAndDisabled]);

  useEffect(() => {
    if (isEnableMicrophone) {
      if (isStopRecording || isInterActiveDisabled) {
        stopRecord();
        if (overtimeTimerIdRef.current) {
          window.clearTimeout(overtimeTimerIdRef.current);
          overtimeTimerIdRef.current = '';
        }
      } else {
        setInputContent('');
        resetTranscript();
        startRecord();
        if (!overtimeTimerIdRef.current) {
          overtimeTimerIdRef.current = window.setTimeout(() => {
            stopRecord();
          }, OVERTIME_TO_ABORT_LISTENING);
        }
      }
    }
  }, [
    isEnableMicrophone,
    isInterActiveDisabled,
    isStopRecording,
    languageCode,
    listening,
    resetTranscript,
    startRecord,
    stopRecord,
  ]);

  useEffect(() => {
    if (!isStopRecording) {
      const inputArea = document.getElementById('chatbot-input-area');
      if (inputArea) {
        inputArea?.focus();
      }
    }
  }, [isStopRecording]);

  return (
    <StyledInputSection
      className="input-section"
      style={{
        ...inputContentWrapConfig,
      }}
    >
      <div className={cx('input-box', { disabled: isInterActiveDisabled })}>
        {isShowInsideInputRecord && (
          <button
            type="button"
            className={cx('record-button', {
              disabled:
                isInterActiveDisabled || !browserSupportsSpeechRecognition || isStopRecording,
            })}
            disabled={isInterActiveDisabled || !browserSupportsSpeechRecognition || isStopRecording}
            onClick={
              !isConnectionValid || !browserSupportsSpeechRecognition
                ? noop
                : () => {
                    onEnableAudioInteractiveClick();
                    if (!listening) {
                      resetTranscript();
                      startRecord();
                      if (isContinuousRecord) {
                        setIsEnableMicrophone(true);
                      }
                    } else {
                      stopRecord();
                      if (isContinuousRecord) {
                        setIsEnableMicrophone(false);
                      }
                    }
                  }
            }
          >
            {!listening ? (
              <div
                style={{
                  position: 'relative',
                  background: themeColor || '#7399fb',
                  borderRadius: '50%',
                  height: '26px',
                }}
              >
                <Image
                  className="qa-record-button"
                  src={RecordIcon}
                  alt="record-icon"
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
            ) : (
              <Image
                src={RecordingIcon}
                className="qa-recording-button"
                alt="recording-icon"
                style={{ height: '100%', width: '100%' }}
              />
            )}
          </button>
        )}

        <input
          id="chatbot-input-area"
          className="qa-text-input"
          type="text"
          style={{
            fontFamily: 'Lexend',
            fontSize: '16px',
            fontWeight: '500',
            textAlign: 'left',
            marginLeft: '8px',
            backgroundColor: 'white',
          }}
          placeholder={
            !isInterActiveDisabled
              ? inputPlaceholderChat ||
                get(languageUICopyWritingProps, 'chatWithInput', 'Chat with our digital human')
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

        {isShowSendButton && (
          <button
            type="button"
            className={cx('send-button', {
              disabled: !inputContent || isInterActiveDisabled,
            })}
            disabled={!inputContent || isInterActiveDisabled}
            style={
              themeColor
                ? {
                    backgroundColor: themeColor,
                    backgroundImage: 'none',
                    right: sendButtonRight,
                  }
                : { right: sendButtonRight }
            }
            onClick={
              !inputContent || isInterActiveDisabled
                ? noop
                : () => {
                    setInputContent('');
                    onSendMessage(inputContent);
                  }
            }
          >
            {sendButtonText || get(languageUICopyWritingProps, 'enter', 'Enter')}
          </button>
        )}
      </div>

      {isShowOutsideRecord && (
        <button
          type="button"
          className={cx('record-button', {
            disabled: isInterActiveDisabled || !browserSupportsSpeechRecognition || isStopRecording,
          })}
          style={{
            transform: 'none',
            margin: '0px 0px 0px 4px',
            height: get(inputContentWrapConfig, 'height', '26px') || '26px',
            width: get(inputContentWrapConfig, 'height', '26px') || '26px',
          }}
          disabled={isInterActiveDisabled || !browserSupportsSpeechRecognition || isStopRecording}
          onClick={
            !isConnectionValid || !browserSupportsSpeechRecognition
              ? noop
              : () => {
                  onEnableAudioInteractiveClick();
                  if (!listening) {
                    resetTranscript();
                    startRecord();
                    if (isContinuousRecord) {
                      setIsEnableMicrophone(true);
                    }
                  } else {
                    stopRecord();
                    if (isContinuousRecord) {
                      setIsEnableMicrophone(false);
                    }
                  }
                }
          }
        >
          {!listening ? (
            <div
              style={{
                position: 'relative',
                background: themeColor || '#7399fb',
                borderRadius: '50%',
                height: '100%',
              }}
            >
              <Image
                src={RecordIcon}
                alt="record-icon"
                className="qa-record-button"
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          ) : (
            <Image
              src={RecordingIcon}
              className="qa-recording-button"
              alt="recording-icon"
              style={{ height: '100%', width: '100%' }}
            />
          )}
        </button>
      )}
    </StyledInputSection>
  );
}
