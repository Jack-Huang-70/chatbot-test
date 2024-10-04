import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';

// lodash
import get from 'lodash/get';
import last from 'lodash/last';
import set from 'lodash/set';
import noop from 'lodash/noop';

// components
import { message, Input } from 'antd';
import DesktopEntrancePage from '@chatbot-test/components/ChatRoom/desktop/Index';
import VerticalEntrancePage from '@chatbot-test/components/ChatRoom/vertical/Index';
import WidgetEntrancePage from '@chatbot-test/components/ChatRoom/widget/Index';

// hooks
import { useMount } from 'ahooks';
import { useAddDataTestId } from '@/chatbot-packages/qa/useAddDataTestId';
import useOpenSocket from '@/chatbot-packages/hooks/core/socket/useOpenSocket';
import useInitSocket from '@/chatbot-packages/hooks/core/socket/useInitSocket';
import useCoreConfig from '@/chatbot-packages/hooks/core/useCoreConfig';
import useSendMessage from '@/chatbot-packages/hooks/core/sendMessage/useSendMessage';
import useFaceDetection from '@/chatbot-packages/hooks/core/useFaceDetection';
import useEventActive from '@/chatbot-packages/hooks/eventActive/useEventActive';

// context
import { DigitalHumanPreviewProvider } from '@chatbot-test/core/digitalHumanPreview/PreviewContext';

// tools
import {
  checkIsValidUrl,
  localStorageOrCookiesHandler,
  clearAuth,
  getUserToken,
  updateCreaditPoint,
  getLoginedUserName,
} from './tools';

// contanst
import {
  DEFAULT_CUSTOM_CALLBACK_OBJECT,
  RESPONSE_OVERTIME_COUNT,
  IS_PRESENTER_VIEW_ONLY,
  SERVICE_NAME,
  PASSCODE,
} from './constants';
import { DEFAULT_WAITING_FOR_SOCKET_RESPONSE_CONVERSATION } from '@/chatbot-packages/constants/defaultMessages';

// styles
import {
  StyledRoot,
  StyledModal,
  genPresenterViewOnlyStyle,
  genKioskStyle,
  genDesktopStyle,
} from './styles';

