/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useRef, useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import ScrollToBottom from 'react-scroll-to-bottom';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';

// lodash
import noop from 'lodash/noop';
import get from 'lodash/get';
import last from 'lodash/last';
import camelCase from 'lodash/camelCase';
import set from 'lodash/set';

// hooks
import { useDebounceFn } from 'ahooks';
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';
import { formatMessageOutput } from '@/chatbot-packages/hooks/formatChoice';

// qa
import { useAddDataTestId, ElementWithDataTestId } from '@/chatbot-packages/qa/useAddDataTestId';

// utils
import formatContent from '@/chatbot-packages/utils/formatContent';

// context
import { useDigitalHumanPreview } from '@chatbot-test/core/digitalHumanPreview/PreviewContext';

// components
import ChatPlaceholder from './ChatPlaceholder.js';
import QRCode from 'react-qr-code';

// styles
import KeyinIcon from '@chatbot-test/public/test/assets/keyin.svg';
import { CaretRightOutlined, FullscreenOutlined } from '@ant-design/icons';

const StyledChatRoomVerticalChatContent = styled(ScrollToBottom)`
  flex: 1;
  overflow-y: auto;
  border-radius: 40px;
  width: fit-content;

  > button {
    opacity: 0;
  }

  .chat-history-wrap {
    display: flex;
    flex-direction: column;

    .user-client {
      align-self: flex-end;
      max-width: 70%;
      margin-bottom: 16px;

      .conversation-wrap {
        padding: ${(props) => `0.42${props.viewUnit} 0.83${props.viewUnit}`};
        object-fit: contain;
        border-radius: 8px;
        background-image: linear-gradient(128deg, #f9c869 8%, #dc8c52 77%);

        > span {
          font-family: Lexend;
          font-size: ${(props) => `${props.fontSize}${props.viewUnit}`};
          color: #fff;
        }
      }
    }

    .user-digital-human {
      max-width: 70%;
      margin-bottom: 16px;

      .conversation-title-wrap {
        margin-bottom: 16px;
        opacity: 0.5;
        font-family: Lexend;
        font-size: ${(props) => `${props.fontSize}${props.viewUnit}`};
        color: #000000;
      }

      .conversation-wrap {
        width: fit-content;
        margin-bottom: 16px;
        padding: ${(props) => `0.42${props.viewUnit} 0.83${props.viewUnit}`};
        border-radius: 8px;
        background: ${(props) =>
          `${props.buttonColor || 'linear-gradient(105deg, #7399fb 7%, #8db5e6 70%)'}`};

        > span {
          font-family: Lexend;
          font-size: ${(props) => `${props.fontSize}${props.viewUnit}`};
          color: ${(props) => `${props.fontColor || '#fff'}`};
        }

        > p {
          margin: 0px;
          font-family: Lexend;
          font-size: ${(props) => `${props.fontSize}${props.viewUnit}`};
          color: ${(props) => `${props.fontColor || '#fff'}`};
        }

        .choice-wrap {
          margin-top: 16px;

          .choice {
            margin: 0px 18px 16px 18px;
            margin: ${(props) =>
              `0vw 0.86${props.viewUnit} 0.83${props.viewUnit} 0.86${props.viewUnit}`};
            padding: ${(props) => `0.42${props.viewUnit} 1.66${props.viewUnit}`};
            opacity: 0.5;
            border-radius: 8px;
            background-color: #000;
            cursor: pointer;

            > span {
              font-family: Lexend;
              font-size: ${(props) => `${props.fontSize}${props.viewUnit}`};
              text-align: center;
              color: #fff;
            }
          }
        }
      }
    }
  }
  .chat-history-wrap::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  .chat-content-wrap::-webkit-scrollbar {
    display: none;
  }
  .chat-content::-webkit-scrollbar {
    display: none;
  }
  .chat-content-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    .header-color {
      height: 48px;
      width: 100%;
      background-color: ${(props) => `${props.subColor || '#a1354a'}`};
    }
    .chat-msg::-webkit-scrollbar {
      display: none;
    }
    .chat-msg {
      margin-top: auto;
      margin-bottom: auto;
      .answer {
        padding: ${(props) => `0.83${props.viewUnit} 0`};
        border-radius: 1000px;
        background-color: ${(props) => `${props.buttonColor || '#162547'}`};
        width: ${(props) => `21.4${props.viewUnit}`};
        height: fit-content;
        min-height: 83px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: ${(props) => `1.63${props.viewUnit}`};
        p {
          /* font-size: ${(props) => `${props.fontSize + 0.15}${props.viewUnit}`}; */
          font-size: 24px;
          font-family: Lexend;
          color: ${(props) => `${props.fontColor || 'white'}`};
          margin: 0px;
          text-align: center;
        }
      }
    }
    .chat-msg-question {
      margin-top: auto;
      margin-bottom: auto;
      width: 100%;
      padding: 0px 40px;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      .chat-msg-answer {
        width: 45%;

        padding: 16px 0;
        border-radius: 1000px;
        border: 2px solid #7399fb;
        background-color: ${(props) => `${props.buttonColor || '#fff'}`};
        max-width: 430px;
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 32px;
        p {
          font-size: ${(props) => props.fontSize + 4}px;
          font-family: Lexend;
          color: ${(props) => `${props.fontColor || '#7399fb'}`};
          margin: 0px;
          text-align: center;
        }
      }
    }
  }
`;

