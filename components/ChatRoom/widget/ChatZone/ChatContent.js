import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import ScrollToBottom from 'react-scroll-to-bottom';
import noop from 'lodash/noop';
import get from 'lodash/get';
import last from 'lodash/last';

import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import QRCode from 'react-qr-code';

// components
import ChatPlaceholder from './ChatPlaceholder';

// hooks
import { useDebounceFn } from 'ahooks';
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';
import { formatMessageOutput } from '@/chatbot-packages/hooks/formatChoice';

// qa
import { useAddDataTestId, ElementWithDataTestId } from '@/chatbot-packages/qa/useAddDataTestId';

// utils
import formatContent from '@/chatbot-packages/utils/formatContent';

// styles
import KeyinIcon from '@chatbot-test/public/test/assets/keyin_black.svg';

const StyledChatContent = styled(ScrollToBottom)`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;

  > button {
    opacity: 0;
  }

  .chat-history-wrap,
  .chat-content-wrap {
    ::-webkit-scrollbar {
      height: 3px;
      width: 3px;
    }

    ::-webkit-scrollbar-thumb {
      background: #eaeaea;
      -webkit-border-radius: 3ex;
    }
  }

  .chat-history-wrap {
    display: flex;
    flex-direction: column;
    padding: 0px 8px;

    .user-client {
      align-self: flex-end;
      max-width: 70%;
      margin-bottom: 16px;

      .conversation-wrap {
        padding: 6px 10px;
        object-fit: contain;
        background-image: linear-gradient(128deg, #f9c869 8%, #dc8c52 77%);

        > span {
          font-family: Lexend;
          font-size: 12px;
          color: #fff;
        }
      }

      .client-conversation-wrap {
        margin-right: 6px;
        border-radius: 16px 16px 0px 16px;
      }
    }

    .user-digital-human-message-and-question {
      max-width: 85%;
      margin-bottom: 16px;
      border-radius: 16px 16px 16px 0px;
      background-image: linear-gradient(105deg, #7399fb 7%, #8db5e6 70%);

      .user-digital-human {
        margin-bottom: 16px;

        .conversation-title-wrap {
          margin-bottom: 8px;
          opacity: 0.5;
          font-family: Lexend;
          font-size: 14px;
          color: #000000;
        }

        .conversation-wrap {
          width: 100%;
          padding: 6px 10px;
          width: fit-content;
          animation: popupChat 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
          transform-origin: 15% 15%;
        }
      }

      .user-digital-human-message {
        margin-bottom: 0px;

        .conversation-wrap {
          .qa-dh-response-text {
            padding: 8px 0px;
            font-family: Lexend;
            font-size: 13px;
            color: #fff;
            word-break: break-word;
          }

          > p {
            margin: 0px;
            font-family: Lexend;
            font-size: 12px;
            color: #fff;
            line-height: 18px;
          }
        }
      }

      .user-digital-human-question {
        .conversation-wrap {
          width: 80%;
          margin: 0 auto;
          margin-bottom: 16px;
          border-radius: 8px;

          .choice-wrap {
            width: 80%;
            margin: 0 auto;

            .choice {
              padding: 8px;
              border-radius: 20px;
              background-color: rgba(255, 255, 255, 0.9);
              cursor: pointer;
              border: 1px solid #435cee;
              text-align: center;

              > span {
                font-family: Lexend;
                font-size: 12px;
                text-align: center;
                color: #435cee;
              }
            }
          }
        }
      }
    }
  }

  .chat-content-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;

    .chat-msg {
      margin-top: auto;
      margin-bottom: auto;

      .answer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 192px;
        min-height: 32px;
        height: fit-content;
        margin-bottom: 24px;
        padding: 4px 0;
        border-radius: 1000px;
        border: 2px solid #7399fb;
        background-color: #fff;

        p {
          font-size: 12px;
          font-family: Lexend;
          color: #7399fb;
          margin: 0px;
          text-align: center;

          &.choice {
            width: 88%;
            line-height: 18px;
          }
        }

        > svg {
          margin-bottom: 0px !important;
        }

        > video {
          margin-bottom: 0px !important;
        }
      }
    }
  }
  p {
    font-family: Lexend;
  }
`;

