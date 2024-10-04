import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import ScrollToBottom from 'react-scroll-to-bottom';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';

// lodash
import noop from 'lodash/noop';
import get from 'lodash/get';
import last from 'lodash/last';

// hooks
import { useDebounceFn } from 'ahooks';
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';
import { formatMessageOutput } from '@/chatbot-packages/hooks/formatChoice';

// qa
import { useAddDataTestId, ElementWithDataTestId } from '@/chatbot-packages/qa/useAddDataTestId';

// utils
import formatContent from '@/chatbot-packages/utils/formatContent';

// components
import ChatPlaceholder from './ChatPlaceholder';
import QRCode from 'react-qr-code';

// styles
import KeyinIcon from '@chatbot-test/public/test/assets/keyin.svg';
import { CaretRightOutlined } from '@ant-design/icons';

const StyledChatContent = styled(ScrollToBottom)`
  flex: 1;
  overflow-y: auto;

  @-webkit-keyframes popupChat {
    0% {
      transform: scale(0.5);
      opacity: 0.3;
    }
    30% {
      transform: scale(1.08, 1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes popupChat {
    0% {
      transform: scale(0.5);
      opacity: 0.3;
    }
    30% {
      transform: scale(1.08, 1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

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
        animation: popupChat 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 85% 15%;
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
        background-image: linear-gradient(105deg, #7399fb 7%, #8db5e6 70%);
        animation: popupChat 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 15% 15%;
        > span {
          font-family: Lexend;
          font-size: ${(props) => `${props.fontSize}${props.viewUnit}`};
          color: #fff;
        }

        > p {
          margin: 0px;
          font-family: Lexend;
          font-size: ${(props) => `${props.fontSize}${props.viewUnit}`};
          color: #fff;
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
  .chat-content-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    .chat-msg {
      margin-top: auto;
      margin-bottom: auto;
      .answer {
        padding: ${(props) => `0.83${props.viewUnit} 0`};
        border-radius: 1000px;
        border: 2px solid #7399fb;
        background-color: #fff;
        width: ${(props) => `21.4${props.viewUnit}`};
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: ${(props) => `1.63${props.viewUnit}`};
        p {
          font-size: ${(props) => `${props.fontSize + 0.15}${props.viewUnit}`};
          font-family: Lexend;
          color: #7399fb;
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
        background-color: #fff;
        max-width: 430px;
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 32px;
        p {
          font-size: ${(props) => props.fontSize + 4}px;
          font-family: Lexend;
          color: #7399fb;
          margin: 0px;
          text-align: center;
        }
      }
    }
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
  isMultipleLanguages = false,
  customClientChatBackgroundColor = '',
  customFontSize = 0.83,
  placeholderConfig = {},
  selectedServiceLanguage = '',
  viewUnit = 'vw',
  isVertical = false,
  isMobile = false,
  isUseTWDomain = false,
  onSendMessage = noop,
  onPlaybackVideoClick = noop,
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

  const { cachedProfileConfig, cachedFrontendProfileJson } = useProfileConfig();
  const { isShowPlayBackButton, isDisableInputWhenPlaying, defaultFirstMessage, profileModelName } =
    useMemo(() => {
      const isShowPlayBackCache = get(
        cachedFrontendProfileJson,
        ['data', 'basicConfig', 'showPlayBack'],
        process.env.NEXT_PUBLIC_IS_SHOW_PLAYBACK === 'true',
      );
      const defaultFirstMessageCache =
        get(cachedFrontendProfileJson, ['data', 'basicConfig', 'defaultFirstMessage'], '') ||
        'Hello';
      const modelName =
        get(cachedProfileConfig, ['data', 'presenterName'], '') ||
        process.env.NEXT_PUBLIC_PRESENTER_NAME_CHATROOM;
      const multipleLanguageModelName =
        selectedServiceLanguage === 'zh-HK' ? '虛擬大使' : 'Virtual Ambassador';
      return {
        isShowPlayBackButton: isShowPlayBackCache,
        isDisableInputWhenPlaying: true,
        defaultFirstMessage: defaultFirstMessageCache,
        profileModelName: isMultipleLanguages ? multipleLanguageModelName : modelName,
        selectedPlaceholderId: get(placeholderConfig, 'placeholderId', 0),
      };
    }, [
      cachedFrontendProfileJson,
      cachedProfileConfig,
      isMultipleLanguages,
      placeholderConfig,
      selectedServiceLanguage,
    ]);

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

  useAddDataTestId();

  return (
    <StyledChatContent className="chat-content" fontSize={customFontSize} viewUnit={viewUnit}>
      {chatHistoryArray.length === 0 ? (
        <ChatPlaceholder
          onSayHiClick={() => {
            onSendMessage(defaultFirstMessage);
          }}
          defaultFirstMessage={defaultFirstMessage}
          viewUnit={viewUnit}
          placeholderConfig={placeholderConfig}
        />
      ) : (
        <>
          <ElementWithDataTestId
            className="chat-history-wrap"
            style={{
              height: !isChatHistoryMode ? '0px' : '100%',
              overflow: !isChatHistoryMode ? 'hidden' : 'auto',
              padding: !isChatHistoryMode
                ? '0px'
                : isMobile
                  ? '24px 24px 32px 24px'
                  : '24px 46px 32px 46px',
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
              const videoBucket = get(history, 'videoBucket', '');
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
                        fontSize: `${customFontSize}${viewUnit}`,
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
                      className="App-logo"
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
                              // eslint-disable-next-line @next/next/no-img-element
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
                        <div className="choice-wrap qa-choice-wrap-custom">
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
                                  }
                                }}
                              >
                                <span>{choice.title}</span>
                              </p>
                            );
                          })}
                        </div>
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
                              onPlaybackVideoClick(
                                `${
                                  isUseTWDomain || videoBucket.includes('-tw')
                                    ? process.env.NEXT_PUBLIC_VIDEO_DOMAIN_KFC
                                    : process.env.NEXT_PUBLIC_VIDEO_DOMAIN_CHATROOM
                                }${videoUrl}`,
                                message,
                              );
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
              height: isChatHistoryMode ? '0px' : '100%',
              overflow: isChatHistoryMode ? 'hidden' : 'auto',
            }}
          >
            {currentChatMediaArray.length !== 0 && (
              <ElementWithDataTestId
                className="chat-msg"
                style={{ marginBottom: isVertical ? '16px' : 'auto' }}
              >
                <div
                  className="answer"
                  style={
                    isMultipleLanguages
                      ? {
                          opacity: 0.95,
                          borderRadius: '16px',
                          justifyContent: 'flex-start',
                          flexDirection: 'column',
                          padding: '24px',
                          margin: 'auto',
                          width: '100%',
                          height: '100%',
                        }
                      : isVertical
                        ? {
                            opacity: 0.95,
                            borderRadius: '16px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            padding: '24px',
                            marginLeft: '10%',
                            width: '80%',
                            height: '100%',
                            marginBottom: '16px',
                          }
                        : {
                            opacity: 0.95,
                            borderRadius: '16px',
                            justifyContent: 'flex-start',
                            flexDirection: 'column',
                            padding: '24px',
                          }
                  }
                >
                  {currentChatMediaArray.length > 0 &&
                    currentChatMediaArray.map((mediaData, index) => {
                      const { mediaType, mediaUrl } = mediaData;
                      return mediaType === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mediaUrl}
                          alt={`response-media-${mediaType}-${index}`}
                          style={{ width: '100%', maxHeight: '60vh' }}
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
              >
                {currentChatChoices.map((choice) => {
                  return (
                    <ElementWithDataTestId
                      className={isMultipleLanguages ? 'chat-msg-answer' : 'answer'}
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
              </ElementWithDataTestId>
            )}
          </div>
        </>
      )}
    </StyledChatContent>
  );
}