export default function ChatRoomVerticalChatContent({
  isChatHistoryMode = false,
  isWaitForResponseBoomerangMode = false,
  chatHistoryArray = [],
  isStopRecording = false,
  isReadyToPlay = false,
  playedHistoryIndexArray = [],
  playedResponseIndexArray = [],
  isLastContentAlreadyDisplay = true,
  isWaitingPlaybackVideo = false,
  isMultipleLanguages = false,
  customClientChatBackgroundColor = '',
  customFontSize = 0.83,
  viewUnit = 'vw',
  isVertical = false,
  currentChatZoneConfig = {},

  onSendMessage = noop,
  onPlaybackVideoClick = noop,
  setPlayedHistoryIndexArray = noop,
  setPlayedResponseIndexArray = noop,
  setIsAskTakePhoto = noop,
  setIsShowBigImage = noop,
  updateDrawerConfig = noop,
  updateIsShowRatingBox = noop,
  onClearChatButtonClick = noop,
}) {
  const { updateChatHistoryArray, isEventActive } = useDigitalHumanPreview();

  const messagesEndRef = useRef();
  const [delayChatContentAnimationTransformY, setDelayChatContentAnimationTransformY] = useState(1);
  const [isChatPlaceholderClicked, setIsChatPlaceholderClicked] = useState(false);
  const { run } = useDebounceFn(
    (index) => {
      setPlayedHistoryIndexArray((prev) => {
        return [...prev, index];
      });
    },
    { wait: 100 },
  );
  const { run: updateResponseIndexArray } = useDebounceFn(
    (index) => {
      setPlayedResponseIndexArray((prev) => {
        return [...prev, index];
      });
    },
    { wait: 100 },
  );

  const { cachedProfileConfig } = useProfileConfig();
  const { isShowPlayBackButton, isDisableInputWhenPlaying, defaultFirstMessage, profileModelName } =
    useMemo(() => {
      const isShowPlayBackCache = get(cachedProfileConfig, ['data', 'showPlayBack'], false);
      const isDisableInputCache = get(
        cachedProfileConfig,
        ['data', 'disableInputWhenPlaying'],
        false,
      );
      const defaultFirstMessageCache =
        get(cachedProfileConfig, ['data', 'defaultFirstMessage'], '') || 'Hello';
      const modelName =
        get(cachedProfileConfig, ['data', 'presenterName'], 'Vanya') ||
        process.env.REACT_APP_PRESENTER_NAME_CHATROOM;
      const multipleLanguageModelName = 'Vanya';
      return {
        isShowPlayBackButton: isShowPlayBackCache,
        isDisableInputWhenPlaying: isDisableInputCache,
        defaultFirstMessage: defaultFirstMessageCache,
        profileModelName: isMultipleLanguages ? multipleLanguageModelName : modelName,
      };
    }, [cachedProfileConfig, isMultipleLanguages]);

  const genFormatedDateFromUnixTime = useCallback((unixTime) => {
    // const DATE_TIME_FORMAT = 'dd/MM HH:mm:ss';
    const DATE_TIME_FORMAT = 'HH:mm';

    return isValid(unixTime) ? format(unixTime, DATE_TIME_FORMAT) : '';
  }, []);

  const isAnswerDisabled = useMemo(
    () =>
      (isDisableInputWhenPlaying && isStopRecording) ||
      !isLastContentAlreadyDisplay ||
      isWaitingPlaybackVideo,
    [
      isDisableInputWhenPlaying,
      isLastContentAlreadyDisplay,
      isStopRecording,
      isWaitingPlaybackVideo,
    ],
  );

  const { currentChatChoices, currentChatMediaArray } = useMemo(() => {
    const currentIndex =
      last(isWaitForResponseBoomerangMode ? playedResponseIndexArray : playedHistoryIndexArray) ??
      -1;
    let mediaArray = [];
    let choices = [];

    if (currentIndex >= 0) {
      mediaArray = get(chatHistoryArray, [currentIndex, 'mediaList'], []);
    }
    if (currentIndex >= 0) {
      choices = get(chatHistoryArray, [currentIndex, 'choices'], []);
    }

    return {
      currentChatChoices: choices || [],
      currentChatMediaArray: mediaArray || [],
    };
  }, [
    chatHistoryArray,
    isWaitForResponseBoomerangMode,
    playedHistoryIndexArray,
    playedResponseIndexArray,
  ]);

  useEffect(() => {
    if (chatHistoryArray.length > 0) {
      const lastIndex = chatHistoryArray.length - 1;
      const latestHistory = chatHistoryArray[lastIndex];
      const from = get(latestHistory, 'from', '');
      const details = get(latestHistory, 'details', {});
      const detailsResolvedInput = get(details, 'resolved_input', '');
      const detailsIntentDisplayName = get(details, ['intent', 'display_name'], '');
      const content = get(latestHistory, ['mediaArray', 0, 'content'], '');
      const isDrawerAutoOpened = get(latestHistory, 'isDrawerAutoOpened', false);
      const updater = (pageName, pageContent) => {
        updateDrawerConfig({
          isOpen: true,
          pageName,
          pageContent,
          onSendMessage,
        });

        if (updateChatHistoryArray) {
          updateChatHistoryArray((prev) => {
            return set(prev, [lastIndex, 'isDrawerAutoOpened'], true);
          });
        }
      };

      if (detailsIntentDisplayName === 'EndFlow') {
        try {
          const signal = get(JSON.parse(content), ['params', 'signal'], '');

          if (signal === 'show_rating_window') {
            updateIsShowRatingBox(true);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        if (from === 'chatbot' && !isDrawerAutoOpened) {
          const camelCasedInput = camelCase(detailsResolvedInput);

          if (camelCasedInput.includes(camelCase('open-drawer-keyword'))) {
            updater(camelCasedInput, content);
          }
        }
      }
    }
  }, [
    chatHistoryArray,
    updateIsShowRatingBox,
    updateDrawerConfig,
    updateChatHistoryArray,
    onSendMessage,
  ]);

  useEffect(() => {
    if (isChatHistoryMode) {
      window.setTimeout(() => {
        messagesEndRef?.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 200);
    }
  }, [isChatHistoryMode]);

  useEffect(() => {
    if (isLastContentAlreadyDisplay) {
      window.setTimeout(() => {
        messagesEndRef?.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 300);
      window.setTimeout(() => {
        messagesEndRef?.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 800);
    }
  }, [chatHistoryArray.length, isLastContentAlreadyDisplay]);
  useEffect(() => {
    if (chatHistoryArray.length > 0) {
      window.setTimeout(() => {
        messagesEndRef?.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 300);
    }
  }, [chatHistoryArray.length]);

  const chatContentAnimationTransform = useMemo(() => {
    return isAnswerDisabled ||
      !isLastContentAlreadyDisplay ||
      (currentChatMediaArray.length === 0 && currentChatChoices.length === 0)
      ? 100
      : 0;
  }, [
    currentChatChoices.length,
    currentChatMediaArray.length,
    isAnswerDisabled,
    isLastContentAlreadyDisplay,
  ]);

  useEffect(() => {
    if (chatContentAnimationTransform === 100) {
      setTimeout(() => {
        setDelayChatContentAnimationTransformY(0);
      }, 200);
    } else {
      setDelayChatContentAnimationTransformY(0.01);
      setTimeout(() => {
        setDelayChatContentAnimationTransformY(1);
      }, 200);
    }
  }, [chatContentAnimationTransform]);

  useEffect(() => {
    if (chatHistoryArray.length !== 0) {
      setIsChatPlaceholderClicked(false);
    }
  }, [chatHistoryArray.length]);

  const { fontColor, subColor, buttonColor } = useMemo(() => {
    return {
      tapColor: get(currentChatZoneConfig, 'tapColor', ''),
      fontColor: get(currentChatZoneConfig, 'fontColor', ''),
      subColor: get(currentChatZoneConfig, 'subColor', ''),
      buttonColor: get(currentChatZoneConfig, 'buttonColor', ''),
    };
  }, [currentChatZoneConfig]);

  useAddDataTestId();

  return (
    <StyledChatRoomVerticalChatContent
      className="chat-content"
      fontSize={customFontSize}
      viewUnit={viewUnit}
      buttonColor={buttonColor}
      fontColor={fontColor}
      subColor={subColor}
    >
      {chatHistoryArray.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
          <ChatPlaceholder
            viewUnit={viewUnit}
            defaultFirstMessage={defaultFirstMessage}
            onChatPlaceholderClick={() => {
              if (!isChatPlaceholderClicked && !isEventActive) {
                setIsChatPlaceholderClicked(true);
                onClearChatButtonClick();
              }
            }}
          />
        </div>
      ) : (
        <>
          <ElementWithDataTestId
            className="chat-history-wrap"
            style={{
              height: !isChatHistoryMode ? '0px' : '100%',
              overflow: !isChatHistoryMode ? 'hidden' : 'auto',
              padding: !isChatHistoryMode ? '0px' : '24px 46px 32px 46px',
            }}
          >
            {chatHistoryArray.map((history = {}, index = '') => {
              const from = get(history, 'from', '');
              const message = get(history, 'message', '');
              const timestamp = get(history, 'timestamp', '');
              const formatedDateTime = genFormatedDateFromUnixTime(timestamp);
              const choices = get(history, 'choicesObj', []);
              const mediaArray = get(history, 'mediaList', []);
              const isWaitingForSocketResponse = get(history, 'isWaitingForSocketResponse', false);
              const isQuestion = choices.length !== 0;
              const videoUrl = get(history, 'videoUrl', '');
              const isPlayedHistory = playedHistoryIndexArray.includes(index);
              const isWaitingForResponseOrVideoLoading =
                isWaitingForSocketResponse || !isPlayedHistory;
              const isPlayedResponse = playedResponseIndexArray.includes(index);
              const isShowLoadingPlaceholder = isWaitForResponseBoomerangMode
                ? isWaitingForResponseOrVideoLoading || !isPlayedResponse
                : isWaitingForResponseOrVideoLoading;

              const userMessage = formatMessageOutput(message);
              const chatBotMessage =
                from !== 'user'
                  ? formatContent({
                      text: message,
                      customFontStyle: {
                        color: 'white',
                        fontSize: '24px',
                        fontFamily: 'Lexend',
                      },
                    })
                  : message;
              if (
                !isWaitingForSocketResponse &&
                isReadyToPlay &&
                !isPlayedHistory &&
                from !== 'user'
              ) {
                // The first time this history is load and play, add it to played List
                // Use debounce to prevent it render for many time
                run(index);
                if (isWaitForResponseBoomerangMode) {
                  updateResponseIndexArray(index);
                }
              }

              if (from === 'user') {
                return (
                  <ElementWithDataTestId
                    className="user-client qa-client-wrap"
                    key={index}
                    style={{
                      display: formatedDateTime ? 'flex' : 'block',
                      alignItems: 'flex-end',
                    }}
                  >
                    {formatedDateTime && (
                      <ElementWithDataTestId
                        className="timestamp"
                        style={{
                          marginRight: '8px',
                          fontSize: `${customFontSize}${viewUnit}`,
                        }}
                      >
                        {formatedDateTime}
                      </ElementWithDataTestId>
                    )}

                    <ElementWithDataTestId
                      className="conversation-wrap client-conversation-wrap qa-client-text"
                      style={
                        customClientChatBackgroundColor === ''
                          ? {}
                          : {
                              backgroundColor: customClientChatBackgroundColor,
                              backgroundImage: 'none',
                            }
                      }
                    >
                      <span>{userMessage}</span>
                    </ElementWithDataTestId>
                  </ElementWithDataTestId>
                );
              }

              return isShowLoadingPlaceholder ? (
                <ElementWithDataTestId className="user-digital-human" key={index}>
                  <div className="conversation-title-wrap">
                    <span>{`${profileModelName}:`}</span>
                  </div>

                  <ElementWithDataTestId className="conversation-wrap digital-human-conversation-wrap qa-message-loader">
                    <KeyinIcon
                      className="key-in-loading-icon"
                      style={{
                        display: 'block',
                        width: '46px',
                        height: '26px',
                        transform: 'scale(2)',
                        paddingLeft: '12px',
                      }}
                    />
                  </ElementWithDataTestId>
                </ElementWithDataTestId>
              ) : (
                <ElementWithDataTestId className="user-digital-human" key={index}>
                  <div className="conversation-title-wrap">
                    <span>{`${profileModelName}:`}</span>
                  </div>

                  <div
                    style={{
                      display: formatedDateTime ? 'flex' : 'block',
                      alignItems: 'flex-end',
                    }}
                  >
                    <ElementWithDataTestId
                      className="conversation-wrap digital-human-conversation-wrap qa-dh-response-wrap"
                      style={{ position: 'relative' }}
                    >
                      {chatBotMessage}

                      <div
                        style={{
                          opacity: 0.95,
                          borderRadius: '16px',
                          justifyContent: 'center',
                          display: mediaArray.length > 0 ? 'flex' : 'none',
                          padding: '24px',
                          flexDirection: 'column',
                        }}
                      >
                        {mediaArray.length > 0 &&
                          mediaArray.map((mediaData, index) => {
                            const { mediaType, mediaUrl } = mediaData;
                            return mediaType === 'image' ? (
                              <img
                                src={mediaUrl}
                                alt={`response-media-${mediaType}-${index}`}
                                style={{
                                  marginBottom: '32px',
                                  maxWidth: '100%',
                                  maxHeight: '70vh',
                                  objectFit: 'contain',
                                }}
                                key={`response-media-${mediaType}-${index}`}
                              />
                            ) : mediaType === 'file' ? (
                              <a
                                href={mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={`response-media-${mediaType}-${index}`}
                              >
                                <QRCode
                                  value={mediaUrl}
                                  style={{
                                    marginBottom: '32px',
                                    height: '100%',
                                    width: '100%',
                                    maxWidth: '200px',
                                    maxHeight: '200px',
                                  }}
                                  fgColor={'#eb222b'}
                                  level={'L'} // L, M , Q , H , H is most complex
                                />
                              </a>
                            ) : (
                              <video
                                src={mediaUrl}
                                key={`response-media-${mediaType}-${index}`}
                                style={{
                                  marginBottom: '32px',
                                  width: '90%',
                                  maxWidth: '320px',
                                  maxHeight: '320px',
                                }}
                                muted
                                autoPlay
                                loop
                                controls
                              />
                            );
                          })}
                      </div>
                      {isQuestion && (
                        <ElementWithDataTestId className="choice-wrap qa-choice-wrap-custom">
                          {choices.map((choice) => {
                            return (
                              <p
                                key={choice.title}
                                className="choice qa-conversation-choice-button"
                                style={{
                                  opacity: isAnswerDisabled ? 0.3 : 0.5,
                                  cursor: isAnswerDisabled ? 'default' : 'pointer',
                                }}
                                disabled={isAnswerDisabled}
                                onClick={() => {
                                  if (!isAnswerDisabled) {
                                    window.setTimeout(() => {
                                      messagesEndRef?.current?.scrollIntoView({
                                        behavior: 'smooth',
                                      });
                                    }, 200);
                                    onSendMessage(choice);
                                    setIsAskTakePhoto(true);
                                  }
                                }}
                              >
                                <span>{choice.title}</span>
                              </p>
                            );
                          })}
                        </ElementWithDataTestId>
                      )}
                      {isShowPlayBackButton && (
                        <CaretRightOutlined
                          style={{
                            position: 'absolute',
                            bottom: '3px',
                            right: '2px',
                            opacity: isAnswerDisabled ? 0.5 : 1,
                          }}
                          disabled={isAnswerDisabled}
                          onClick={() => {
                            if (!isAnswerDisabled) {
                              onPlaybackVideoClick(videoUrl, message);
                            }
                          }}
                        />
                      )}
                    </ElementWithDataTestId>

                    {formatedDateTime && (
                      <ElementWithDataTestId
                        className="timestamp"
                        style={{
                          marginLeft: '8px',
                          marginBottom: '16px',
                          fontSize: `${customFontSize}${viewUnit}`,
                        }}
                      >
                        {formatedDateTime}
                      </ElementWithDataTestId>
                    )}
                  </div>
                </ElementWithDataTestId>
              );
            })}
            <div style={{ float: 'left', clear: 'both', height: '1px' }} ref={messagesEndRef} />
          </ElementWithDataTestId>
          <div
            className="chat-content-wrap"
            style={{
              width: 'fit-content',
              marginRight: 'auto',
              borderRadius: '50px',
              height: isChatHistoryMode ? '0px' : '100%',
              overflow:
                isChatHistoryMode || isAnswerDisabled || !isLastContentAlreadyDisplay
                  ? 'hidden'
                  : 'hidden',

              transform: `scale(${
                chatContentAnimationTransform === 0 ? 1 : 0.01
              },${delayChatContentAnimationTransformY})`,
              transition: 'transform 0.2s',
              transformOrigin: 'left bottom',
            }}
          >
            <div className="header-color" />
            <div
              className="chat-msg"
              style={{
                margin: '24px',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '32px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                overflow: 'hidden',
                height: '100%',
                width: '100%',
                minWidth: '500px',
              }}
            >
              {currentChatMediaArray.length !== 0 && (
                <ElementWithDataTestId
                  className="chat-msg"
                  style={{
                    marginBottom: isVertical ? '16px' : 'auto',
                  }}
                >
                  <div
                    className="answer"
                    style={{
                      opacity: 0.95,
                      borderRadius: '16px',
                      justifyContent: 'flex-start',
                      flexDirection: 'column',
                      padding: '24px',
                      margin: '24px',
                      width: 'fit-content',
                    }}
                  >
                    {currentChatMediaArray.length > 0 &&
                      currentChatMediaArray.map((mediaData, index) => {
                        const { mediaType, mediaUrl } = mediaData;
                        return mediaType === 'image' ? (
                          <div
                            style={{ position: 'relative' }}
                            key={`response-media-${mediaType}-${index}`}
                          >
                            <FullscreenOutlined
                              style={{
                                color: 'white',
                                fontSize: '32px',
                                position: 'absolute',
                                right: '0px',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                padding: '4px',
                                borderRadius: '12px',
                              }}
                              onClick={() => {
                                setIsShowBigImage(true);
                              }}
                            />

                            <img
                              src={mediaUrl}
                              alt={`response-media-${mediaType}-${index}`}
                              style={{ width: '100%', maxHeight: '500px' }}
                              // 500, 350, 263
                            />
                          </div>
                        ) : mediaType === 'file' ? (
                          <a
                            href={mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={`response-media-${mediaType}-${index}`}
                          >
                            <QRCode
                              value={mediaUrl}
                              style={{
                                height: '100%',
                                width: '100%',
                                maxWidth: '200px',
                                maxHeight: '200px',
                              }}
                              fgColor={'#eb222b'}
                              level={'L'} // L, M , Q , H , H is most complex
                            />
                          </a>
                        ) : (
                          <video
                            src={mediaUrl}
                            key={`response-media-${mediaType}-${index}`}
                            style={{
                              width: '90%',
                              maxWidth: '320px',
                              maxHeight: '320px',
                            }}
                            muted
                            autoPlay
                            loop
                            controls
                          />
                        );
                      })}
                  </div>
                </ElementWithDataTestId>
              )}

              {currentChatChoices.length > 0 && (
                <ElementWithDataTestId
                  className={isMultipleLanguages ? 'chat-msg-question' : 'chat-msg'}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {currentChatChoices.map((choice) => {
                    return (
                      <ElementWithDataTestId
                        className={isMultipleLanguages ? 'chat-msg-answer' : 'answer'}
                        key={choice.title}
                        style={{
                          opacity: 0.95,
                          cursor: 'pointer',
                          transform: `scale(${delayChatContentAnimationTransformY},${
                            chatContentAnimationTransform === 0 ? 1 : 0.01
                          })`,
                          width: 'fit-content',
                          minWidth: '21.4vh',
                          maxWidth: '95%',
                          padding: '0px 8px',
                        }}
                        onClick={() => {
                          if (!isAnswerDisabled) {
                            window.setTimeout(() => {
                              messagesEndRef?.current?.scrollIntoView({
                                behavior: 'smooth',
                              });
                            }, 200);
                            onSendMessage(choice);
                            setIsAskTakePhoto(true);
                          }
                        }}
                      >
                        <p
                          key={choice.title}
                          className="choice qa-conversation-choice-button"
                          style={{
                            opacity: 1,
                            cursor: 'pointer',
                            fontSize: '32px',
                          }}
                          disabled={isAnswerDisabled}
                        >
                          <span> {choice.title}</span>
                        </p>
                      </ElementWithDataTestId>
                    );
                  })}
                </ElementWithDataTestId>
              )}
            </div>
          </div>
        </>
      )}
    </StyledChatRoomVerticalChatContent>
  );
}
