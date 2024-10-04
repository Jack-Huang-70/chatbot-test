/* eslint-disable no-undef */
import { Geometry, Mesh, Program, Renderer, Texture } from 'ogl';
import { useEffect, useMemo, useRef, useState } from 'react';
import noop from 'lodash/noop';
// import ReactPlayer from 'react-player';

// hooks
import { useMount } from 'ahooks';

// utils
import getBrowserType from '@/chatbot-packages/utils/getBrowserType';

const fragmentShader = `
precision highp float;
uniform sampler2D uVideoTexture;
varying vec2 vUv;
void main() {
     vec4 textColor=  vec4(
      texture2D(uVideoTexture, vec2(vUv.x, vUv.y * 0.5 + 0.5)).rgb,
      texture2D(uVideoTexture, vec2(vUv.x, vUv.y * 0.5)).r
    );
    if(textColor.a<0.5)
    discard;
    gl_FragColor =  textColor;
}
`;

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

export default function Canvas({
  playerRef = null,

  style = {},

  isPlaying = false,
  width = 0,
  height = 0,
  isNeedAlphaChannel = false,
  isBoomerangVideo = false,
  setUpdateTransparentStandingVideoCanvasState = noop,
  hideBoomerang = noop,
}) {
  const canvas = useRef(null);

  const [duringSafariLoading, setDuringSafariLoading] = useState(false);
  const [duringSafariTimeout, setDuringSafariTimeout] = useState(false);
  const { showWidth, showHeight } = useMemo(() => {
    return { showWidth: width * 2, showHeight: height };
  }, [width, height]);

  const browserType = getBrowserType();

  useEffect(() => {
    if (
      !canvas.current ||
      !playerRef.current ||
      (!isPlaying && !duringSafariLoading && !duringSafariTimeout) ||
      !isNeedAlphaChannel
    ) {
      return;
    }
    const { current } = playerRef;
    const { current: canvasCurrent } = canvas;
    const renderer = new Renderer({
      canvas: canvasCurrent,
      alpha: true,
      width: showWidth,
      height: showHeight,
    });
    const { gl } = renderer;
    const videoTexture = new Texture(gl, {
      generateMipmaps: false,
      width: showWidth,
      height: showHeight,
    });

    videoTexture.image = playerRef.current;
    videoTexture.needsUpdate = true;

    gl.clearColor(0, 0, 0, 0);

    // Triangle that covers viewport, with UVs that still span 0 > 1 across viewport
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uVideoTexture: { value: videoTexture },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const onVideoFrame = () => {
      videoTexture.needsUpdate = true;
      renderer.render({ scene: mesh });
    };

    let handle = 0;
    const callback = () => {
      onVideoFrame();
      if (duringSafariLoading) {
        setDuringSafariLoading(false);
        setDuringSafariTimeout(true);
        setTimeout(() => {
          setDuringSafariTimeout(false);
        }, 1000);
        hideBoomerang();
      }
      if (browserType === 'Firefox') {
        handle = window.requestAnimationFrame(callback);
      } else {
        handle = current.requestVideoFrameCallback(callback);
      }
    };

    callback();

    return () => {
      if (browserType === 'Firefox') {
        window.cancelAnimationFrame(handle);
      } else {
        current.cancelVideoFrameCallback(handle);
      }
    };
  }, [
    showHeight,
    showWidth,
    canvas,
    playerRef,
    isPlaying,
    browserType,
    isNeedAlphaChannel,
    isBoomerangVideo,
    duringSafariLoading,
    hideBoomerang,
    duringSafariTimeout,
  ]);

  useMount(() => {
    setUpdateTransparentStandingVideoCanvasState((prev) => {
      if (prev || !isBoomerangVideo) {
        return prev;
      }
      return () => {
        if (playerRef?.current) {
          if (browserType === 'Firefox') {
            setWidth(playerRef.current.offsetWidth || 0);
            setHeight((playerRef.current.offsetHeight || 0) * 2);
          } else {
            setWidth(playerRef.current.offsetWidth || 0);
            setHeight(playerRef.current.offsetHeight || 0);
          }
        }
      };
    });
  });

  // ReactPlayer backup
  //   <ReactPlayer
  //   ref={playerRef}
  //   style={{ ...style, opacity: 1 }}
  //   crossOrigin="anonymous"
  //   url={src}
  //   playing={playerRef?.current?.playing}
  //   onLoadedMetadata={(data) => {
  //     if (browserType === 'Firefox') {
  //       setWidth(data?.target?.offsetWidth || 0);
  //       setHeight((data?.target?.offsetHeight || 0) * 2);
  //     } else {
  //       setWidth(data?.target?.offsetWidth || 0);
  //       setHeight(data?.target?.offsetHeight || 0);
  //     }
  //   }}
  //   muted={muted}
  //   autoPlay={autoPlay}
  //   playsInline={playsInline}
  //   preload={preload}
  //   onEnded={onEnded}
  //   onLoadedData={onLoadedData}
  // />

  return (
    <>
      {isNeedAlphaChannel && isPlaying && (
        <canvas
          ref={canvas}
          style={{
            display: 'block',
            height: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            aspectRatio: 'initial',
            width: 'auto',
            bottom: '0px',
            ...style,
          }}
        />
      )}
    </>
  );
}
