import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
// import ReactHlsPlayer from 'react-hls-player';
import styled from 'styled-components';
import cx from 'classnames';
import { get, noop } from 'lodash';
import ReactHlsPlayer from 'react-hls-player';
// import Image from 'next/image';

// hooks
import { useMount } from 'ahooks';

// component
import Subtitle from './Subtitle';
import Transparent from './Transparent';
import Canvas from './Canvas';

// hooks
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';

// utils
import getBrowserType from '@/chatbot-packages/utils/getBrowserType';

// styles
// import { SelectOutlined, SettingOutlined } from '@ant-design/icons';
import SkipIcon from '@chatbot-test/public/test/assets/skip.svg';
import { message } from 'antd';

const StyledPresenterPreview = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-height: 100%;
  overflow: hidden;
  background-position: center center;
  background-size: cover;
  ${'' /* border-radius: 16px; */}

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
  .skip-button {
    position: absolute;
    z-index: 6;
    background-color: black;
    color: white;
    font-family: Lexend;
    opacity: 0.7;
    bottom: 20px;
    right: 48%;
    display: flex;
    align-items: center;
    padding: 2px;
    cursor: pointer;
    p {
      margin-bottom: 0px;
      opacity: 0.7;
    }
    svg {
      opacity: 0.7;
    }
  }
