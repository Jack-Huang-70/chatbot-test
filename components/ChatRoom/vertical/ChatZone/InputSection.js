import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import cx from 'classnames';

// lodash
import noop from 'lodash/noop';
import get from 'lodash/get';
import last from 'lodash/last';

// hooks
import { usePrevious, useMount } from 'ahooks';
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';
import useAzureSpeechToText from '@/chatbot-packages/hooks/useAzureSpeechToText';
import useSpeechRecognition from '@/chatbot-packages/hooks/useSpeechRecognition';
import useHotKeyControl from '@/chatbot-packages/hooks/useHotKeyControl';

// context
import { useDigitalHumanPreview } from '@chatbot-test/core/digitalHumanPreview/PreviewContext';

// components
import Image from 'next/image';
import { message } from 'antd';

// styles
import RecordIcon from '@chatbot-test/public/test/assets/Voice_button.png';
import RecordingIcon from '@chatbot-test/public/test/assets/Voice_button_recording.png';

const StyledInputSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  width: 100%;
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
`;

const OVERTIME_TO_ABORT_LISTENING = 10 * 1000;

export default function InputSection({
  isLoadingResponseMsg = false,
  isConnectionValid = true,
  isStopRecording = false,
  isLastContentAlreadyDisplay = true,
  isWaitingPlaybackVideo = false,
  authWithPasscode = '',
  chatHistoryArray = [],
  isMultipleLanguages = false,
  selectedServiceLanguage = '',
  viewUnit = 'vw',
  isNeedStopRecord = false,
  isNeedStartRecord = false,

  onSendMessage = noop,
  onEnableAudioInteractiveClick = noop,
  setIsAskTakePhoto = noop,
  setIsListening = noop,
  onClearChatButtonClick = noop,
  setIsNeedStopRecord = noop,
  setIsNeedStartRecord = noop,
  setIsNeedSkipVideo = noop,
}) {
  const { eventActiveConfig, isEventActive } = useDigitalHumanPreview();

  const overtimeTimerIdRef = useRef();
  const previousSelectedLanguage = usePrevious(selectedServiceLanguage);
  const [inputContent, setInputContent] = useState('');
  const [isEnableMicrophone, setIsEnableMicrophone] = useState(false);
  const { cachedProfileConfig } = useProfileConfig();

  const { isContinuousRecord, languageCode } = useMemo(() => {
    const isContinuousRecordCache = true;
    const isDisableInputCache = get(
      cachedProfileConfig,
      ['data', 'disableInputWhenPlaying'],
      false,
    );
    const cachedLanguageCode = get(cachedProfileConfig, ['data', 'language'], '') || 'en-us';
    const cachedShowClearButton = get(cachedProfileConfig, ['data', 'showClearChatButton'], true);
    return {
      isContinuousRecord: isContinuousRecordCache,
      isDisableInputWhenPlaying: isDisableInputCache,
      languageCode: cachedLanguageCode,
      isShowClearButton: cachedShowClearButton,
    };
  }, [cachedProfileConfig]);

  const {
    onEventActiveOpenMic,
    onEventActiveCloseMic,
    onEventActiveClearTheFlow,
    onEventActiveNextFlow,
  } = useMemo(() => {
    return {
      onEventActiveOpenMic: get(eventActiveConfig, 'onEventActiveOpenMic', noop),
      onEventActiveCloseMic: get(eventActiveConfig, 'onEventActiveCloseMic', noop),
      onEventActiveClearTheFlow: get(eventActiveConfig, 'onEventActiveClearTheFlow', noop),
      onEventActiveNextFlow: get(eventActiveConfig, 'onEventActiveNextFlow', noop),
    };
  }, [eventActiveConfig]);

  const {
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    setInterimLanguage,
    startRecord,
    stopRecord,
    addPhraseOnRecognizer,
    setSelectedLanguage,
  } = useAzureSpeechToText({
    languageCode,
    authWithPasscode,
    isAutoDetection:
      isMultipleLanguages &&
      (selectedServiceLanguage === '' || selectedServiceLanguage === 'Auto Detect'),
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
    isEnableHotkeyControl: true,

    openMic: () => {
      if (isEventActive) {
        onEventActiveOpenMic(onSendMessage);
      } else {
        if (listening) {
          stopRecord();
          // startRecordReactSpeech();
          if (isContinuousRecord) {
            setIsEnableMicrophone(false);
          }
          if (overtimeTimerIdRef.current) {
            window.clearTimeout(overtimeTimerIdRef.current);
            overtimeTimerIdRef.current = '';
          }
        } else {
          // if (!listening && !isStopRecording && chatHistoryArray.length !== 0) {
          //   resetTranscript();
          //   startRecord();
          //   stopRecordReactSpeech();
          //   if (isContinuousRecord) {
          //     setIsEnableMicrophone(true);
          //   }
          //   if (!overtimeTimerIdRef.current) {
          //     overtimeTimerIdRef.current = window.setTimeout(() => {
          //       setInputContent('');
          //       resetTranscript();
          //       stopRecord();
          //       startRecordReactSpeech();
          //       setIsNeedStopRecord(true);
          //     }, OVERTIME_TO_ABORT_LISTENING);
          //   }
          // }

          if (!listening && !isStopRecording) {
            resetTranscript();
            startRecord();
            // stopRecordReactSpeech();
            if (isContinuousRecord) {
              setIsEnableMicrophone(true);
            }
            if (!overtimeTimerIdRef.current) {
              overtimeTimerIdRef.current = window.setTimeout(() => {
                setInputContent('');
                // resetTranscript();
                stopRecord();
                // startRecordReactSpeech();
                setIsNeedStopRecord(true);
              }, OVERTIME_TO_ABORT_LISTENING);
            }
          }
        }
      }
    },
    closeMic: () => {
      if (isEventActive) {
        onEventActiveCloseMic(onSendMessage);
      } else {
        setIsNeedSkipVideo(true);

        // if (listening) {
        //   stopRecord();
        //   startRecordReactSpeech();
        //   if (isContinuousRecord) {
        //     setIsEnableMicrophone(false);
        //   }
        //   if (overtimeTimerIdRef.current) {
        //     window.clearTimeout(overtimeTimerIdRef.current);
        //     overtimeTimerIdRef.current = '';
        //   }
        // }
      }
    },
    clearTheFlow: () => {
      if (isEventActive) {
        onEventActiveClearTheFlow(onSendMessage);
      } else {
        onClearChatButtonClick();
      }
    },
    nextFlow: () => {
      if (isEventActive) {
        onEventActiveNextFlow(onSendMessage);
      }
    },
  });

  useEffect(() => {
    if (selectedServiceLanguage !== previousSelectedLanguage && isMultipleLanguages) {
      if (selectedServiceLanguage === '') {
        setSelectedLanguage('en');
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
    if (isConnectionValid && finalTranscript && !isStopRecording) {
      onSendMessage(finalTranscript);

      setInputContent('');
      resetTranscript();
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
    stopRecordReactSpeech,
  ]);

  const isInterActiveDisabled = useMemo(
    () => !isConnectionValid || !isLastContentAlreadyDisplay || isWaitingPlaybackVideo,
    [isConnectionValid, isLastContentAlreadyDisplay, isWaitingPlaybackVideo],
  );

  useEffect(() => {
    if (!isLoadingResponseMsg) {
      setInputContent('');
      resetTranscript();
    }
  }, [isLoadingResponseMsg, resetTranscript]);

  useEffect(() => {
    if (isEnableMicrophone) {
      if (isStopRecording || isInterActiveDisabled) {
        setInputContent('');
        resetTranscript();
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
            startRecordReactSpeech();
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

  // useEffect(() => {
  //   if (!isStopRecording) {
  //     const inputArea = document.getElementById('CHATBOT_INPUT_AREA');
  //     if (inputArea) {
  //       inputArea?.focus();
  //     }
  //   }
  // }, [isStopRecording]);

  useEffect(() => {
    setIsListening(listening);
  }, [listening, setIsListening]);

  useEffect(() => {
    if (isNeedStopRecord) {
      stopRecord();
      startRecordReactSpeech();
      if (isContinuousRecord) {
        setIsEnableMicrophone(false);
      }
      if (overtimeTimerIdRef.current) {
        window.clearTimeout(overtimeTimerIdRef.current);
        overtimeTimerIdRef.current = '';
      }
      setIsNeedStopRecord(false);
    }
  }, [
    isContinuousRecord,
    isNeedStopRecord,
    setIsNeedStopRecord,
    startRecordReactSpeech,
    stopRecord,
  ]);
  useEffect(() => {
    if (isNeedStartRecord) {
      if (chatHistoryArray.length > 2) {
        startRecord();
        stopRecordReactSpeech();
        resetTranscript();
      }

      if (isContinuousRecord) {
        setIsEnableMicrophone(true);
      }
      setIsNeedStartRecord(false);
    }
  }, [
    chatHistoryArray.length,
    isContinuousRecord,
    isNeedStartRecord,
    resetTranscript,
    setIsAskTakePhoto,
    setIsNeedStartRecord,
    startRecord,
    stopRecordReactSpeech,
  ]);
  useEffect(() => {
    if (isMultipleLanguages && (interimTranscript || finalTranscript)) {
      setIsAskTakePhoto(true);
    }
  }, [finalTranscript, interimTranscript, isMultipleLanguages, setIsAskTakePhoto]);

  const isButtonPlayingAndDisabled = useMemo(
    () => isInterActiveDisabled || isStopRecording,
    [isInterActiveDisabled, isStopRecording],
  );

  useMount(() => {
    setSelectedLanguage(selectedServiceLanguage);
  });

  return (
    <StyledInputSection className="input-section" viewUnit={viewUnit}>
      {audioPlayer}

      <div className={cx('input-box', { disabled: isInterActiveDisabled })}>
        <input
          id="CHATBOT_INPUT_AREA"
          className="qa-text-input"
          type="text"
          style={{
            fontFamily: 'Lexend',
            fontSize: '1.7vh',
            fontWeight: '500',
            textAlign: 'left',
          }}
          placeholder={'Chat with our digital human'}
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
          Send
        </button>
      </div>

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
          <Image
            src={RecordingIcon}
            style={{ height: '100%', width: '100%' }}
            alt="recording-icon"
            className="qa-recording-button"
          />
        )}
      </button>
      {hotkeyReactElement}
    </StyledInputSection>
  );
}
