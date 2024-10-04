import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
// import ReactHlsPlayer from 'react-hls-player';
import styled from 'styled-components';
import cx from 'classnames';
import { get, noop } from 'lodash';
import ReactHlsPlayer from 'react-hls-player';
import { message } from 'antd';
import axios from 'axios';

// components
import Subtitle from './Subtitle';
import Transparent from './Transparent';
import Canvas from './Canvas';

// hooks
import { useMount } from 'ahooks';
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';

// utils
import getBrowserType from '@/chatbot-packages/utils/getBrowserType';

// styles
import { SelectOutlined, SettingOutlined } from '@ant-design/icons';
import SkipIcon from '@chatbot-test/public/test/assets/skip.svg';
import { VolumeX, Volume2 } from 'lucide-react';

const StyledDigitalHumanPreview = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-height: 100%;
  overflow: hidden;
  background-position: center center;
  background-size: cover;

  &.hide {
    display: none;
  }

  > video {
    max-height: 100%;
  }

  > button {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: lightblue;
    font-size: 42px;
    color: #fff;
    background-image: linear-gradient(103deg, #7399fb 7%, #8db5e6 69%);
  }

  .presenter-icon-button-wrap {
    position: absolute;
    bottom: 6px;
    z-index: 5;
    cursor: pointer;

    svg {
      width: 16px;
      height: 16px;
    }

    &.open-config-dialog {
      left: 12px;
    }

    &.open-in-new-tab {
      right: 12px;
    }
  }
  .skip-button,
  .mute-button {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 8px;
    right: 20px;
    padding: 2px 2px 2px 8px;
    background-color: black;
    color: white;
    font-family: UniversLT67Bold;
    opacity: 0.7;
    border-radius: 6px;
    z-index: 6;
    cursor: pointer;
    p {
      color: white;
      font-size: 12px;
      opacity: 0.7;
    }
    svg {
      opacity: 0.7;
    }

    &.mute-button {
      padding: 2px 6px;
      bottom: 2px;
      background-color: lightgray;

      svg {
        color: gray;
        opacity: 1;
      }
    }
  }
`;

const DigitalHumanPreviewContext = createContext();

export const useDigitalHumanPreview = () => useContext(DigitalHumanPreviewContext);

export const DigitalHumanPreviewProvider = ({
  children,

  src = '',
  currentPlayingAction = '',
  subtitleContent = '',
  subtitleDuration = 0,
  eventActiveConfig = {},

  isDesktop = false,
  isShowingSubtitle = false,
  isShowPresenterPreviewState = true,
  isShowSkipButton = false,
  isShowMuteButton = false,
  isPresenterViewOnly = false,
  isGotPlaybackMsg = false,
  isWaitForResponseBoomerangMode = true,
  isNeedSkipVideo = false,
  isEventActive = false,
  isInitComplete = false,

  onOpenInTheNewTabClick = noop,
  onOpenConfigModalClick = noop,
  setUpdateTransparentStandingVideoCanvasState = noop,
  setIsNeedSkipVideo = noop,
  setIsGotPlaybackMsg = noop,
  setIsVideoPlaying = noop,
  socketEmitPlayingState = noop,
  setIsPlayedOneVideo = noop,
  setOnEnableAudioInteractiveClick = noop,
  ...props
}) => {
  const videoRef = useRef(null);
  const videoStandingRef = useRef(null);
  const videoCutInRef = useRef(null);

  const [srcState, setSrcState] = useState('');
  // const [isStartClicked, setIsStartClicked] = useState(false);
  const [videoSrcState, setVideoSrcState] = useState('');
  const [videoCutInState, setVideoCutInState] = useState('');
  const [isVideoReadyToPlay, setIsVideoReadyToPlay] = useState(false);
  const [isVideoCutInReadyToPlay, setIsVideoCutInReadyToPlay] = useState(false);
  const [isVideoRefPlaying, setIsVideoRefPlaying] = useState(false);
  const [isVideoCutInRefPlaying, setIsVideoCutInRefPlaying] = useState(false);
  const [isClearingVideoSrc, setIsClearingVideoSrc] = useState(false);
  // subtitle
  const [videoSubtitle, setVideoSubtitle] = useState('');
  // const [currentShowingSubtitle, setCurrentShowingSubtitle] = useState('');
  const [isResetSpring, setIsResetSpring] = useState(false);
  const browserType = getBrowserType();
  const [isInitMuted, setIsInitMuted] = useState(
    browserType === 'Safari' || browserType === 'IPhone',
  );
  const isNeedAudioContext = browserType === 'IPhone';
  const [isPlayedFirstVideo, setIsPlayedFirstVideo] = useState(false);
  const [safariDelayStandingOpacity, setSafariDelayStandingOpacity] = useState(1);
  const [windowInnerHeight, setWindowInnerHeight] = useState(0);
  const [isMute, setIsMute] = useState(false);

  // For alpha
  const [srcWidth, setSrcWidth] = useState(0);
  const [srcHeight, setSrcHeight] = useState(0);
  const [cutInWidth, setCutInWidth] = useState(0);
  const [cutInHeight, setCutInHeight] = useState(0);
  const [isDuringTransitionBuffer, setIsDuringTransitionBuffer] = useState(false);

  const { cachedProfileConfig, cachedFrontendProfileJson } = useProfileConfig();

  // Audio Context
  const audioContext = useMemo(
    () => (typeof AudioContext !== 'undefined' ? new AudioContext() : null),
    [],
  );
  const setAudioElmentSrc = useCallback(
    (src = '') => {
      if (isNeedAudioContext) {
        const aud = document.getElementById('audio-elm');
        if (aud) {
          aud.src = src;
        }
      }
    },
    [isNeedAudioContext],
  );

  const eventActiveVideoBoomerangUrl = useMemo(
    () => get(eventActiveConfig, 'videoBoomerangUrl', ''),
    [eventActiveConfig],
  );

  const {
    videoBoomerangUrl,
    waitingMesssagesArray,
    isNeedAlphaChannel,
    videoBackgroundImage,
    isShowBG,
  } = useMemo(() => {
    return {
      videoBoomerangUrl: isEventActive
        ? eventActiveVideoBoomerangUrl
        : get(cachedFrontendProfileJson, ['data', 'basicConfig', 'videoBoomerangUrl']) ||
          'https://media-cdn-resources.pantheonlab.ai/media/chatbot-static/initial/vanya_fullbody_2.mp4' ||
          'https://media-cdn-resources.pantheonlab.ai/media/chatbot-static/initial/new_vanya_chatbot_boomerang.mp4',
      waitingMesssagesArray: get(cachedProfileConfig, ['data', 'waitingMessages']) || [],
      isNeedAlphaChannel: get(
        cachedFrontendProfileJson,
        ['data', 'basicConfig', 'isNeedAlphaChannel'],
        true,
      ),
      videoBackgroundImage: get(
        cachedFrontendProfileJson,
        ['data', 'basicConfig', 'backgroundImageUrl'],
        '',
      ),
      isShowBG: get(
        cachedFrontendProfileJson,
        ['data', 'basicConfig', 'isInsideBackground'],
        false,
      ),
    };
  }, [cachedFrontendProfileJson, cachedProfileConfig, isEventActive, eventActiveVideoBoomerangUrl]);

  const actionTransform = useMemo(() => {
    switch (currentPlayingAction) {
      case 'default':
        return 'none';
      // case 'hand_waving':
      //   return 'scale(0.92,0.95) translate(-13px, 10px)';
      // // return 'none';
      // case 'present_to_viewer_left':
      //   return 'scale(0.92,0.95) translate(-19px, 10px)';
      // // return 'none';
      // case 'point_to_you':
      //   return 'scale(0.92,0.95) translate(-20px, 5px)';
      // // return 'none';
      default:
        return 'none';
    }
    // return transform;
  }, [currentPlayingAction]);

  // Hide subtitle when playing waiting msg
  const isPlayingWaitingMsg = useMemo(() => {
    const isVideoRefPlayingWaitingMsg =
      waitingMesssagesArray.includes(videoSrcState) && isVideoRefPlaying;
    const isVideoCutInPlayingWaitingMsg =
      waitingMesssagesArray.includes(videoCutInState) && isVideoCutInRefPlaying;
    return isVideoRefPlayingWaitingMsg || isVideoCutInPlayingWaitingMsg;
  }, [
    isVideoCutInRefPlaying,
    isVideoRefPlaying,
    videoCutInState,
    videoSrcState,
    waitingMesssagesArray,
  ]);

  const playAudioContext = useCallback(() => {
    if (isNeedAudioContext) {
      const audioElm = document.getElementById('audio-elm');
      if (audioElm?.src) {
        audioElm.play();
        audioContext.resume();
      } else {
        message.error('Sound Playing Error, Please try again or refrash the page.');
      }
    }
  }, [audioContext, isNeedAudioContext]);

  // Handle play the video when the boomerang finish a loop
  // Every loop video become 0s, it will check which video is ready to play, pause and clear other one video
  // This functions will check which video is ready to play, and play that video. At the same time, pause the
  // playing video and clear the status of that video element
  const playResponseVideo = useCallback(() => {
    if (isVideoCutInReadyToPlay && videoCutInState !== '') {
      if (!(isVideoRefPlaying && waitingMesssagesArray.includes(videoSrcState))) {
        videoStandingRef.current.currentTime = 8.8;
        // Timeout to ensure the standing video will back to sync second with coming video before show that video to prevent shadow jump
        // currentTime = 9 for sync the standingvideo with comeing video as m3u8 will have time differet issue after lipsync
        setTimeout(() => {
          videoCutInRef.current.currentTime = 0;

          // setTimeout(() => {
          // videoCutInRef.current.play().then(() => {
          //   // videoStandingRef.current.currentTime = videoCutInRef.current.currentTime + 0.1;
          //   // videoCutInRef.current.currentTime = Math.max(
          //   //   videoStandingRef.current.currentTime - 0.1,
          //   //   0,
          //   // );
          //   videoStandingRef.current.currentTime = 0;
          //   videoCutInRef.current.currentTime = 0;
          // });
          // videoStandingRef.current.play().then(() => {
          //   videoStandingRef.current.currentTime = videoCutInRef.current.currentTime;
          // });
          // }, 100);

          playAudioContext();
          setIsVideoCutInReadyToPlay(false);
          setIsVideoPlaying(true);
          setIsVideoCutInRefPlaying(true);
          videoRef.current.pause();
          setVideoSrcState('');
          if (!waitingMesssagesArray.includes(videoCutInState)) {
            setIsPlayedOneVideo(true);
          }
          setIsVideoRefPlaying(false);
          if (isPresenterViewOnly) {
            socketEmitPlayingState('oneVideoPlayed');
            socketEmitPlayingState('playingVideoStart');
          }
          setVideoSubtitle(subtitleContent);
        }, 170);
      }
      return;
    }
    if (isVideoReadyToPlay && videoSrcState !== '') {
      if (!(isVideoCutInRefPlaying && waitingMesssagesArray.includes(videoCutInRef))) {
        // videoRef.current.currentTime = 0;
        // videoStandingRef.current.currentTime = 0;
        // videoRef.current.play().then(() => {
        //   // videoStandingRef.current.currentTime = videoRef.current.currentTime + 0.1;
        //   // videoRef.current.currentTime = Math.max(videoStandingRef.current.currentTime - 0.1, 0);
        //   videoStandingRef.current.currentTime = 0;
        //   videoRef.current.currentTime = 0;
        // });
        // videoStandingRef.current.play().then(() => {
        //   videoStandingRef.current.currentTime = videoRef.current.currentTime;
        // });

        videoStandingRef.current.currentTime = 8.8;
        setTimeout(() => {
          videoRef.current.currentTime = 0;
          playAudioContext();
          setIsVideoReadyToPlay(false);
          setIsVideoPlaying(true);
          setIsVideoRefPlaying(true);
          videoCutInRef.current.pause();
          setVideoCutInState('');
          setIsVideoCutInRefPlaying(false);
          if (!waitingMesssagesArray.includes(videoSrcState)) {
            setIsPlayedOneVideo(true);
          }
          if (isPresenterViewOnly) {
            socketEmitPlayingState('oneVideoPlayed');
            socketEmitPlayingState('playingVideoStart');
          }
          setVideoSubtitle(subtitleContent);
        }, 170);
      }
    }
  }, [
    isPresenterViewOnly,
    isVideoCutInReadyToPlay,
    isVideoCutInRefPlaying,
    isVideoReadyToPlay,
    isVideoRefPlaying,
    playAudioContext,
    setIsPlayedOneVideo,
    setIsVideoPlaying,
    socketEmitPlayingState,
    subtitleContent,
    videoCutInState,
    videoSrcState,
    waitingMesssagesArray,
  ]);

  // Handle Skip the Playing Video
  const skipPlayingVideo = useCallback(() => {
    const stop = () => {
      if (isPresenterViewOnly) {
        socketEmitPlayingState('playingVideoEnd');
      }

      setIsPlayedOneVideo(false);
      setVideoSubtitle('');
    };

    if (isVideoRefPlaying) {
      videoRef.current.pause();
      setIsClearingVideoSrc(true);
      setTimeout(() => {
        setIsClearingVideoSrc(false);
      }, 10);
      setVideoSrcState('');
      if (videoCutInState === '') {
        setIsVideoPlaying(false);
      }
      setIsVideoRefPlaying(false);
      stop();
    }

    if (isVideoCutInRefPlaying) {
      videoCutInRef.current.pause();
      setVideoCutInState('');
      if (videoSrcState === '') {
        setIsVideoPlaying(false);
      }
      setIsVideoCutInRefPlaying(false);
      stop();
    }

    const aud = document.getElementById('audio-elm');
    setSafariDelayStandingOpacity(1);
    if (aud) {
      aud.pause();
    }
  }, [
    isVideoRefPlaying,
    isPresenterViewOnly,
    isVideoCutInRefPlaying,
    setIsPlayedOneVideo,
    setIsVideoPlaying,
    socketEmitPlayingState,
    videoCutInState,
    videoSrcState,
  ]);

  useEffect(() => {
    // setSrcState(src === '' ? '' : 'http://localhost:3500/abcde/stream.m3u8');
    if (src || src === '') {
      const retryPlay = async (time = 0) => {
        if (time > 50) {
          return;
        } else {
          try {
            await axios.request({ url: src, method: 'get' });
            setSrcState(src);
          } catch {
            setTimeout(() => {
              retryPlay(time + 1);
            }, 200);
          }
        }
      };
      retryPlay();
    }
  }, [src]);

  useEffect(() => {
    if (isGotPlaybackMsg) {
      setIsGotPlaybackMsg(false);
      setIsResetSpring(true);
      if (isVideoRefPlaying || isClearingVideoSrc) {
        setVideoCutInState(src);
        setIsVideoCutInReadyToPlay(false);
        setAudioElmentSrc(src);
      } else {
        setVideoSrcState(src);
        setIsVideoReadyToPlay(false);
        setAudioElmentSrc(src);
      }
    }
  }, [
    isClearingVideoSrc,
    isGotPlaybackMsg,
    isVideoRefPlaying,
    setAudioElmentSrc,
    setIsGotPlaybackMsg,
    src,
  ]);

  // Handle the src to which video element, if has video playing, set the not playing one src to the coming src
  // If no video playing, just set the first videoElement(videoSrcRef) to play the video
  useEffect(() => {
    if (srcState !== '') {
      setIsResetSpring(true);
      if (isVideoRefPlaying || isClearingVideoSrc) {
        setVideoCutInState(srcState);
        setSafariDelayStandingOpacity(1);
        setIsVideoCutInReadyToPlay(false);
        setAudioElmentSrc(srcState);
        setSrcState('');
      } else {
        setSafariDelayStandingOpacity(1);
        setVideoSrcState(srcState);
        setIsVideoReadyToPlay(false);
        setAudioElmentSrc(srcState);
        setSrcState('');
      }
    }
  }, [isClearingVideoSrc, isVideoRefPlaying, setAudioElmentSrc, srcState]);

  // On normal boomerang mode (Not wait the default looping)
  // We will not cut the waiting message even the video is ready to play
  // When we got videoElement1 or videoElement2 is ready to play,
  // Wait until playingWaitingMsg is false and play the video.
  useEffect(() => {
    if (!isPlayingWaitingMsg && !isWaitForResponseBoomerangMode) {
      if (
        isVideoReadyToPlay ||
        isVideoCutInReadyToPlay
        // &&
        // !isVideoRefPlaying &&
        // !isVideoCutInRefPlaying
      ) {
        playResponseVideo();
      }
    }
  }, [
    isPlayingWaitingMsg,
    isVideoCutInReadyToPlay,
    isVideoCutInRefPlaying,
    isVideoReadyToPlay,
    isVideoRefPlaying,
    isWaitForResponseBoomerangMode,
    playResponseVideo,
  ]);

  // We need to rerender the subtitle element when change the video, so use timeout to let the
  // subtitle disappera 200ms.
  useEffect(() => {
    if (isResetSpring) {
      setTimeout(() => {
        setIsResetSpring(false);
      }, 200);
    }
  }, [isResetSpring]);

  // Here is for the safari and iphone environment, set the unmute function to a useState, run that function
  // On the first click on the UI.
  useEffect(() => {
    if (isInitMuted) {
      setOnEnableAudioInteractiveClick((prev) => {
        if (!prev || prev === noop) {
          return () => {
            if (isInitMuted) {
              setIsInitMuted(false);
              // AudioContext
              audioContext.resume();
              const aud = document.getElementById('audio-elm');
              if (aud) {
                aud.play();
                setTimeout(() => {
                  aud.pause();
                }, 1);
              }
              if (!isNeedAudioContext) {
                if (videoRef?.current) {
                  videoRef.current.muted = false;
                }
                if (videoCutInRef?.current) {
                  videoCutInRef.current.muted = false;
                }
              }
            }
          };
        }
        return prev;
      });
    } else {
      setOnEnableAudioInteractiveClick(noop);
    }
  }, [
    audioContext,
    isInitMuted,
    isNeedAudioContext,
    isVideoCutInRefPlaying,
    isVideoRefPlaying,
    setOnEnableAudioInteractiveClick,
  ]);

  useEffect(() => {
    if (!isPlayedFirstVideo) {
      if (isVideoRefPlaying || isVideoCutInRefPlaying) {
        setTimeout(() => {
          setIsPlayedFirstVideo(true);
        }, 1000);
      }
    }
  }, [isPlayedFirstVideo, isVideoCutInRefPlaying, isVideoRefPlaying]);

  useEffect(() => {
    if (isNeedSkipVideo) {
      skipPlayingVideo();
      setIsNeedSkipVideo(false);
    }
  }, [isNeedSkipVideo, setIsNeedSkipVideo, skipPlayingVideo]);

  // AudioContext, use for safari, IOS
  useMount(() => {
    if (isNeedAudioContext) {
      const audioElement = document.getElementById('audio-context-audio-elm-src');
      audioElement.innerHTML = `<audio id='audio-elm'></audio>`;
      const aud = document.getElementById('audio-elm');
      const track = audioContext.createMediaElementSource(aud);
      const audioAnalysis = audioContext.createAnalyser();
      audioAnalysis.smoothingTimeConstant = 0.3;
      audioAnalysis.fftSize = 512;
      track.connect(audioAnalysis);
      audioAnalysis.connect(audioContext.destination);
    }
    setWindowInnerHeight(window.innerHeight);
    window.onresize = () => {
      setWindowInnerHeight(window.innerHeight);
    };
  });

  const VideoSrcHlsElementMemo = useMemo(() => {
    if (videoSrcState.includes('.mp4')) {
      return (
        <video
          ref={videoRef}
          crossOrigin="anonymous"
          style={{
            opacity: isNeedAlphaChannel ? 0 : isVideoRefPlaying && videoSrcState ? 1 : 0,

            zIndex: 2,

            position: 'absolute',
          }}
          src={videoSrcState}
          onLoadedMetadata={(data) => {
            if (browserType === 'Firefox') {
              setSrcWidth(data?.target?.offsetWidth || 0);

              setSrcHeight((data?.target?.offsetHeight || 0) * 2);
            } else {
              setSrcWidth(data?.target?.offsetWidth || 0);

              setSrcHeight(data?.target?.offsetHeight || 0);
            }
          }}
          autoPlay={true}
          preload="auto"
          // preload="metadata"

          onEnded={() => {
            setVideoSrcState('');

            setIsVideoPlaying(false);

            setIsVideoRefPlaying(false);

            setIsPlayedOneVideo(false);

            setVideoSubtitle('');

            // setSafariDelayStandingOpacity(1);
          }}
          onPlay={(data) => {
            if (!isVideoRefPlaying && videoSrcState) {
              setIsVideoReadyToPlay(true);

              setIsDuringTransitionBuffer(true);

              // setTimeout(() => {

              //   setIsDuringTransitionBuffer(false);

              // }, 100); // time

              videoRef.current.currentTime = 0;
            }

            if (browserType === 'Firefox') {
              setTimeout(() => {
                setSrcWidth(data?.target?.offsetWidth || 0);

                setSrcHeight((data?.target?.offsetHeight || 0) * 2);
              }, 800);
            } else {
              setSrcWidth(data?.target?.offsetWidth || 0);

              setSrcHeight(data?.target?.offsetHeight || 0);
            }
          }}
          onPlaying={() => {
            setTimeout(() => {
              setIsDuringTransitionBuffer(false);
            }, 500);
          }}
        />
      );
    }

    return (
      <ReactHlsPlayer
        playerRef={videoRef}
        // crossOrigin="anonymous"
        style={{
          opacity: isNeedAlphaChannel ? 0 : isVideoRefPlaying && videoSrcState ? 1 : 0,
          zIndex: 2,
          position: 'absolute',
        }}
        src={videoSrcState}
        onLoadedMetadata={(data) => {
          if (browserType === 'Firefox') {
            setSrcWidth(data?.target?.offsetWidth || 0);
            setSrcHeight((data?.target?.offsetHeight || 0) * 2);
          } else {
            setSrcWidth(data?.target?.offsetWidth || 0);
            setSrcHeight(data?.target?.offsetHeight || 0);
          }
        }}
        autoPlay={true}
        preload="auto"
        // preload="metadata"
        onEnded={() => {
          setVideoSrcState('');
          setIsVideoPlaying(false);
          setIsVideoRefPlaying(false);
          setIsPlayedOneVideo(false);
          setVideoSubtitle('');
          // setSafariDelayStandingOpacity(1);
        }}
        onPlay={(data) => {
          if (!isVideoRefPlaying && videoSrcState) {
            setIsVideoReadyToPlay(true);
            setIsDuringTransitionBuffer(true);
            // setTimeout(() => {
            //   setIsDuringTransitionBuffer(false);
            // }, 650); // time
            videoRef.current.currentTime = 0;
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
          if (browserType === 'Firefox') {
            setTimeout(() => {
              setSrcWidth(data?.target?.offsetWidth || 0);
              setSrcHeight((data?.target?.offsetHeight || 0) * 2);
            }, 800);
          } else {
            setSrcWidth(data?.target?.offsetWidth || 0);
            setSrcHeight(data?.target?.offsetHeight || 0);
          }
        }}
        onPlaying={() => {
          setIsDuringTransitionBuffer(false);
        }}
        hlsConfig={{
          startPosition: 0,
        }}
      />
    );
  }, [
    browserType,
    isNeedAlphaChannel,
    isVideoRefPlaying,
    setIsPlayedOneVideo,
    setIsVideoPlaying,
    videoSrcState,
  ]);

  const VideoCutInHlsElementMemo = useMemo(() => {
    return (
      <ReactHlsPlayer
        // crossOrigin="anonymous"
        style={{
          opacity: isNeedAlphaChannel ? 0 : isVideoCutInRefPlaying && videoCutInState ? 1 : 0,
          zIndex: 3,
          position: 'absolute',
        }}
        playerRef={videoCutInRef}
        src={videoCutInState}
        onLoadedMetadata={(data) => {
          if (browserType === 'Firefox') {
            setCutInWidth(data?.target?.offsetWidth || 0);
            setCutInHeight((data?.target?.offsetHeight || 0) * 2);
          } else {
            setCutInWidth(data?.target?.offsetWidth || 0);
            setCutInHeight(data?.target?.offsetHeight || 0);
          }
        }}
        autoPlay={true}
        preload="auto"
        // preload="metadata"
        onEnded={() => {
          setVideoCutInState('');
          setIsVideoPlaying(false);
          setIsVideoCutInRefPlaying(false);
          setIsPlayedOneVideo(false);
          setVideoSubtitle('');
          setSafariDelayStandingOpacity(1);
        }}
        onPlay={(data) => {
          if (!isVideoCutInRefPlaying && videoCutInState) {
            videoCutInRef.current.currentTime = 0;
            videoCutInRef.current.pause();
            videoCutInRef.current.currentTime = 0;
            setIsDuringTransitionBuffer(true);
            // setTimeout(() => {
            //   setIsDuringTransitionBuffer(false);
            // }, 650); // time
            setIsVideoCutInReadyToPlay(true);
          }
          setCutInWidth(data?.target?.offsetWidth || 0);
          setCutInHeight(data?.target?.offsetHeight || 0);
        }}
        onPlaying={() => {
          setIsDuringTransitionBuffer(false);
        }}
        hlsConfig={{
          startPosition: 0,
        }}
      />
    );
  }, [
    browserType,
    isNeedAlphaChannel,
    isVideoCutInRefPlaying,
    setIsPlayedOneVideo,
    setIsVideoPlaying,
    videoCutInState,
  ]);

  const genSkipButton = useCallback(
    (skipButtonConfig = {}) => {
      return (
        <div
          className="skip-button qa-skip-button"
          onClick={skipPlayingVideo}
          disabled={(isVideoRefPlaying || isVideoCutInRefPlaying) && !isPlayingWaitingMsg}
          style={{ ...skipButtonConfig }}
        >
          <p>Skip</p>
          <SkipIcon />
        </div>
      );
    },
    [skipPlayingVideo, isPlayingWaitingMsg, isVideoCutInRefPlaying, isVideoRefPlaying],
  );

  const genMuteButton = useCallback(
    (muteButtonConfig = {}) => {
      return (
        <div
          className="mute-button qa-mute-button"
          onClick={() => {
            if (videoRef?.current?.muted !== undefined) {
              videoRef.current.muted = !videoRef.current.muted;
            }
            if (videoCutInRef?.current?.muted !== undefined) {
              videoCutInRef.current.muted = !videoCutInRef.current.muted;
            }

            setIsMute(!isMute);
          }}
          disabled={!isPlayingWaitingMsg}
          style={{ ...muteButtonConfig }}
        >
          {isMute ? <VolumeX /> : <Volume2 />}
        </div>
      );
    },
    [isMute, isPlayingWaitingMsg],
  );

  // Render the element Memo
  const genDigitalHumanPreview = useCallback(
    ({
      modelPositionConfig = {},
      subtitleConfig = {},
      subtitleStyleConfig = {},
      skipButtonConfig = {},
      muteButtonConfig = {},
      isShowPresenterIconButtonSet = false,

      isChatbotWidget = false,
      isMobile = false,
      // isEnterDisabilityMode = false,
    }) => {
      return (
        <StyledDigitalHumanPreview
          className={cx('digital-human-preview-section qa-dh-wrap-parent', {
            hide: !isPresenterViewOnly && !isShowPresenterPreviewState,
          })}
          style={{
            position: 'relative',
            flex: 1,
            marginRight: '0px',
            borderRadius: isDesktop ? '0px' : '16px',
            justifyContent: isDesktop && !isNeedAlphaChannel ? 'flex-start' : 'center',
          }}
        >
          {videoBackgroundImage !== '' && !isChatbotWidget && isShowBG && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={videoBackgroundImage}
              alt="chatbot-desktop-bg"
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: '1',
                objectFit: 'cover',
              }}
            />
          )}
          <div
            className={cx('qa-dh-wrap')}
            style={
              isNeedAlphaChannel
                ? {
                    display: 'flex',
                    marginRight: '0px',
                    borderRadius: isDesktop ? '0px' : '16px',
                    justifyContent: 'center',
                    height: '100%',
                    // width: '100%',
                    position: 'absolute',
                    zIndex: 1,
                    ...modelPositionConfig,
                    // transformOrigin: 'left top',
                  }
                : {
                    display: 'flex',
                    marginRight: '0px',
                    borderRadius: isDesktop ? '0px' : '16px',
                    justifyContent: isDesktop ? 'flex-start' : 'center',
                    height: `${windowInnerHeight}px`,
                    // width: '100%',
                    position: 'absolute',
                    zIndex: 1,
                    transform: `scale(${windowInnerHeight / 1080})`,
                    ...modelPositionConfig,
                    // transformOrigin: 'left top',
                  }
            }
          >
            {isNeedAlphaChannel ? (
              <Transparent
                muted={true}
                autoPlay={true}
                playsInline={true}
                playerRef={videoStandingRef}
                src={videoBoomerangUrl}
                onEnded={() => {
                  videoStandingRef.current.play();
                  playResponseVideo();
                }}
                style={{
                  zIndex: 1,
                  position: 'absolute',
                  opacity:
                    browserType === 'Safari' || browserType === 'IPhone'
                      ? safariDelayStandingOpacity
                      : (isVideoRefPlaying || isVideoCutInRefPlaying) &&
                          isNeedAlphaChannel &&
                          !isDuringTransitionBuffer
                        ? 0
                        : 1,
                  transitionDelay: !isPlayedFirstVideo ? '50ms' : 'unset',
                  // transitionDelay: isVideoCutInRefPlaying && isVideoRefPlaying ? '100ms' : 'unset',
                  filter: 'drop-shadow(0px 0px 10px rgba(50, 50, 50, 0.7))',
                }}
                isPlaying={true}
                isM3U8={false}
                isNeedAlphaChannel={isNeedAlphaChannel}
                isDesktop={isDesktop}
                isBoomerangVideo={true}
                setUpdateTransparentStandingVideoCanvasState={
                  setUpdateTransparentStandingVideoCanvasState
                }
              />
            ) : (
              <video
                ref={videoStandingRef}
                src={videoBoomerangUrl}
                autoPlay
                muted
                playsInline
                style={{
                  zIndex: 1,
                  position: 'absolute',
                  opacity: isMobile ? 0 : 1,
                  // width: '100%',
                  // height: '100vh',
                }}
                onEnded={() => {
                  videoStandingRef.current.play().then(() => {
                    videoStandingRef.current.currentTime =
                      videoStandingRef.current.currentTime + 0.1;
                  });

                  playResponseVideo();
                }}
              />
            )}
            <Canvas
              hideBoomerang={() => {
                setTimeout(() => {
                  setSafariDelayStandingOpacity(0);
                }, 1300);
              }}
              // autoPlay={browserType === 'IPhone'}
              playerRef={videoRef}
              isPlaying={isVideoRefPlaying}
              style={{
                opacity: isVideoRefPlaying && videoSrcState ? 1 : 0,
                zIndex: 2,
                position: 'absolute',
                transform: actionTransform || 'none',
                filter: isDuringTransitionBuffer
                  ? 'none'
                  : 'drop-shadow(0px 0px 10px rgba(50, 50, 50, 0.7))',
              }}
              isNeedAlphaChannel={isNeedAlphaChannel}
              height={isVideoRefPlaying && videoSrcState ? srcHeight : 0}
              width={isVideoRefPlaying && videoSrcState ? srcWidth : 0}
            />
            {VideoSrcHlsElementMemo}
            <Canvas
              hideBoomerang={() => {
                setTimeout(() => {
                  setSafariDelayStandingOpacity(0);
                }, 1300);
              }}
              // autoPlay={browserType === 'IPhone'}
              playerRef={videoCutInRef}
              isPlaying={isVideoCutInRefPlaying}
              style={{
                opacity: isVideoCutInRefPlaying && videoCutInState ? 1 : 0,
                zIndex: 3,
                position: 'absolute',
                transform: actionTransform || 'none',
                filter: isDuringTransitionBuffer
                  ? 'none'
                  : 'drop-shadow(0px 0px 10px rgba(50, 50, 50, 0.7))',
              }}
              isNeedAlphaChannel={true}
              height={isVideoCutInRefPlaying && videoCutInState ? cutInHeight : 0}
              width={isVideoCutInRefPlaying && videoCutInState ? cutInWidth : 0}
            />
            {VideoCutInHlsElementMemo}
          </div>

          {isShowPresenterIconButtonSet && (
            <>
              <div
                className="presenter-icon-button-wrap open-config-dialog"
                onClick={onOpenConfigModalClick}
              >
                <SettingOutlined
                  style={{
                    color: '#69c0ff',
                  }}
                />
              </div>

              <div
                className="presenter-icon-button-wrap open-in-new-tab"
                onClick={onOpenInTheNewTabClick}
              >
                <SelectOutlined
                  style={{
                    color: 'dimgray',
                  }}
                />
              </div>
            </>
          )}

          {videoSubtitle !== '' && isShowingSubtitle && !isPlayingWaitingMsg && (
            <div
              className="qa-dh-wrap"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginRight: isDesktop ? '38%' : '0px',
              }}
            >
              <div
                id="CHATBOT_DESKTOP_SUBTITLE_WRAP"
                className="chatbot-desktop-subtitle-wrap"
                style={{
                  position: 'absolute',
                  bottom: '100px',
                  width: '35%',
                  // height: '10%',
                  maxHeight: '10%',
                  minWidth: '400px',
                  zIndex: '4',
                  display: 'flex',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  overflow: 'hidden',
                  backgroundColor: 'black',
                  opacity: '0.7',
                  ...subtitleStyleConfig,
                }}
              >
                {!isResetSpring && (
                  <Subtitle
                    isVideoRefPlaying={isVideoRefPlaying}
                    videoRef={videoRef}
                    isVideoCutInRefPlaying={isVideoCutInRefPlaying}
                    videoCutInRef={videoCutInRef}
                    subtitleDuration={subtitleDuration}
                    fontSize={get(subtitleConfig, 'fontSize', 20)}
                    fontColor={get(subtitleConfig, 'fontColor', 'white')}
                    videoSubtitle={videoSubtitle}
                    currentPlayingTime={
                      isVideoRefPlaying
                        ? videoRef?.current?.currentTime
                        : isVideoCutInRefPlaying
                          ? videoCutInRef.current?.currentTime
                          : 0
                    }
                    isShowingSubtitle={isShowingSubtitle}
                  />
                )}
              </div>
            </div>
          )}

          {isShowSkipButton && genSkipButton(skipButtonConfig)}

          {isShowMuteButton && genMuteButton(muteButtonConfig)}

          <div id="audio-context-audio-elm-src" />
        </StyledDigitalHumanPreview>
      );
    },
    [
      isPresenterViewOnly,
      isNeedAlphaChannel,
      videoBackgroundImage,
      isShowBG,
      windowInnerHeight,
      browserType,
      safariDelayStandingOpacity,
      isVideoRefPlaying,
      isVideoCutInRefPlaying,
      isDuringTransitionBuffer,
      isPlayedFirstVideo,
      videoSrcState,
      actionTransform,
      srcHeight,
      srcWidth,
      VideoSrcHlsElementMemo,
      videoCutInState,
      cutInHeight,
      cutInWidth,
      VideoCutInHlsElementMemo,
      videoSubtitle,
      isPlayingWaitingMsg,
      isResetSpring,
      playResponseVideo,
      isShowPresenterPreviewState,
      isShowSkipButton,
      isShowingSubtitle,
      isDesktop,
      onOpenConfigModalClick,
      onOpenInTheNewTabClick,
      setUpdateTransparentStandingVideoCanvasState,
      subtitleDuration,
      videoBoomerangUrl,
      isShowMuteButton,
      genSkipButton,
      genMuteButton,
    ],
  );

  const value = {
    videoRef,
    videoStandingRef,

    srcState,
    videoSrcState,
    eventActiveConfig,

    isVideoReadyToPlay,
    isVideoRefPlaying,
    isEventActive,
    isInitComplete,

    playResponseVideo,
    skipPlayingVideo,

    genDigitalHumanPreview,
    genSkipButton,
    genMuteButton,
    ...props,
  };

  return (
    <DigitalHumanPreviewContext.Provider value={value}>
      {children}
    </DigitalHumanPreviewContext.Provider>
  );
};
