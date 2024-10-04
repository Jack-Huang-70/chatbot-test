import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { isString } from 'lodash';

const Subtitle = ({
  isVideoRefPlaying = false,
  isBold = false,
  videoRef = null,
  isVideoCutInRefPlaying = false,
  videoCutInRef = null,
  subtitleDuration = 0,
  fontSize = 20,
  fontColor = 'white',
  videoSubtitle = '',
  // currentPlayingTime = 0,
  isShowingSubtitle = false,
  lastContentMsg = '',
  isLastContentFromHistory = false,
}) => {
  const currentPlayingTime = isVideoRefPlaying
    ? videoRef?.current?.currentTime
    : isVideoCutInRefPlaying
    ? videoCutInRef.current?.currentTime
    : 0;

  const updateTimeOutRef = useRef(null);
  const [targetMarginTop, setTargetMarginTop] = useState(1);
  const [isUpdatedSubtitleContent, setIsUpdatedSubtitleContent] = useState(false);
  // Subtitle
  useEffect(() => {
    if (isUpdatedSubtitleContent) {
      const subtitleWrap = document.getElementById('CHATBOT_DESKTOP_SUBTITLE_WRAP');
      const subtitle = document.getElementById('CHATBOT_DESKTOP_SUBTITLE');
      const subtitleWrapHeight = subtitleWrap?.getBoundingClientRect().height || 0;
      const subtitleHeight = subtitle?.getBoundingClientRect().height || 0;
      if (
        subtitleWrapHeight > 0 &&
        subtitleHeight > 0 &&
        subtitleHeight > subtitleWrapHeight + 20
      ) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setTargetMarginTop(subtitleHeight - subtitleWrapHeight);
      } else {
        setTargetMarginTop(1);
      }
      setTimeout(() => {
        setIsUpdatedSubtitleContent(false);
      }, 100);
      if (updateTimeOutRef.current) {
        window.clearTimeout(updateTimeOutRef.current);
        updateTimeOutRef.current = '';
      }
    }
  }, [currentPlayingTime, isUpdatedSubtitleContent]);

  const isSubtitleEnable = useMemo(
    () => videoSubtitle && isShowingSubtitle,
    [isShowingSubtitle, videoSubtitle],
  );

  useEffect(() => {
    if (isSubtitleEnable) {
      if (!updateTimeOutRef.current) {
        updateTimeOutRef.current = window.setTimeout(() => {
          // Make sure the element is already rendered, so delay 100ms
          setIsUpdatedSubtitleContent(true);
        }, 100);
      }
    }
  }, [isSubtitleEnable]);

  const processedeSubtitle = useMemo(() => {
    return videoSubtitle.replace(
      // eslint-disable-next-line no-useless-escape
      /\[(.{2,80})\](\(.*\)|:[a-zA-Z0-9:\/\.\-=?&_%]*)/gm,
      (_a, title) => {
        return title;
      },
    );
  }, [videoSubtitle]);

  const estimatedPlayingTime = 0.25 * processedeSubtitle.length;

  const props = useSpring({
    from: {
      transform:
        currentPlayingTime > 0.6
          ? `translateY(${
              (-1 * targetMarginTop * currentPlayingTime * 1000) /
              ((subtitleDuration === 0
                ? isVideoRefPlaying
                  ? videoRef?.current?.duration || 0
                  : isVideoCutInRefPlaying
                  ? videoCutInRef?.current?.duration || 0
                  : 0
                : subtitleDuration) *
                800 -
                2000)
            }px)`
          : 'translateY(0px)',
    },
    to: { transform: `translateY(${-1 * targetMarginTop}px)` },
    // transform: `translateY(${-1 * targetMarginTop}px)`,
    config: {
      duration:
        (subtitleDuration === 0
          ? isVideoRefPlaying
            ? videoRef?.current?.duration || estimatedPlayingTime
            : isVideoCutInRefPlaying
            ? videoCutInRef?.current?.duration || estimatedPlayingTime
            : estimatedPlayingTime
          : subtitleDuration) *
          800 -
        2000 -
        (currentPlayingTime > 0.6 ? currentPlayingTime * 1000 : 0),
    },
    reset: isUpdatedSubtitleContent,
  });

  return isLastContentFromHistory && lastContentMsg ? (
    <p
      id="CHATBOT_DESKTOP_SUBTITLE"
      className="chatbot-desktop-subtitle"
      style={{
        textAlign: 'center',
        // backgroundColor: 'black',
        color: fontColor,
        fontFamily: 'Lexend',
        fontSize: isString(fontSize) && fontSize.includes('v') ? fontSize : `${fontSize}px`,
        fontWeight: isBold ? 700 : 'normal',
        padding: '4px',
        height: 'fit-content',
        lineHeight: '2',
      }}
    >
      {lastContentMsg}
    </p>
  ) : (
    <animated.p
      id="CHATBOT_DESKTOP_SUBTITLE"
      className="chatbot-desktop-subtitle"
      style={{
        textAlign: 'center',
        // backgroundColor: 'black',
        color: fontColor,
        fontFamily: 'Lexend',
        fontSize: isString(fontSize) && fontSize.includes('v') ? fontSize : `${fontSize}px`,
        fontWeight: isBold ? 700 : 'normal',
        padding: '4px',
        height: 'fit-content',
        lineHeight: '2',
        ...props,
      }}
    >
      {processedeSubtitle}
    </animated.p>
  );
};

export default Subtitle;