`;

let initRender = true;

// const CUTTING_LAST_FRAMES_VALUE = 15;
export default function PresenterPreviewHKIA({
  src = '',
  isShowPresenterPreviewState = true,
  isPresenterViewOnly = false,
  isGotPlaybackMsg = false,
  isWaitForResponseBoomerangMode = true,
  isDesktop = false,
  isChatbotWidget = false,
  isShowingSubtitle = false,
  subtitleContent = '',
  subtitleDuration = 0,
  // defaultMessage = '',
  // isShowPresenterIconButtonSet = false,
  modelPositionConfig = {},
  subtitleConfig = {},
  subtitleStyleConfig = {},
  skipButtonConfig = {},
  isMobile = false,
  // isPremiumLounge = false,
  chatHistoryArray = [],
  isConnectionValid = false,
  isLastContentAlreadyDisplay = false,
  setIsGotPlaybackMsg = noop,
  setIsVideoPlaying = noop,
  socketEmitPlayingState = noop,
  // onOpenInTheNewTabClick = noop,
  // onOpenConfigModalClick = noop,
  setIsPlayedOneVideo = noop,
  setOnEnableAudioInteractiveClick = noop,
  setUpdateTransparentStandingVideoCanvasState = noop,
  isNeedSkipVideo = false,
  setIsNeedSkipVideo = noop,
  lastContentMsg = '',
  isLastContentFromHistory = false,
}) {
  const browserType = getBrowserType();
  const isIos = browserType === 'IPhone';
  const isSafari = browserType === 'Safari';

  const isApple = isIos || isSafari;

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
  const [isInitMuted, setIsInitMuted] = useState(isApple);
  const isNeedAudioContext = browserType === 'IPhone';
  const [isPlayedFirstVideo, setIsPlayedFirstVideo] = useState(false);
  const [safariDelayStandingOpacity, setSafariDelayStandingOpacity] = useState(1);
  const [windowInnerHeight, setWindowInnerHeight] = useState(0);

  // For alpha
  const [srcWidth, setSrcWidth] = useState(0);
  const [srcHeight, setSrcHeight] = useState(0);
  const [cutInWidth, setCutInWidth] = useState(0);
  const [cutInHeight, setCutInHeight] = useState(0);
  const [isDuringTransitionBuffer, setIsDuringTransitionBuffer] = useState(false);

  // Audio Context
  const audioContext = useMemo(() => new AudioContext(), []);
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
  useEffect(() => {
    if (isApple && audioContext.state === 'suspended' && !initRender) {
      setIsInitMuted(false);
    }
  }, [audioContext.state, isApple]);
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

  const { cachedProfileConfig } = useProfileConfig();

  const { videoBoomerangUrl, waitingMesssagesArray, isNeedAlphaChannel, videoBackgroundImage } =
    useMemo(() => {
      return {
        videoBoomerangUrl:
          get(cachedProfileConfig, ['data', 'boomerangUrl'], '') ||
          'https://media-cdn-resources.pantheonlab.ai/media/chatbot-static/initial/vanya_fullbody_2.mp4' ||
          'https://media-cdn-resources.pantheonlab.ai/media/chatbot-static/initial/new_vanya_chatbot_boomerang.mp4',
        waitingMesssagesArray: get(cachedProfileConfig, ['data', 'waitingMessages']) || [],
        isNeedAlphaChannel: false,
        videoBackgroundImage: get(cachedProfileConfig, ['data', 'backgroundImageUrl'], ''),
      };
    }, [cachedProfileConfig]);

  useEffect(() => {
    // setSrcState(src === '' ? '' : 'http://localhost:3500/abcde/stream.m3u8');
    setSrcState(src);
    // https://dash.akamaized.net/dash264/TestCases/1b/qualcomm/1/MultiRatePatched.mpd'
    // http://localhost:3500/vp9-mpd-native_alpha/big_buck_bunny_boomerang.mpd
    // setSrcState('https://cdn-public.adsly.ai/remotion/transparent/stack.mp4');
  }, [src]);

  // These functions will check which video is ready to play, and play that video. At the same time, pause the
  // playing video and clear the status of that video element. Two useEffect will check which videoElement could play
  // the video.
  // Handle new videoUrl Logic: If no video playing, set the new videoUrl to videoElement1 and play it.
  // If videoElement1 is playing, set videoUrl to videoElement2 and play it, and set videoElement1 src to empty
  // and opacity to 0
  // If videoElement2 is playing, set videoUrl to videoElement1 and play it, and set videoElement2 src to empty
  // and opacity to 0

  // eg: a video(video1) play on 5s, duration is 15s.
  // Another video(video2) play on 10s, duartion is 15s,
  // One more video(video3) play on 20s, duration is 15s
  // |----------|----------|----------|----------|----------|----------|----------|----------|
  // 0          5          10         15         20         25         30         35
  // Whole videoElement and video: VE=VideoElement
  // |----------|----------|----------|----------|----------|----------|----------|----------|
  //             video1----|
  //                        video2---------------|
  //                                              video3--------------------------|
  //             VE1-------|VE2------------------|VE1-----------------------------|
  //
  //
  // VideoElement1: (videoSrcRef)

  //             ----------|                      --------------------------------| (Time of showing this videoElement)
  //             ^                                ^
  //             video1                           video3
  // |----------|----------|----------|----------|----------|----------|----------|----------|
  // 0          5          10         15         20         25         30         35
  //            ^
  //            Since no video playing on this time,
  //            Set src to the video1
  //             ----------|----------|----------|----------|----------|----------|----------|
  //             ^
  //             Video1 loading finish:
  //             play it and set opacity to 1
  //             Set VideoElement2 opacity to 0 and src to empty
  //                        ----------|----------|----------|----------|----------|----------|
  //                        ^
  //                        Since VideoElement2 play now, the opacity and src of VideoElement1
  //                        will be cleared here
  //                                             |----------|----------|----------|----------|
  //                                             ^
  //                                             Since video3 coming but VideoElement2 is playing
  //                                             Set src to the video 3
  //                                              ----------|----------|----------|----------|
  //                                              ^
  //                                              Video3 Loading finish: play it and set opacity to 1
  //                                              Set VideoElement2 opacity to 0 and src to empty
  //                                                                              |----------|
  //                                                                              ^
  //                                                                              Video3 end, set src to empty
  //                                                                              Set opacity to 0
  //
  // VideoElement2: (videoCutInRef)
  //                        ---------------------|                                 (Time of showing this videoElement)
  //                        ^
  //                        video2
  // |----------|----------|----------|----------|----------|----------|----------|----------|
  // 0          5          10         15         20         25         30         35
  //                       ^
  //                       Since video2 coming but videoElement1 is Still playing,
  //                       Set src to the video2
  //                        ----------|----------|----------|----------|----------|----------|
  //                        ^
  //                        Video2 loading finish: play it and set opacity to 1
  //                        Set VideoElement1 opacity to 0 and src to empty
  //                                              ----------|----------|----------|----------|
  //                                              ^
  //                                              Since VideoElement1 play now, the opacity and
  //                                              src of VideoElement2 will be cleared here
  //
  // Handle the Playback video, if got playback msg, set into the not playing one video to src,
  // If no video playing, just set the first videoElement(videoSrcRef) to play the video
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

  // Handle play the video when the boomerang finish a loop
  // Every loop video become 0s, it will check which video is ready to play, pause and clear other one video
  // This functions will check which video is ready to play, and play that video. At the same time, pause the
  // playing video and clear the status of that video element
  const playResponseVideo = useCallback(() => {
    if (isVideoCutInReadyToPlay && videoCutInState !== '') {
      if (!(isVideoRefPlaying && waitingMesssagesArray.includes(videoSrcState))) {
        // videoCutInRef.current.currentTime = 0;
        // videoStandingRef.current.currentTime = 0;

        // setTimeout(() => {
        videoCutInRef.current.play().then(() => {
          videoStandingRef.current.currentTime = videoCutInRef.current.currentTime + 0.1;
          videoCutInRef.current.currentTime = Math.max(
            videoStandingRef.current.currentTime - 0.1,
            0,
          );
        });
        videoStandingRef.current.play().then(() => {
          videoStandingRef.current.currentTime = videoCutInRef.current.currentTime + 0.1;
        });
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
        if (subtitleContent) {
          setVideoSubtitle(subtitleContent);
        }
      }
      return;
    }
    if (isVideoReadyToPlay && videoSrcState !== '') {
      if (!(isVideoCutInRefPlaying && waitingMesssagesArray.includes(videoCutInRef))) {
        // videoRef.current.currentTime = 0;
        // videoStandingRef.current.currentTime = 0;
        videoRef.current.play().then(() => {
          videoStandingRef.current.currentTime = videoRef.current.currentTime + 0.1;
          videoRef.current.currentTime = Math.max(videoStandingRef.current.currentTime - 0.1, 0);
        });
        videoStandingRef.current.play().then(() => {
          videoStandingRef.current.currentTime = videoRef.current.currentTime + 0.1;
        });

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
        if (subtitleContent) {
          setVideoSubtitle(subtitleContent);
        }
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

  // Handle subtitle
  // const getTimeBySecondFromTime = (time = '') => {
  //   if (time === '') {
  //     return null;
  //   }
  //   const timeDataArray = time.split(':');
  //   const hourString = timeDataArray[0];
  //   const hour = toInteger(hourString);
  //   const minString = timeDataArray[1];
  //   const min = toInteger(minString);
  //   const secondData = timeDataArray[2].split(',');
  //   const second = toInteger(secondData[0]) + toInteger(secondData[1]) / 1000;
  //   return hour * 3600 + min * 60 + second;
  // };

  // const subtitleDataArray = useMemo(() => {
  //   const subtitlePureData = DEMO_SUBTITLE_DATA;
  //   if (subtitlePureData === '') {
  //     return [];
  //   }
  //   const subtitlePureArray = subtitlePureData.split('\n\n').filter((v) => v);
  //   const subtitleObjectArray = subtitlePureArray.map((data) => {
  //     const dataArray = data.split('\n');
  //     const timestampData = dataArray[1];
  //     const timestampDataArray = timestampData.split('-->');
  //     return {
  //       order: toInteger(dataArray[0]),
  //       startTime: getTimeBySecondFromTime(timestampDataArray[0]) || 0,
  //       endTime: getTimeBySecondFromTime(timestampDataArray[1]) || 0,
  //       subtitleContent: dataArray[2],
  //     };
  //   });
  //   return subtitleObjectArray;
  // }, []);

  // const getShowingSubtitle = useCallback(
  //   (currentTime = 0) => {
  //     let content = '';
  //     subtitleDataArray.forEach((data, index) => {
  //       const { startTime, subtitleContent } = data;
  //       // Use for show the subtitle at start rather than wait for few second
  //       const processedStartTime = index === 0 ? 0.0001 : startTime;
  //       if (currentTime >= processedStartTime) {
  //         content = subtitleContent;
  //       }
  //     });
  //     return content;
  //   },
  //   [subtitleDataArray],
  // );

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

  // Handle Skip the Playing Video
  const skipPlayingVideo = useCallback(() => {
    if (isVideoRefPlaying) {
      videoRef.current.pause();
      setIsClearingVideoSrc(true);
      // setTimeout(() => {
      //   setIsClearingVideoSrc(false);
      //   setVideoSrcState('');
      //   if (videoCutInState === '') {
      //     setIsVideoPlaying(false);
      //   }
      //   if (isPresenterViewOnly) {
      //     socketEmitPlayingState('playingVideoEnd');
      //   }
      // }, 1000);
      setVideoSrcState('');
      if (videoCutInState === '') {
        setIsVideoPlaying(false);
      }
      if (isPresenterViewOnly) {
        socketEmitPlayingState('playingVideoEnd');
      }
      setIsVideoRefPlaying(false);
      setIsPlayedOneVideo(false);
      // setVideoSubtitle('');
    }
    if (isVideoCutInRefPlaying) {
      videoCutInRef.current.pause();
      // setTimeout(() => {
      //   setVideoCutInState('');
      //   if (videoSrcState === '') {
      //     setIsVideoPlaying(false);
      //   }
      //   if (isPresenterViewOnly) {
      //     socketEmitPlayingState('playingVideoEnd');
      //   }
      // }, 1000);
      setVideoCutInState('');
      if (videoSrcState === '') {
        setIsVideoPlaying(false);
      }
      if (isPresenterViewOnly) {
        socketEmitPlayingState('playingVideoEnd');
      }
      setIsPlayedOneVideo(false);
      setIsVideoCutInRefPlaying(false);
      // setVideoSubtitle('');
    }
    const aud = document.getElementById('audio-elm');
    setSafariDelayStandingOpacity(1);
    if (aud) {
      aud.pause();
    }
  }, [
    isPresenterViewOnly,
    isVideoCutInRefPlaying,
    isVideoRefPlaying,
    setIsPlayedOneVideo,
    setIsVideoPlaying,
    socketEmitPlayingState,
    videoCutInState,
    videoSrcState,
  ]);

  // Here is for the safari and iphone environment, set the unmute function to a useState, run that function
  // On the first click on the UI.
  useEffect(() => {
    if (isInitMuted) {
      setOnEnableAudioInteractiveClick((prev) => {
        if (!prev || prev === noop) {
          return () => {
            if (isInitMuted) {
              setIsInitMuted(false);
              initRender = false;
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

  useEffect(() => {
    if (isNeedSkipVideo) {
      skipPlayingVideo();
      setIsNeedSkipVideo(false);
    }
  }, [isNeedSkipVideo, setIsNeedSkipVideo, skipPlayingVideo]);

  const videoSrcHlsElementMemo = useMemo(() => {
    return (
      <ReactHlsPlayer
        playerRef={videoRef}
        // crossOrigin="anonymous"
        muted={isNeedAudioContext || isInitMuted}
        style={
          isIos
            ? {
                // Fix ios 17 video cropped issue
                opacity: isVideoRefPlaying && videoSrcState ? 1 : 0,
                zIndex: 2,
                position: 'absolute',
                bottom: 'unset',
                marginTop: '-2vh',
                transform: 'scale(2)',
                transformOrigin: '0% 0%',
                width: '50vw',
                height: '22vh',
                left: '0px',
              }
            : {
                opacity: isVideoRefPlaying && videoSrcState ? 1 : 0,
                zIndex: 2,
                position: 'absolute',
                height: '100vh',
                marginTop: '0px',
                bottom: '0px',
              }
        }
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
        playsInline
        onEnded={() => {
          setVideoSrcState('');
          setIsVideoPlaying(false);
          setIsVideoRefPlaying(false);
          setIsPlayedOneVideo(false);
          // setVideoSubtitle('');
          setSafariDelayStandingOpacity(1);
        }}
        onPlay={(data) => {
          if (!isVideoRefPlaying && videoSrcState) {
            setIsVideoReadyToPlay(true);
            setIsDuringTransitionBuffer(true);
            // setTimeout(() => {
            //   setIsDuringTransitionBuffer(false);
            // }, 250);
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
    isInitMuted,
    isIos,
    isNeedAudioContext,
    isVideoRefPlaying,
    setIsPlayedOneVideo,
    setIsVideoPlaying,
    videoSrcState,
  ]);

  const videoCutInHlsElementMemo = useMemo(() => {
    return (
      <ReactHlsPlayer
        // crossOrigin="anonymous"
        playsInline
        muted={isNeedAudioContext || isInitMuted}
        style={
          isIos
            ? {
                // Fix ios 17 video cropped issue
                opacity: isVideoCutInRefPlaying && videoCutInState ? 1 : 0,
                zIndex: 3,
                position: 'absolute',
                bottom: 'unset',
                marginTop: '-2vh',
                transform: 'scale(2)',
                transformOrigin: '0% 0%',
                width: '50vw',
                height: '22vh',
                left: '0px',
              }
            : {
                opacity: isVideoCutInRefPlaying && videoCutInState ? 1 : 0,
                zIndex: 3,
                position: 'absolute',
                height: '100vh',
                marginTop: '0px',
                bottom: '0px',
              }
        }
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
          // setVideoSubtitle('');
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
            // }, 250);
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
    isInitMuted,
    isIos,
    isNeedAudioContext,
    isVideoCutInRefPlaying,
    setIsPlayedOneVideo,
    setIsVideoPlaying,
    videoCutInState,
  ]);

  // Render the element Memo
  const presenterPreviewMemo = useMemo(
    () => (
      <StyledPresenterPreview
        className={cx('presenter-preview-section', {
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
        {videoBackgroundImage !== '' && !isChatbotWidget && (
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
          className=""
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
                // transitionDelay: !isPlayedFirstVideo ? '50ms' : 'unset',
                transitionDelay: isVideoCutInRefPlaying && isVideoRefPlaying ? '100ms' : 'unset',
                filter: 'brightness(0.98)',
              }}
              isPlaying={true}
              isM3U8={false}
              isNeedAlphaChannel={false}
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
              style={
                isIos
                  ? {
                      // Fix ios 17 video cropped issue
                      zIndex: 1,
                      position: 'absolute',
                      // filter: 'saturate(1.1)',
                      opacity: isMobile ? 0 : 1,
                      bottom: 'unset',
                      filter: 'brightness(0.98)',
                      marginTop: '-2vh',
                      // width: '100%',
                      // height: '100vh',
                      transform: 'scale(2.0)',
                      transformOrigin: '0% 0%',
                      width: '50vw',
                      height: '22vh',
                      left: '0px',
                    }
                  : {
                      zIndex: 1,
                      position: 'absolute',
                      // filter: 'saturate(1.1)',
                      opacity: isMobile ? 0 : 1,
                      height: '100vh',
                      marginTop: '0px',
                      bottom: '0px',
                      filter: 'brightness(0.98)',
                      // width: '100%',
                      // height: '100vh',
                    }
              }
              onEnded={() => {
                videoStandingRef.current.play().then(() => {
                  // const videoRefTime =
                  //   videoRef.current.currentTime > 10 ? 0 : videoRef.current.currentTime;
                  // const videoCutInRefTime =
                  //   videoCutInRef.current.currentTime > 10
                  //     ? 0
                  //     : videoCutInRef.current.currentTime;
                  videoStandingRef.current.currentTime = videoStandingRef.current.currentTime + 0.1;
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
            }}
            isNeedAlphaChannel={false}
            height={srcHeight}
            width={srcWidth}
          />
          {videoSrcHlsElementMemo}
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
            }}
            isNeedAlphaChannel={false}
            height={cutInHeight}
            width={cutInWidth}
          />
          {videoCutInHlsElementMemo}
        </div>

        {isShowingSubtitle ? (
          <>
            {chatHistoryArray.length === 0 ? null : (
              <div
                style={{
                  width: '100%',
                  bottom: '36%',
                  height: '10.41666vh',
                  marginBottom: '-0.52083vh',
                  position: 'absolute',
                  zIndex: 4,
                }}
              >
                <div style={{ padding: '2.5520833vh 10.74vw 2.239583vh' }}>
                  {(videoSubtitle !== '' &&
                    !isPlayingWaitingMsg &&
                    isConnectionValid &&
                    isLastContentAlreadyDisplay &&
                    chatHistoryArray.length !== 0) ||
                  (isLastContentFromHistory && lastContentMsg) ? (
                    <div
                      id="CHATBOT_DESKTOP_SUBTITLE_WRAP"
                      className="chatbot-desktop-subtitle-wrap"
                      style={{
                        width: '100%',
                        maxHeight: '8.333vh',
                        height: 'fit-content',
                        zIndex: '4',
                        display: 'flex',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        overflow: 'hidden',
                        opacity: '1',
                      }}
                    >
                      {!isResetSpring && (
                        <Subtitle
                          isVideoRefPlaying={isVideoRefPlaying}
                          videoRef={videoRef}
                          isVideoCutInRefPlaying={isVideoCutInRefPlaying}
                          videoCutInRef={videoCutInRef}
                          subtitleDuration={subtitleDuration}
                          fontSize={'3vw'}
                          fontColor={'#ff0100'}
                          videoSubtitle={videoSubtitle}
                          currentPlayingTime={
                            isVideoRefPlaying
                              ? videoRef?.current?.currentTime
                              : isVideoCutInRefPlaying
                                ? videoCutInRef.current?.currentTime
                                : 0
                          }
                          isShowingSubtitle={true}
                          isBold={true}
                          lastContentMsg={lastContentMsg}
                          isLastContentFromHistory={isLastContentFromHistory}
                        />
                      )}
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '120px' }} />
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          videoSubtitle !== '' &&
          isShowingSubtitle &&
          !isPlayingWaitingMsg && (
            <div
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
          )
        )}
        {(isVideoRefPlaying || isVideoCutInRefPlaying) &&
          !isPlayingWaitingMsg &&
          !isChatbotWidget && (
            <div
              className="skip-button qa-skip-button"
              onClick={skipPlayingVideo}
              style={skipButtonConfig}
            >
              <p>SKIP</p>

              <SkipIcon />
            </div>
          )}
        <div id="audio-context-audio-elm-src" />
      </StyledPresenterPreview>
    ),
    [
      isPresenterViewOnly,
      isShowPresenterPreviewState,
      isDesktop,
      isNeedAlphaChannel,
      videoBackgroundImage,
      isChatbotWidget,
      modelPositionConfig,
      windowInnerHeight,
      browserType,
      safariDelayStandingOpacity,
      isVideoRefPlaying,
      isVideoCutInRefPlaying,
      isDuringTransitionBuffer,
      setUpdateTransparentStandingVideoCanvasState,
      isIos,
      isMobile,
      videoSrcState,
      srcHeight,
      srcWidth,
      videoSrcHlsElementMemo,
      videoCutInState,
      cutInHeight,
      cutInWidth,
      videoCutInHlsElementMemo,
      isShowingSubtitle,
      chatHistoryArray.length,
      videoSubtitle,
      isPlayingWaitingMsg,
      isConnectionValid,
      isLastContentAlreadyDisplay,
      isLastContentFromHistory,
      lastContentMsg,
      isResetSpring,
      subtitleDuration,
      subtitleStyleConfig,
      subtitleConfig,
      skipPlayingVideo,
      skipButtonConfig,
      playResponseVideo,
      videoBoomerangUrl,
    ],
  );
  return presenterPreviewMemo;
}