export default function Core({
  isDesktop = false,
  isWidget = false,
  isVertical = false,

  creatorStyleConfig = {},
  profileConfigData = {},
  backgroundImage = '',
  customAuthToken = '',
  customDefaultLanguage = 'en-US',

  isWaitForResponseBoomerangMode = false,
  isMultipleLanguages = false,
  isConfigCreator = false,
  isNeedPrivacyPolicy = false,
  isUseTWDomain = false,
  isHideDigitalHuman = false,
  isNeedFaceDetection = false,
  isNeedMultipleLanguages = false,
  isNeedChangeLanguageCommand = false,
  isFullScreenChatbotOnMobile = false,
  isEventActive = false,

  waitingMessageLogicType = '',

  setUpdateTransparentStandingVideoCanvasState = noop,
}) {
  const isConnectedSocketRef = useRef();
  const responseOvertimeTimerRef = useRef();
  const videoQueueListRef = useRef([]);
  const videoBufferTimeoutRef = useRef(null);
  const videoQueueBufferingRef = useRef(false);

  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isLoadingResponseMsg, setIsLoadingResponseMsg] = useState(false);
  const [socketState, setSocketState] = useState(null);
  const [isResponseMsgTimeout, setIsResponseMsgTimeout] = useState(false);
  const [isGotSuccessStatus, setIsGotSuccessStatus] = useState(false);
  const [
    customCallbackDuringVideo,
    // setCustomCallbackDuringVideo
  ] = useState(DEFAULT_CUSTOM_CALLBACK_OBJECT);

  // presenter
  const [isShowPresenterPreviewState, setIsShowPresenterPreviewState] = useState(true);
  const [showingVideoUrlState, setShowingVideoUrlState] = useState('');
  const [showingSubtitleContent, setShowingSubtitleContent] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isUpdatedVideoSrcFromChat, setIsUpdatedVideoSrcFromChat] = useState(false);
  const [isPlayedOneVideo, setIsPlayedOneVideo] = useState(false);

  const [chatHistoryArray, setChatHistoryArray] = useState([]);
  const [isGotPlaybackMsg, setIsGotPlaybackMsg] = useState(false);
  const [playedHistoryIndexArray, setPlayedHistoryIndexArray] = useState([]);
  const [playedResponseIndexArray, setPlayedResponseIndexArray] = useState([]);
  const [isWaitingPlaybackVideo, setIsWaitingPlaybackVideo] = useState(false);

  const [isShowConfig, setIsShowConfig] = useState(false);

  const [isOnSubtitle, setIsOnSubtitle] = useState(false);
  const [isChatHistoryMode, setIsChatHistoryMode] = useState(!isMultipleLanguages);
  const [latestResponseTotalStreamingDuration, setLatestResponseTotalStreamingDuration] =
    useState(0);

  const [onEnableAudioInteractiveClick, setOnEnableAudioInteractiveClick] = useState(noop);
  const [serverChatHistoryCleared, setServerChatHistoryCleared] = useState(false);

  // Chatbot Widget own logic
  const [isInitClearSocketSession, setIsInitClearSocketSession] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState('');

  // Multiple Languages use
  const [selectedServiceLanguage, setSelectedServiceLanguage] = useState(customDefaultLanguage);
  const [waitForUpdateSocketState, setWaitForUpdateSocketState] = useState('');
  const [isNeedStopRecord, setIsNeedStopRecord] = useState(false);
  const [isNeedStartRecord, setIsNeedStartRecord] = useState(false);

  // Login uses
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLogined, setIsLogined] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [currentChatQuota, setCurrentChatQuota] = useState(0);
  const [maximumChatQuota, setMaximumChatQuota] = useState(6);
  const [userName, setUserName] = useState('User');
  const [isShowLoginTab, setIsShowLoginTab] = useState(false);
  const [checkLoginStatus, setCheckLoginStatus] = useState('checking');

  const [
    isStartedPage,
    // setIsStartedPage
  ] = useState(false);
  const [isNeedSkipVideo, setIsNeedSkipVideo] = useState(false);
  const [isNeedRestartFaceReco, setIsNeedRestartFaceReco] = useState(false);

  // Face reco
  const [
    isShowingFaceDetectionDebug,
    //setIsShowingFaceDetectionDebug
  ] = useState(false);

  // IDLE, PLAYING and PLAYED
  const [videoPlayingStatus, setVideoPlayingStatus] = useState('IDLE');
  const [continuePlayVideosList, setContinuePlayVideosList] = useState([]);
  const [isInitComplete, setIsInitComplete] = useState(false);
  const [isNeedUpdateQueueHandler, setIsNeedUpdateQueueHandler] = useState(false);

  // video Queue handler
  const videoQueuePopHandle = useCallback(() => {
    if (videoQueueListRef.current.length === 0) {
      return;
    }
    if (videoQueueBufferingRef.current) {
      setTimeout(() => {
        setIsNeedUpdateQueueHandler(true);
      }, 2000);
      return;
    }

    const firstVideo = get(videoQueueListRef.current, [0], {});
    const videoStatus = get(firstVideo, 'videoStatus', '');
    if (videoStatus === 'STREAMING' || videoStatus === 'CACHED') {
      // pop
      setIsLoadingResponseMsg(false);
      setChatHistoryArray((prev) => {
        const next = prev.filter((history) => !get(history, 'isWaitingForSocketResponse'));
        if (videoQueueListRef.current.length === 1) {
          return next.concat(firstVideo);
        }
        if (videoQueueListRef.current.length === 0) {
          return prev;
        }
        return next.concat(firstVideo);
      });
      videoQueueBufferingRef.current = true;
      if (videoBufferTimeoutRef.current) {
        window.clearTimeout(videoBufferTimeoutRef.current);
        videoBufferTimeoutRef.current = null;
      }
      videoBufferTimeoutRef.current = setTimeout(() => {
        videoQueueBufferingRef.current = false;
      }, 2000);

      if (videoQueueListRef.current.length === 1) {
        setTimeout(() => {
          videoQueueListRef.current = [];
        }, 100);
      } else {
        setTimeout(() => {
          videoQueueListRef.current.shift();
        }, 100);

        // setTimeout(() => {
        //   setChatHistoryArray((prev) => {
        //     return prev.concat(DEFAULT_WAITING_FOR_SOCKET_RESPONSE_CONVERSATION);
        //   });
        // }, 1000);
      }
    }
  }, []);

  const setIsConnectedSocketRef = (value) => {
    isConnectedSocketRef.current = value;
  };

  const { profileStyleConfig, rootBackgroundColorConfig } = useCoreConfig({
    profileConfigData,
    creatorStyleConfig,
    isConfigCreator,
    isShowPresenterPreviewState,
    isDesktop,
  });

  const videoDomainState =
    get(profileConfigData, 'videoDomain', '') ||
    (isUseTWDomain
      ? process.env.NEXT_PUBLIC_VIDEO_DOMAIN_KFC
      : process.env.NEXT_PUBLIC_VIDEO_DOMAIN_CHATROOM);

  const isNeedAlphaChannel = get(profileConfigData, ['basicConfig', 'isNeedAlphaChannel'], false);

  const { isInsideBackground } = useMemo(() => {
    const nextProfile = isConfigCreator ? creatorStyleConfig : profileConfigData;
    return {
      isInsideBackground: get(nextProfile, ['basicConfig', 'isInsideBackground'], false),
    };
  }, [creatorStyleConfig, isConfigCreator, profileConfigData]);

  const {
    openSocketConnection,
    socketOnAllKeys,
    requestRecentHistory,
    requestLatestStatus,
    disconnectSocket,
    socketPing,
    clearSocketHistory,
    socketEmitMessage,
    socketEmitPlaybackUrl,
  } = useOpenSocket();

  // const { addPhraseOnRecognizer } = useAzureSpeechToText({ languageCode });

  const clearResponseOvertimeTimerRef = () => {
    if (responseOvertimeTimerRef?.current) {
      window.clearTimeout(responseOvertimeTimerRef.current);
      responseOvertimeTimerRef.current = '';
    }
  };

  const {
    handleResponseOvertime,
    initSocket,
    onDisconnectClickCallback,
    socketEmitPlayingStateCallback,
  } = useInitSocket({
    openSocketConnection,
    socketOnAllKeys,
    requestRecentHistory,
    requestLatestStatus,
    socketPing,
    disconnectSocket,

    profileConfigData,
    socketState,
    socketEmitPlaybackUrl,
    socketEmitMessage,

    isWidget,
    isMultipleLanguages,
    isHideDigitalHuman,

    selectedServiceLanguage,
    videoQueueListRef,
    waitingMessageLogicType,

    updateChatHistoryArray: setChatHistoryArray,
    updateIsPageLoading: setIsPageLoading,
    updateSocketState: setSocketState,
    updateWaitForUpdateSocketState: setWaitForUpdateSocketState,
    updatePlayedHistoryIndexArray: setPlayedHistoryIndexArray,
    updatePlayedResponseIndexArray: setPlayedResponseIndexArray,
    updateIsInitClearSocketSession: setIsInitClearSocketSession,
    updateSessionStartTime: setSessionStartTime,
    updateShowingVideoUrlState: setShowingVideoUrlState,
    updateIsGotPlaybackMsg: setIsGotPlaybackMsg,
    updateIsVideoPlaying: setIsVideoPlaying,
    updateIsPlayedOneVideo: setIsPlayedOneVideo,
    updateShowingSubtitleContent: setShowingSubtitleContent,
    updateIsLogined: setIsLogined,
    updateUserName: setUserName,
    updaetAuthToken: setAuthToken,
    updateIsLoadingResponseMsg: setIsLoadingResponseMsg,
    updateIsResponseMsgTimeout: setIsResponseMsgTimeout,
    updateCurrentChatQuota: setCurrentChatQuota,
    updateMaximumChatQuota: setMaximumChatQuota,
    updateIsConnectedSocket: setIsConnectedSocketRef,
    clearResponseOvertimeTimerRef,
    updateIsNeedUpdateQueueHandler: setIsNeedUpdateQueueHandler,
    updateServerChatHistoryCleared: setServerChatHistoryCleared,
  });

  const sendMessage = useSendMessage({
    authToken,
    customDefaultLanguage,
    selectedServiceLanguage,
    socketEmitPlaybackUrl,
    socketState,

    isLogined,
    isNeedFaceDetection,
    isHideDigitalHuman,
    isLoadingResponseMsg,
    isVertical,
    isNeedMultipleLanguages,
    isNeedChangeLanguageCommand,
    isEventActive,

    videoQueueListRef,
    waitingMessageLogicType,

    socketEmitMessage,
    handleResponseOvertime,
    clearSocketHistory,
    onEnableAudioInteractiveClick,
    updateIsNeedStartRecord: setIsNeedStartRecord,
    updateIsNeedStopRecord: setIsNeedStopRecord,
    updateIsNeedRestartFaceReco: setIsNeedRestartFaceReco,
    updateChatHistoryArray: setChatHistoryArray,
    updatePlayedHistoryIndexArray: setPlayedHistoryIndexArray,
    updatePlayedResponseIndexArray: setPlayedResponseIndexArray,
    updateIsResponseMsgTimeout: setIsResponseMsgTimeout,
    updateIsWaitingPlaybackVideo: setIsWaitingPlaybackVideo,
    updateIsPlayedOneVideo: setIsPlayedOneVideo,
    updateIsLoadingResponseMsg: setIsLoadingResponseMsg,
    updateIsUpdatedVideoSrcFromChat: setIsUpdatedVideoSrcFromChat,
    updateIsNeedSkipVideo: setIsNeedSkipVideo,
    updateSelectedServiceLanguage: setSelectedServiceLanguage,
    updateShowingVideoUrlState: setShowingVideoUrlState,
  });

  const {
    faceRecognitionDebugElement,
    updateIsStopRecoVideoStreaming,
    updateIsPauseRecognition,
    updateRecognitionIsStartedFlow,
    updateFaceRecognitionLangage,
  } = useFaceDetection({
    socketState,
    isNeedFaceDetection,
    isMultipleLanguages,
    onSendMessage: sendMessage,
    clearTheFlowWhenMissFace: () => {
      setChatHistoryArray([]);
      clearSocketHistory(socketState);
      setPlayedHistoryIndexArray([]);
      setPlayedResponseIndexArray([]);
      setIsResponseMsgTimeout(false);
      setIsWaitingPlaybackVideo(false);
      setIsPlayedOneVideo(false);
      setIsLoadingResponseMsg(false);
      setIsUpdatedVideoSrcFromChat(false);
      if (!isVertical && !isNeedMultipleLanguages) {
        setSelectedServiceLanguage(customDefaultLanguage);
      }
      setIsNeedStopRecord(true);
    },
  });

  const { latestResponseVideoUrl, latestResponseSubtitleContent } = useMemo(() => {
    setIsUpdatedVideoSrcFromChat(true);
    if (chatHistoryArray.length !== 0) {
      const next = chatHistoryArray.filter((history) => get(history, 'from', '') === 'chatbot');
      if (!isLoadingResponseMsg && next.length !== 0) {
        const pureVideoUrl = get(last(next), 'videoUrl', '');
        const videoUrl = get(last(next), 'videoUrl', '') + `?timestamp=${Date.now()}`;
        const subtitle = get(last(next), 'message', '');
        const isFromHistory = get(last(next), 'isFromHistory', false);
        const videoBucket = get(last(next), 'videoBucket', '');
        const isWaitingMsg = get(last(next), 'isWaitingMsg', false);
        if (isFromHistory || pureVideoUrl === '') {
          return {
            latestResponseVideoUrl: '',
            latestResponseSubtitleContent: '',
          };
        }
        // const isUrl = true;
        const isUrl = checkIsValidUrl({ url: videoUrl });
        if (isWaitingMsg) {
          setTimeout(() => {
            setChatHistoryArray((prev) => {
              const lastContent = last(prev);
              const { isWaitingMsg } = lastContent;
              if (isWaitingMsg) {
                return prev.concat(DEFAULT_WAITING_FOR_SOCKET_RESPONSE_CONVERSATION);
              }
              return prev;
            });
          }, 300);
        }
        if (isUrl) {
          return {
            latestResponseVideoUrl: videoUrl,
            latestResponseSubtitleContent: subtitle,
          };
        } else {
          if (videoBucket.includes('-tw')) {
            return {
              latestResponseVideoUrl: `${process.env.NEXT_PUBLIC_VIDEO_DOMAIN_KFC}${videoUrl}`,
              latestResponseSubtitleContent: subtitle,
            };
          }
          if (videoDomainState) {
            return {
              latestResponseVideoUrl: `${videoDomainState}${videoUrl}`,
              latestResponseSubtitleContent: subtitle,
            };
          } else {
            return {
              latestResponseVideoUrl: `${
                isUseTWDomain
                  ? process.env.NEXT_PUBLIC_VIDEO_DOMAIN_KFC
                  : process.env.NEXT_PUBLIC_VIDEO_DOMAIN_CHATROOM
              }${videoUrl}`,
              latestResponseSubtitleContent: subtitle,
            };
          }
        }
      }

      return {
        latestResponseVideoUrl: '',
        latestResponseSubtitleContent: '',
      };
    }

    return { latestResponseVideoUrl: '', latestResponseSubtitleContent: '' };
  }, [chatHistoryArray, isLoadingResponseMsg, isUseTWDomain, videoDomainState]);

  const isPresenterViewOnlyChatbotPageStyle = useMemo(() => {
    if (!isDesktop && !isWidget && !isVertical) {
      return genPresenterViewOnlyStyle();
    }

    if (isVertical) {
      return genKioskStyle(isNeedAlphaChannel);
    }

    if (isDesktop) {
      return genDesktopStyle({ isNeedAlphaChannel });
    }

    return {};
  }, [isDesktop, isWidget, isVertical, isNeedAlphaChannel]);

  const isResponseLoadedAndReadyToPlay = useMemo(() => {
    if (isHideDigitalHuman || !isLogined) {
      return true;
    }
    if (!isLoadingResponseMsg && isPlayedOneVideo) {
      setTimeout(() => {
        setIsPlayedOneVideo(false);
      }, 400);
      setIsWaitingPlaybackVideo(false);
      clearResponseOvertimeTimerRef();

      // TO-DO update the array
      return true;
    }
    return false;
  }, [isHideDigitalHuman, isLoadingResponseMsg, isLogined, isPlayedOneVideo]);

  const isLastContentAlreadyDisplay = useMemo(() => {
    const filteredChatHistoryArray = chatHistoryArray
      .map((chat, index) => {
        return set(chat, 'historyIndex', index);
      })
      .filter((chat) => {
        return get(chat, 'from', '') === 'chatbot';
      });
    const lastContentIndex = get(
      filteredChatHistoryArray[filteredChatHistoryArray.length - 1],
      'historyIndex',
      -1,
    );
    if (lastContentIndex >= 0) {
      const isPlayedHistory = playedHistoryIndexArray.includes(lastContentIndex);
      const isPlayedResponse = playedResponseIndexArray.includes(lastContentIndex);
      return isWaitForResponseBoomerangMode ? isPlayedHistory && isPlayedResponse : isPlayedHistory;
    }
    return true;
  }, [
    chatHistoryArray,
    isWaitForResponseBoomerangMode,
    playedHistoryIndexArray,
    playedResponseIndexArray,
  ]);

  const isStopRecording = useMemo(() => {
    return isLoadingResponseMsg || (isVideoPlaying && showingVideoUrlState !== '');
  }, [isLoadingResponseMsg, isVideoPlaying, showingVideoUrlState]);

  const onClearChatButtonClickCallback = useCallback(() => {
    setChatHistoryArray([
      {
        choices: [],
        from: 'chatbot',
        historyIndex: 1,
        isWaitingForSocketResponse: true,
        message: '',
        timestamp: '',
        videoUrl: '',
      },
    ]);
    clearSocketHistory(socketState);
    setPlayedHistoryIndexArray([]);
    setPlayedResponseIndexArray([]);
    setIsResponseMsgTimeout(false);
    setIsWaitingPlaybackVideo(false);
    setIsPlayedOneVideo(false);
    setIsLoadingResponseMsg(false);
    setIsUpdatedVideoSrcFromChat(false);
    updateRecognitionIsStartedFlow(false);
    if (!isVertical && !isNeedMultipleLanguages) {
      setSelectedServiceLanguage(customDefaultLanguage);
    }
    setIsNeedStopRecord(true);
  }, [
    clearSocketHistory,
    customDefaultLanguage,
    isVertical,
    socketState,
    updateRecognitionIsStartedFlow,
    isNeedMultipleLanguages,
  ]);

  const handleContentPayload = useCallback(
    (isAfterVideo = false) => {
      const { duringVideo, afterVideo } = customCallbackDuringVideo;
      if (isAfterVideo) {
        afterVideo();
      } else {
        duringVideo();
      }
    },
    [customCallbackDuringVideo],
  );

  const checkStreamingVideoIsPlayed = useCallback(() => {
    if (!isLastContentAlreadyDisplay && !isVideoPlaying) {
      setShowingVideoUrlState((prev) => {
        if (prev === latestResponseVideoUrl) {
          return `${prev}?`;
        } else {
          return latestResponseVideoUrl;
        }
      });
    }
  }, [isLastContentAlreadyDisplay, isVideoPlaying, latestResponseVideoUrl]);

  const onPlaybackVideoClickCallback = useCallback(
    (url = '', subtitle = '') => {
      if (url !== '') {
        if (isWaitForResponseBoomerangMode) {
          setIsWaitingPlaybackVideo(true);
        }
        setShowingVideoUrlState((prev) => {
          if (prev === url) {
            setIsGotPlaybackMsg(true);
          }
          return url;
        });
        setShowingSubtitleContent(subtitle);
        socketEmitPlaybackUrl({
          socket: socketState,
          message: {
            key: 'playback',
            value: {
              url,
              subtitle,
            },
          },
        });
      }
    },
    [isWaitForResponseBoomerangMode, socketEmitPlaybackUrl, socketState],
  );

  const onShowPresenterClickCallback = useCallback(() => {
    setIsShowPresenterPreviewState(true);
    localStorageOrCookiesHandler({
      method: 'set',
      key: `${SERVICE_NAME}_showPresenter`,
      value: 'true',
    });
  }, []);

  const openNewTabCallback = useCallback(() => {
    setIsShowPresenterPreviewState(false);

    localStorageOrCookiesHandler({
      method: 'set',
      key: `${SERVICE_NAME}_showPresenter`,
      value: 'false',
    });

    Object.assign(document.createElement('a'), {
      target: '_blank',
      rel: 'noopener noreferrer',
      href: `${window.location.origin}/?service=${SERVICE_NAME}&presenterViewOnly=true&passcode=${PASSCODE}`,
    }).click();
  }, []);

  useEffect(() => {
    if (isNeedFaceDetection) {
      updateFaceRecognitionLangage(selectedServiceLanguage);
    }
  }, [isNeedFaceDetection, selectedServiceLanguage, updateFaceRecognitionLangage]);

  useEffect(() => {
    if (isPlayedOneVideo) {
      setVideoPlayingStatus('PLAYING');
      // handleContentPayload();
    }
  }, [handleContentPayload, isPlayedOneVideo]);

  useEffect(() => {
    if (videoPlayingStatus === 'PLAYING' && !isVideoPlaying) {
      setVideoPlayingStatus('PLAYED');
    }
  }, [isVideoPlaying, videoPlayingStatus]);

  useEffect(() => {
    if (videoPlayingStatus === 'PLAYED') {
      handleContentPayload(true);
      setTimeout(() => {
        setVideoPlayingStatus('IDLE');
      }, 100);
    }
  }, [handleContentPayload, videoPlayingStatus]);

  useEffect(() => {
    if (
      isVideoPlaying ||
      isLoadingResponseMsg ||
      !isLastContentAlreadyDisplay ||
      isShowConfig
      // || isListening
    ) {
      updateIsStopRecoVideoStreaming(true);
    } else {
      if (continuePlayVideosList.length > 0) {
        const nextContinuePlayVideosList = continuePlayVideosList;
        const targetData = nextContinuePlayVideosList.shift();
        setChatHistoryArray((prev) => {
          const nextMsg = targetData;
          nextMsg.timestamp = Date.now();
          return prev.concat(nextMsg);
        });
        socketEmitPlaybackUrl({
          socket: socketState,
          message: {
            key: 'playback',
            value: {
              url: targetData.videoUrl,
              subtitle: targetData.message,
            },
          },
        });
        setContinuePlayVideosList(nextContinuePlayVideosList);
      } else {
        updateIsStopRecoVideoStreaming(false);
      }
    }
  }, [
    continuePlayVideosList,
    isLastContentAlreadyDisplay,
    isLoadingResponseMsg,
    isShowConfig,
    isVideoPlaying,
    updateIsStopRecoVideoStreaming,
    socketEmitPlaybackUrl,
    socketState,
  ]);

  useEffect(() => {
    if (isShowConfig) {
      if (isShowingFaceDetectionDebug) {
        updateIsStopRecoVideoStreaming(false);

        updateIsPauseRecognition(true);
      } else {
        updateIsStopRecoVideoStreaming(true);

        updateIsPauseRecognition(false);
      }
    } else {
      updateIsPauseRecognition(false);
    }
  }, [
    isShowConfig,
    isShowingFaceDetectionDebug,
    updateIsPauseRecognition,
    updateIsStopRecoVideoStreaming,
  ]);

  useEffect(() => {
    if (isStartedPage) {
      updateIsStopRecoVideoStreaming(false);
    } else {
      updateIsStopRecoVideoStreaming(true);
    }
  }, [isStartedPage, updateIsStopRecoVideoStreaming]);

  useEffect(() => {
    if (socketState && isInitClearSocketSession) {
      clearSocketHistory(socketState);
      setIsInitClearSocketSession(false);
    }
  }, [clearSocketHistory, isInitClearSocketSession, socketState]);

  useEffect(() => {
    if (isGotSuccessStatus) {
      checkStreamingVideoIsPlayed();
      setIsGotSuccessStatus(false);
    }
  }, [checkStreamingVideoIsPlayed, isGotSuccessStatus]);

  useEffect(() => {
    if (latestResponseVideoUrl !== '' && isUpdatedVideoSrcFromChat && !isResponseMsgTimeout) {
      setIsUpdatedVideoSrcFromChat(false);
      setShowingVideoUrlState((prev) => {
        if (prev === latestResponseVideoUrl) {
          setIsGotPlaybackMsg(true);
        }
        return latestResponseVideoUrl;
      });
      setShowingSubtitleContent(latestResponseSubtitleContent);
    } else if (isResponseMsgTimeout && isUpdatedVideoSrcFromChat) {
      setIsUpdatedVideoSrcFromChat(false);
      setTimeout(() => {
        setIsResponseMsgTimeout(false);
      }, [1000]);
    }
  }, [
    isResponseMsgTimeout,
    isUpdatedVideoSrcFromChat,
    latestResponseSubtitleContent,
    latestResponseVideoUrl,
  ]);

  useEffect(() => {
    if (isNeedRestartFaceReco) {
      setIsNeedRestartFaceReco(false);
      updateRecognitionIsStartedFlow(false);
    }
  }, [isNeedRestartFaceReco, updateRecognitionIsStartedFlow]);

  useEffect(() => {
    if (isLastContentAlreadyDisplay) {
      clearResponseOvertimeTimerRef();
    } else {
      if (isHideDigitalHuman) {
        if (!responseOvertimeTimerRef?.current || responseOvertimeTimerRef === '') {
          responseOvertimeTimerRef.current = window.setTimeout(() => {
            console.log('Frontend timeout');
            message.error('Timeout');
            handleResponseOvertime();
          }, 12000);
        }
      } else {
        if (!responseOvertimeTimerRef?.current || responseOvertimeTimerRef === '') {
          responseOvertimeTimerRef.current = window.setTimeout(() => {
            console.log('Frontend timeout');
            message.error('Timeout');
            handleResponseOvertime();
          }, RESPONSE_OVERTIME_COUNT);
        }
      }
    }
  }, [
    handleResponseOvertime,
    isHideDigitalHuman,
    isLastContentAlreadyDisplay,
    responseOvertimeTimerRef,
  ]);

  useEffect(() => {
    if (!isStopRecording && isLastContentAlreadyDisplay) {
      setLatestResponseTotalStreamingDuration(0);
    }
  }, [isLastContentAlreadyDisplay, isStopRecording]);

  const isConnectionValid = (!!socketState && !isLoadingResponseMsg) || !isLogined;

  useEffect(() => {
    if (waitForUpdateSocketState !== '') {
      disconnectSocket({
        socket: socketState,
        callback: () => {
          // isConnectedSocketRef = false;
          setIsConnectedSocketRef(false);
          setSocketState(null);
          const userAuthToken = customAuthToken;
          setTimeout(() => {
            // eslint-disable-next-line no-use-before-define
            initSocket({
              authToken: userAuthToken,
            });
          }, 500);
        },
      });
      setWaitForUpdateSocketState('');
    }
  }, [customAuthToken, disconnectSocket, initSocket, socketState, waitForUpdateSocketState]);

  useEffect(() => {
    // send 'Hi' message after the clear from the server has been finished
    if (serverChatHistoryCleared && sendMessage) {
      setChatHistoryArray([]);
      setServerChatHistoryCleared(false);
      sendMessage('Hi');
    }
  }, [sendMessage, serverChatHistoryCleared]);

  useEffect(() => {
    if (isNeedUpdateQueueHandler) {
      setIsNeedUpdateQueueHandler(false);
      if (!isVideoPlaying) {
        videoQueuePopHandle();
      }
    }
  }, [isNeedUpdateQueueHandler, isVideoPlaying, videoQueuePopHandle]);

  useEffect(() => {
    if (!isVideoPlaying) {
      setIsNeedUpdateQueueHandler(true);
    }
  }, [isVideoPlaying]);

  const eventActiveConfig = useEventActive({
    isEventActive,
    isStopRecording,
    onClearChatButtonClickCallback,
    setIsNeedSkipVideo,
  });

  const sharedComponentProps = useMemo(() => {
    return {
      serviceName: SERVICE_NAME,
      passcode: PASSCODE,
      showingVideoUrlState,
      showingSubtitleContent,
      chatHistoryArray,
      playedHistoryIndexArray,
      playedResponseIndexArray,
      latestResponseTotalStreamingDuration,
      creatorStyleConfig,
      profileStyleConfig,
      selectedServiceLanguage,
      authToken,
      currentChatQuota,
      maximumChatQuota,
      userName,
      checkLoginStatus,

      isPresenterViewOnly: IS_PRESENTER_VIEW_ONLY,
      isShowConfig,
      isShowPresenterPreviewState,
      isVideoPlaying,
      isGotPlaybackMsg,
      isWaitForResponseBoomerangMode,
      isStopRecording,
      isResponseLoadedAndReadyToPlay,
      isLastContentAlreadyDisplay,
      isWaitingPlaybackVideo,
      isLoadingResponseMsg,
      isConnectionValid,
      isPageLoading,
      isDesktop,
      isVertical,
      isOnSubtitle,
      isChatHistoryMode,
      isConfigCreator,
      isMultipleLanguages,
      isLogined,
      isNeedStopRecord,
      isNeedStartRecord,

      onSendMessage: sendMessage,
      onEnableAudioInteractiveClick,
      onDisconnectClick: onDisconnectClickCallback,
      socketEmitPlayingState: socketEmitPlayingStateCallback,
      onPlaybackVideoClick: onPlaybackVideoClickCallback,
      onClearChatButtonClick: onClearChatButtonClickCallback,
      onShowPresenterClickCallback,
      openNewTabCallback,
      setIsGotPlaybackMsg,
      setIsVideoPlaying,
      setIsShowConfig,
      setIsPlayedOneVideo,
      setPlayedHistoryIndexArray,
      setPlayedResponseIndexArray,
      setIsShowPresenterPreviewState,
      setOnEnableAudioInteractiveClick,
      setIsOnSubtitle,
      setIsChatHistoryMode,
      setUpdateTransparentStandingVideoCanvasState,
      setIsNeedStopRecord,
      setIsNeedStartRecord,
      setIsLogined,
      setAuthToken,
      setIsShowLoginTab,
      setSelectedServiceLanguage,
    };
  }, [
    isShowConfig,
    showingVideoUrlState,
    isShowPresenterPreviewState,
    isVideoPlaying,
    isGotPlaybackMsg,
    showingSubtitleContent,
    isWaitForResponseBoomerangMode,
    chatHistoryArray,
    isStopRecording,
    isResponseLoadedAndReadyToPlay,
    playedHistoryIndexArray,
    playedResponseIndexArray,
    isLastContentAlreadyDisplay,
    isWaitingPlaybackVideo,
    isLoadingResponseMsg,
    isConnectionValid,
    isPageLoading,
    onEnableAudioInteractiveClick,
    isDesktop,
    isVertical,
    isOnSubtitle,
    latestResponseTotalStreamingDuration,
    isChatHistoryMode,
    isConfigCreator,
    creatorStyleConfig,
    profileStyleConfig,
    setIsGotPlaybackMsg,
    isMultipleLanguages,
    selectedServiceLanguage,
    setIsVideoPlaying,
    openNewTabCallback,
    setIsShowConfig,
    setIsPlayedOneVideo,
    sendMessage,
    setPlayedHistoryIndexArray,
    setPlayedResponseIndexArray,
    setIsShowPresenterPreviewState,
    onDisconnectClickCallback,
    setUpdateTransparentStandingVideoCanvasState,
    onPlaybackVideoClickCallback,
    onClearChatButtonClickCallback,
    setOnEnableAudioInteractiveClick,
    setIsOnSubtitle,
    setIsChatHistoryMode,
    onShowPresenterClickCallback,
    isNeedStopRecord,
    setIsNeedStopRecord,
    isNeedStartRecord,
    setIsNeedStartRecord,
    isLogined,
    setIsLogined,
    authToken,
    setAuthToken,
    currentChatQuota,
    maximumChatQuota,
    userName,
    setIsShowLoginTab,
    checkLoginStatus,
    socketEmitPlayingStateCallback,
  ]);

  useMount(async () => {
    if (!isInitComplete) {
      if (!isConnectedSocketRef.current) {
        setIsConnectedSocketRef(true);
        // isConnectedSocketRef = true;
        const userAuthToken = customAuthToken !== '' ? customAuthToken : await getUserToken();
        if (userAuthToken) {
          setIsLogined(true);
          setAuthToken(userAuthToken);
          setCheckLoginStatus('success');
          updateCreaditPoint((currentCredit, totalCredit) => {
            setCurrentChatQuota(currentCredit);
            setMaximumChatQuota(totalCredit || 50);
          });
          const loginedUserName = getLoginedUserName();
          setUserName(loginedUserName);
          initSocket({ authToken: userAuthToken });
        } else {
          setCheckLoginStatus('failed');
          setIsLogined(false);
          setUserName('User');
          setAuthToken('');
        }
      }

      const isShowPresenterViewFromCache = localStorageOrCookiesHandler({
        method: 'get',
        key: `${SERVICE_NAME}_showPresenter`,
      });
      if (isShowPresenterViewFromCache) {
        setIsShowPresenterPreviewState(isShowPresenterViewFromCache !== 'false');
      }

      if (typeof window !== 'undefined') {
        window.sendMessageFunction = sendMessage; // For console
        window.clearChatbotFunction = onClearChatButtonClickCallback; // For console
      }

      setIsInitComplete(true);
    }
  });

  useAddDataTestId();

  return (
    <DigitalHumanPreviewProvider
      eventActiveConfig={eventActiveConfig}
      src={showingVideoUrlState}
      subtitleContent={showingSubtitleContent}
      subtitleDuration={latestResponseTotalStreamingDuration}
      isDesktop={isDesktop}
      isShowingSubtitle={isOnSubtitle}
      isShowPresenterPreviewState={isShowPresenterPreviewState}
      isShowSkipButton={false}
      isPresenterViewOnly={IS_PRESENTER_VIEW_ONLY}
      isGotPlaybackMsg={isGotPlaybackMsg}
      isWaitForResponseBoomerangMode={isWaitForResponseBoomerangMode}
      isNeedSkipVideo={isNeedSkipVideo}
      isInitComplete={isInitComplete}
      isEventActive={isEventActive}
      videoQueueListRef={videoQueueListRef}
      //
      onOpenInTheNewTabClick={openNewTabCallback}
      onOpenConfigModalClick={() => setIsShowConfig(true)}
      setUpdateTransparentStandingVideoCanvasState={setUpdateTransparentStandingVideoCanvasState}
      setIsNeedSkipVideo={setIsNeedSkipVideo}
      setIsGotPlaybackMsg={setIsGotPlaybackMsg}
      setIsVideoPlaying={setIsVideoPlaying}
      socketEmitPlayingState={socketEmitPlayingStateCallback}
      setIsPlayedOneVideo={setIsPlayedOneVideo}
      setOnEnableAudioInteractiveClick={setOnEnableAudioInteractiveClick}
      onClearChatButtonClick={onClearChatButtonClickCallback}
      updateChatHistoryArray={setChatHistoryArray}
    >
      {isDesktop ? (
        <StyledRoot
          style={{
            backgroundColor: rootBackgroundColorConfig,
            width: '100%',
            height: 'fit-content',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {!isInsideBackground && backgroundImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={backgroundImage}
              alt="chatbot-desktop-bg"
              style={{
                position: 'absolute',
                zIndex: 1,
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
              }}
            />
          )}
          <DesktopEntrancePage
            {...sharedComponentProps}
            isPresenterViewOnlyChatbotPageStyle={isPresenterViewOnlyChatbotPageStyle}
            isHideDigitalHuman={isHideDigitalHuman}
            isNeedPrivacyPolicy={isNeedPrivacyPolicy}
            isUseTWDomain={isUseTWDomain}
          />
          <div
            style={{
              opacity: isShowingFaceDetectionDebug ? '1' : '0',
              overflow: 'hidden',
              // top: 'calc(50% - 146px)',
              // left: 'calc(5% + 40px)',
              position: 'absolute',
              zIndex: isShowingFaceDetectionDebug ? '1001' : '-3', // Modal is 1000
            }}
          >
            {faceRecognitionDebugElement}
          </div>
        </StyledRoot>
      ) : isVertical ? (
        <StyledRoot
          style={{
            backgroundColor: rootBackgroundColorConfig,
            width: '100%',
            height: 'fit-content',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt="chatbot-desktop-bg"
            style={{
              position: 'absolute',
              zIndex: 1,
              // height: '100%',
              // width: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              maxHeight: '100%',
              // minWidth: '607.5px',
              height: '100vh',
              maxWidth: isNeedAlphaChannel ? 'none' : '1080px',
              aspectRatio: '9/16',
              // minHeight: '1080px',
              width: 'auto',
            }}
          />
          <VerticalEntrancePage
            {...sharedComponentProps}
            isPresenterViewOnlyChatbotPageStyle={isPresenterViewOnlyChatbotPageStyle}
          />
          <div
            style={{
              opacity: isShowingFaceDetectionDebug ? '1' : '0',
              overflow: 'hidden',
              top: 'calc(50% - 146px)',
              left: 'calc(5% + 40px)',
              position: 'absolute',
              zIndex: isShowingFaceDetectionDebug ? '1001' : '-3', // Modal is 1000
            }}
          >
            {faceRecognitionDebugElement}
          </div>
          <StyledModal
            title={`Admin Login`}
            className="admin-login"
            open={isShowLoginTab}
            footer={null}
            centered={true}
            destroyOnClose={true}
            onCancel={() => {
              setIsShowLoginTab(false);
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {isLogined ? (
                <button
                  type="button"
                  style={{
                    // backgroundColor: '#0057A3',
                    border: '1px solid gray',
                    borderRadius: '16px',
                    padding: '12px',
                  }}
                  onClick={() => {
                    setIsLogined(false);
                    setAuthToken('');
                    clearAuth();
                    setUserName('User');
                    disconnectSocket({
                      socket: socketState,
                      callback: () => {
                        // isConnectedSocketRef = false;
                        setIsConnectedSocketRef(false);
                        setSocketState(null);
                        message.success('Logout success');
                      },
                    });
                  }}
                >
                  <p style={{ fontFamily: 'Lexend', color: 'white' }}>Logout</p>
                </button>
              ) : (
                <>
                  <div
                    style={{
                      height: '40px',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <p style={{ marginRight: '16px', minWidth: '80px', fontFamily: 'Lexend' }}>
                      Email:{' '}
                    </p>
                    <Input
                      value={loginEmail}
                      onChange={(evt) => {
                        setLoginEmail(evt.target.value);
                      }}
                    />
                  </div>
                  <div
                    style={{
                      height: '40px',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <p style={{ marginRight: '16px', minWidth: '80px', fontFamily: 'Lexend' }}>
                      Password:
                    </p>
                    <Input
                      type="password"
                      value={loginPassword}
                      onChange={(evt) => {
                        setLoginPassword(evt.target.value);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    style={{
                      backgroundColor: '#0057A3',
                      border: '1px solid gray',
                      borderRadius: '16px',
                      padding: '12px',
                    }}
                    onClick={() => {
                      const config = {
                        method: 'post',
                        maxBodyLength: Infinity, // url: 'http://localhost:8801/v1/oauth/signin',
                        url: `${process.env.NEXT_PUBLIC_LOGIN_SERVER_URL}/v1/oauth/signin`,
                        headers: {
                          // Origin: 'http://test.plab.ai',
                          'Content-Type': 'application/json',
                        },
                        data: {
                          password: loginPassword,
                          email: loginEmail,
                          profileId: 'cVfUCBCfyKhUq3MxJ49qI',
                          subpath: '/assistantVertical',
                        },
                        maxRedirects: 0,
                        validateStatus: null,
                      };

                      axios
                        .request(config)
                        .then((response) => {
                          if (response?.data && response?.status === 200) {
                            window.location.href = response.data.url;
                          } else {
                            console.error('Email or password error, please try again');
                            message.warning('Login failed, please check the email and password', 2);
                          }
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    }}
                  >
                    <p style={{ fontFamily: 'Lexend', color: 'white' }}>Login</p>
                  </button>
                </>
              )}
            </div>
          </StyledModal>
        </StyledRoot>
      ) : isWidget ? (
        <WidgetEntrancePage
          {...sharedComponentProps}
          isHideDigitalHuman={isHideDigitalHuman}
          customAuthToken={customAuthToken}
          sessionStartTime={sessionStartTime}
          isFullScreenChatbotOnMobile={isFullScreenChatbotOnMobile}
        />
      ) : null}
    </DigitalHumanPreviewProvider>
  );
}