export default function ChatContent({
  isChatHistoryMode = false,
  isWaitForResponseBoomerangMode = false,
  chatHistoryArray = [],
  isStopRecording = false,
  isReadyToPlay = false,
  playedHistoryIndexArray = [],
  playedResponseIndexArray = [],
  isLastContentAlreadyDisplay = true,
  isWaitingPlaybackVideo = false,
  customClientChatBackgroundColor = '',
  themeColor = '',
  isHideDigitalHuman = false,
  customClientChatTextColor = '',
  messageBoxCustomStyle = {},
  choiceCustomStyle = {},
  choiceWrapCustomStyle = {},

  onSendMessage = noop,
  setPlayedHistoryIndexArray = noop,
  setPlayedResponseIndexArray = noop,
}) {
  const messagesEndRef = useRef();
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

  const { cachedProfileConfig, cachedWidgetProfileJson } = useProfileConfig();
  const { isDisableInputWhenPlaying, defaultFirstMessage, languageCode } = useMemo(() => {
    const isShowPlayBackCache = get(cachedProfileConfig, ['data', 'showPlayBack'], false);
    const isDisableInputCache = get(
      cachedProfileConfig,
      ['data', 'disableInputWhenPlaying'],
      false,
    );
    const defaultFirstMessageCache =
      get(cachedWidgetProfileJson, ['data', 'defaultFirstMessage'], '') || 'Hello';
    const modelName =
      get(cachedProfileConfig, ['data', 'presenterName'], '') ||
      process.env.REACT_APP_PRESENTER_NAME_CHATROOM;
    const languageCode = get(cachedProfileConfig, ['data', 'language'], '') || 'en-US';
    return {
      isShowPlayBackButton: isShowPlayBackCache,
      isDisableInputWhenPlaying: isDisableInputCache,
      defaultFirstMessage: defaultFirstMessageCache,
      profileModelName: modelName,
      languageCode,
    };
  }, [cachedProfileConfig, cachedWidgetProfileJson]);

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
      last(isWaitForResponseBoomerangMode ? playedResponseIndexArray : playedHistoryIndexArray) ||
      -1;
    let mediaArray = [];
    let choices = [];
    if (currentIndex >= 0 && isLastContentAlreadyDisplay) {
      mediaArray = get(chatHistoryArray, [currentIndex, 'mediaList'], []);
    }
    if (currentIndex >= 0 && !isAnswerDisabled) {
      choices = get(chatHistoryArray, [currentIndex, 'choicesObj'], []);
    }
    return {
      currentChatChoices: choices || [],
      currentChatMediaArray: mediaArray || [],
    };
  }, [
    chatHistoryArray,
    isAnswerDisabled,
    isLastContentAlreadyDisplay,
    isWaitForResponseBoomerangMode,
    playedHistoryIndexArray,
    playedResponseIndexArray,
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
    if (chatHistoryArray.length !== 0 || isLastContentAlreadyDisplay) {
      window.setTimeout(() => {
        messagesEndRef?.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 200);
    }
  }, [chatHistoryArray.length, isLastContentAlreadyDisplay]);

  useEffect(() => {
    if (isHideDigitalHuman) {
      if (chatHistoryArray.length !== 0) {
        window.setTimeout(() => {
          messagesEndRef?.current?.scrollIntoView({
            behavior: 'smooth',
          });
        }, 200);
      }
    }
  }, [chatHistoryArray, isHideDigitalHuman]);

  useAddDataTestId();

  return (
    <StyledChatContent className="chat-content">
      {chatHistoryArray.length === 0 ? (
        <ChatPlaceholder
          onSayHiClick={() => {
            onSendMessage(defaultFirstMessage);
          }}
          defaultFirstMessage={defaultFirstMessage}
        />
      ) : (
        <>
          <ElementWithDataTestId
            className="chat-history-wrap"
            style={{
              height: !isChatHistoryMode ? '0px' : '100%',
              overflowY: !isChatHistoryMode ? 'hidden' : 'auto',
              overflowX: 'hidden',
              paddingTop: !isChatHistoryMode ? '0px' : '8px',
            }}
          >
            {chatHistoryArray.map((history = {}, index = '') => {
              const from = get(history, 'from', '');
              const message = get(history, 'message', '');
              const timestamp = get(history, 'timestamp', '');
              const formatedDateTime = genFormatedDateFromUnixTime(timestamp);
              const choices = get(history, 'choices', []);
              const isWaitingForSocketResponse = get(history, 'isWaitingForSocketResponse', false);
              const isQuestion = choices.length !== 0;
              const isPlayedHistory = playedHistoryIndexArray.includes(index);
              const isWaitingForResponseOrVideoLoading = isHideDigitalHuman
                ? isWaitingForSocketResponse
                : isWaitingForSocketResponse || !isPlayedHistory;
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
                        fontSize: '14px',
                        fontFamily: 'Lexend',
                      },
                    })
                  : message;
              const mediaArray = get(history, 'mediaList', []);
              const urlMediaArray = mediaArray.filter((mediaData) => {
                const { mediaType } = mediaData;
                return mediaType === 'file';
              });
              const mediaWithoutLink = mediaArray.filter((mediaData) => {
                const { mediaType } = mediaData;
                return mediaType !== 'file';
              });

              if (
                isHideDigitalHuman ||
                (!isWaitingForSocketResponse &&
                  isReadyToPlay &&
                  !isPlayedHistory &&
                  from !== 'user')
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
                    key={`user-msg-${index} qa-client-wrap`}
                    style={{
                      display: formatedDateTime ? 'flex' : 'block',
                    }}
                  >
                    {/* {formatedDateTime && (
                      <div
                        className="timestamp"
                        style={{
                          marginRight: '8px',
                        }}
                      >
                        {formatedDateTime}
                      </div>
                    )} */}

                    <ElementWithDataTestId
                      className="conversation-wrap client-conversation-wrap qa-client-text"
                      style={
                        themeColor === '' && customClientChatBackgroundColor === ''
                          ? { ...messageBoxCustomStyle }
                          : {
                              backgroundColor: customClientChatBackgroundColor || 'white',
                              backgroundImage: 'none',
                              ...messageBoxCustomStyle,
                            }
                      }
                    >
                      <span
                        style={
                          themeColor
                            ? {
                                color: customClientChatTextColor || themeColor || 'white',
                              }
                            : {}
                        }
                      >
                        {userMessage}
                      </span>
                    </ElementWithDataTestId>
                  </ElementWithDataTestId>
                );
              }

              return isShowLoadingPlaceholder ? (
                <ElementWithDataTestId className="user-digital-human" key={index}>
                  <ElementWithDataTestId
                    className="conversation-wrap digital-human-conversation-wrap qa-message-loader"
                    style={
                      themeColor === '' ? { position: 'relative', ...messageBoxCustomStyle } : {}
                    }
                  >
                    <KeyinIcon
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
                <ElementWithDataTestId
                  key={`chatbot-msg-${index}`}
                  className="user-digital-human-message-and-question"
                >
                  <div className="user-digital-human user-digital-human-message">
                    <div
                      style={{
                        display: formatedDateTime ? 'flex' : 'block',
                        alignItems: 'flex-end',
                      }}
                    >
                      <ElementWithDataTestId
                        className="conversation-wrap digital-human-conversation-wrap qa-dh-response-wrap"
                        style={
                          themeColor === ''
                            ? { position: 'relative', ...messageBoxCustomStyle }
                            : {}
                        }
                      >
                        <div
                          key={`${message}-${index}`}
                          className="qa-dh-response-text"
                          style={themeColor === '' ? { color: 'white' } : {}}
                        >
                          {chatBotMessage}
                        </div>
                        {mediaWithoutLink.length > 0 &&
                          mediaWithoutLink.map((mediaData, index) => {
                            const { mediaType, mediaUrl } = mediaData;

                            return mediaType === 'image' ? (
                              <a href={mediaUrl} target="_blank">
                                {/* eslint-disable-next-line @next/next/no-img-element*/}
                                <img
                                  src={mediaUrl}
                                  alt={`response-media-${mediaType}-${index}`}
                                  style={{ width: '100%', padding: '12px' }}
                                  key={`response-media-${mediaType}-${index}`}
                                />
                              </a>
                            ) : (
                              <video
                                src={mediaUrl}
                                key={`response-media-${mediaType}-${index}`}
                                style={{
                                  marginBottom: '32px',
                                  width: '90%',
                                  maxWidth: '280px',
                                  maxHeight: '150px',
                                }}
                                muted
                                autoPlay
                                loop
                                controls
                              />
                            );
                          })}
                      </ElementWithDataTestId>
                    </div>
                  </div>

                  <ElementWithDataTestId
                    className="user-digital-human user-digital-human-question"
                    key={index}
                  >
                    <div
                      style={{
                        display: formatedDateTime ? 'flex' : 'block',
                        alignItems: 'flex-end',
                        opacity: urlMediaArray.length > 0 || isQuestion ? 1 : 0,
                      }}
                    >
                      <ElementWithDataTestId
                        className="conversation-wrap digital-human-conversation-wrap"
                        style={{
                          position: 'relative',
                          backgroundImage: 'none',
                          padding: '0px',
                          width: '100%',
                        }}
                      >
                        {urlMediaArray.length > 0 && (
                          <div className="choice-wrap qa-choice-wrap-custom">
                            {urlMediaArray.map((mediaData, mediaIndex) => {
                              const { mediaUrl, mediaType, mediaTitle } = mediaData;
                              return mediaUrl && mediaType ? (
                                <a
                                  href={mediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  key={mediaUrl}
                                  style={{
                                    ...messageBoxCustomStyle,
                                  }}
                                >
                                  <p
                                    className="choice qa-conversation-choice-button"
                                    style={{
                                      opacity: isAnswerDisabled ? 0.3 : 1,
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
                                      }
                                    }}
                                  >
                                    <span key={mediaIndex}>
                                      {languageCode.includes('zh')
                                        ? mediaTitle.includes('進入')
                                          ? mediaTitle
                                          : `進入${mediaTitle}`
                                        : `Go to ${mediaTitle} website`}
                                    </span>
                                  </p>
                                </a>
                              ) : null;
                            })}
                          </div>
                        )}
                        {isQuestion && (
                          <div
                            className="choice-wrap qa-choice-wrap-custom"
                            style={choiceWrapCustomStyle}
                          >
                            {choices.map((choice, index) => {
                              return (
                                <p
                                  key={choice.title}
                                  className="choice qa-conversation-choice-button"
                                  style={{
                                    opacity: isAnswerDisabled ? 0.3 : 1,
                                    cursor: isAnswerDisabled ? 'default' : 'pointer',
                                    marginBottom: index === choices.length - 1 ? '0px' : '16px',
                                    fontSize: '12px',
                                    padding: '5px 4px 2px 4px',
                                    minHeight: '32px',
                                    borderColor: themeColor || '#435cee',
                                    color: customClientChatTextColor || themeColor || '#435cee',
                                    overflowWrap: 'break-word',

                                    ...choiceCustomStyle,
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
                                    }
                                  }}
                                >
                                  {choice.title}
                                </p>
                              );
                            })}
                          </div>
                        )}
                      </ElementWithDataTestId>
                    </div>
                  </ElementWithDataTestId>
                </ElementWithDataTestId>
              );
            })}
            <div style={{ float: 'left', clear: 'both' }} ref={messagesEndRef} />
          </ElementWithDataTestId>

          <div
            className="chat-content-wrap"
            style={{
              height: isChatHistoryMode ? '0px' : '100%',
              overflow: isChatHistoryMode ? 'hidden' : 'auto',
            }}
          >
            {currentChatMediaArray.length !== 0 && (
              <ElementWithDataTestId className="chat-msg">
                <div
                  className="answer"
                  style={{
                    opacity: 0.95,
                    borderRadius: '16px',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    padding: '24px',
                  }}
                >
                  {currentChatMediaArray.length > 0 &&
                    currentChatMediaArray.map((mediaData, index) => {
                      const { mediaType, mediaUrl } = mediaData;
                      return mediaType === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mediaUrl}
                          alt={`response-media-${mediaType}-${index}`}
                          style={{ marginBottom: '32px', width: '100%' }}
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
              </ElementWithDataTestId>
            )}

            {currentChatChoices.length > 0 && (
              <div className="chat-msg">
                {currentChatChoices.map((choice) => {
                  return (
                    <ElementWithDataTestId
                      className="answer"
                      key={choice.title}
                      style={{
                        opacity: isAnswerDisabled ? 0.5 : 0.95,
                        cursor: isAnswerDisabled ? 'default' : 'pointer',
                      }}
                      onClick={() => {
                        if (!isAnswerDisabled) {
                          window.setTimeout(() => {
                            messagesEndRef?.current?.scrollIntoView({
                              behavior: 'smooth',
                            });
                          }, 200);
                          onSendMessage(choice);
                        }
                      }}
                    >
                      <p
                        key={choice.title}
                        className="choice qa-conversation-choice-button"
                        style={{
                          opacity: isAnswerDisabled ? 0.5 : 1,
                          cursor: isAnswerDisabled ? 'default' : 'pointer',
                        }}
                        disabled={isAnswerDisabled}
                      >
                        <span> {choice.title}</span>
                      </p>
                    </ElementWithDataTestId>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </StyledChatContent>
  );
}
