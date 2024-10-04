import { css } from 'styled-components';

const verticalAndDesktopBasicStyle = css`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
  .chat-room-content-wrap {
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    .chat-room-content {
      display: flex;
      justify-content: space-between;
      flex: 1;
      position: relative;
      overflow: hidden;
      height: 100%;
      .loading-spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background-color: dimgray;
        opacity: 0.5;
        border-radius: 16px;
      }
    }
  }
  .chat-zone-wrap {
    overflow: hidden;
    position: absolute;
    .chat-zone {
      display: flex;
      flex-direction: column;
      position: absolute;
      height: 100%;
      width: 50%;
      right: 0px;
      bottom: 32px;
      padding: 120px 24px 16px 24px;
      z-index: 5;
    }
  }
  .icon-button-wrap {
    position: absolute;
    z-index: 5;
    cursor: pointer;
    top: 24px;

    svg {
      width: 32px;
      height: 32px;
    }

    &.open-config-dialog {
      left: 36px;
      padding: ${(props) => `0.31${props.viewUnit}`};
      height: ${(props) => `2.4${props.viewUnit}`};
      width: ${(props) => `2.4${props.viewUnit}`};
      background-color: white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .control-button-wrap {
    position: absolute;
    z-index: 5;
    cursor: pointer;
    top: 24px;
    right: 8px;
    display: flex;
    div {
      height: 48px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 24px;
      padding: ${(props) => `0.72${props.viewUnit} 1.2${props.viewUnit}`};
      border-radius: 1000px;
      border: solid 1px #d9d9d9;
      background-color: #fff;
      margin-right: 16px;
    }
    p {
      flex-grow: 0;
      font-family: Lexend;
      font-size: ${(props) => `0.85${props.viewUnit}`};
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #232323;
      margin-bottom: ${(props) => `0.15${props.viewUnit}`};
    }
  }
  .logo-wrap {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 16px;
    z-index: 8;
    height: 5vh;
    padding: 1vh 1vw;
    position: absolute;
    top: 24px;
    left: 24px;
    opacity: 0.8;
    p {
      font-family: Lexend;
      font-size: 2.2vh;
    }
  }
`;

const widgetBasicStyle = css`
  display: flex;
  ${'' /* flex-direction: column; */}
  ${'' /* align-items: center; */}
  align-items: flex-end;
  overflow: hidden;
  position: relative;
  height: '100rvh';
  box-sizing: border-box;

  &.full-screen-chatbot-on-mobile {
    width: unset;
    height: 100vh;
    .chat-zone {
      width: 44%;
      height: 99%;
    }
  }

  .control-button-wrap {
    display: flex;
    flex-direction: column;
    justify-content: end;
    margin-right: 16px;

    .control-button {
      > button {
        background-image: url(recordIcon);
        width: 34px;
        height: 34px;
        margin-top: 8px;
        background-position: center center;
        background-size: cover;
        cursor: pointer;
        border: none;
      }
    }
  }

  .chat-room-content {
    flex: 1;
    position: relative;
    overflow: hidden;

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background-color: dimgray;
      opacity: 0.5;
      border-radius: 16px;
    }

    .digital-human-preview-section {
      flex: initial !important;
      align-items: initial !important;
      width: 100% !important;
      height: 100% !important;
      max-height: initial !important;
      position: initial !important;
      margin-right: 0px !important;
      border-radius: initial !important;

      > video {
        left: 0px !important;
        transform: initial !important;
        top: -14px;
      }

      .icon-button-wrap {
        display: none;
      }

      .chatbot-desktop-subtitle-wrap {
        width: initial !important;
        min-width: initial !important;
        max-height: 45px !important;

        > p {
          font-size: 12px !important;
          line-height: initial !important;
        }
      }
    }
  }
  .chat-zone {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 16px 0px;
    z-index: 5;
  }
`;

export const getStyle = (type) => {
  if (type === 'vertical' || type === 'desktop') {
    return verticalAndDesktopBasicStyle;
  }

  if (type === 'widget') {
    return widgetBasicStyle;
  }

  return '';
};
