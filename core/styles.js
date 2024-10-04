import styled from 'styled-components';

// components
import { Modal } from 'antd';

// contanst
import { IS_PRESENTER_VIEW_ONLY, WIDTH, HEIGHT } from './constants';

export const StyledRoot = styled.div`
  .header {
    height: 16vh;
    width: 100vw;
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 0px 0px 80px 0px;
    top: 0px;
    left: 0px;
    z-index: 12;
    justify-content: flex-end;
    display: flex;
    .header-line {
      background-color: #336cff;
      height: 4.5%;
      width: 100%;
    }
    .header-info {
      position: absolute;
      display: flex;
      height: 100%;
      justify-content: flex-end;
      align-items: center;
      margin-right: 76px;
      .ricerobotics-info {
        cursor: pointer;
        font-size: 16px !important;
        color: black;
      }
      .header-info-date {
        p {
          font-size: 18px;
          text-align: center;
        }
      }
      .header-info-other {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 8px;
      }
      .line {
        width: 28px;
        height: 0px;
        border: 1px solid #336cff;
        transform: rotate(90deg);
        background-color: #336cff;
      }
      p {
        font-family: Lexend;
        color: #336cff;
        font-size: 24px;
      }
    }
  }
  .login-tab {
    width: 245px;
    position: absolute;
    height: 100vh;
    top: 0px;
    left: 0px;
    z-index: 11;
    background-color: white;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    .trigger-button {
      position: absolute;
      top: 40%;
      right: -10%;
      height: 10%;
      width: 10%;
      background-color: black;
      color: white;
      text-align: center;
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
      font-family: Lexend;
      transform: scale(1);
      transition: transform 0.4s;
      opacity: 0.5;
      :hover {
        transform: scale(1.3);
        transition: transform 0.4s;
        opacity: 1;
      }
    }
    .login-logo-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 16px;
      z-index: 8;
      height: 56px;
      padding: 4px;
      opacity: 0.8;
      p {
        font-family: Lexend;
        font-size: 2.2vh;
      }
    }
    .login-content {
      padding: 24px;
      display: flex;
      max-width: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      a {
        cursor: pointer;
      }
      p {
        font-family: Lexend;
        font-size: 24px;
      }
      .login-out-button {
        background-color: white;
        border-radius: 16px;
        height: 48px;
        border: solid 2px black;
        padding: 4px 16px;
        cursor: pointer;
        transform: scale(1);
        transition: all 0.3s;
        color: black;
      }
      .login-out-button:hover {
        background-color: black;
        transform: scale(1.2);
        transition: all 0.3s;
        color: white;
      }
    }
  }
  .footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 48px;
    width: 100%;
    a {
      margin: 8px;
      font-family: Lexend;
      font-size: 12px;
      transform: scale(1);
      transition: all 0.3s;
    }
    a:hover {
      transform: scale(1.3);
      transition: all 0.3s;
    }
  }
`;

export const StyledModal = styled(Modal)`
  height: 60vh !important;
  width: 60vw !important;
  top: 20vh !important;
  &.HKIA-login {
    top: 0vh !important;
  }

  .ant-modal-content {
    height: 100%;
    width: 100%;
    .ant-modal-body {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: space-between;
      flex-direction: column;
      .header {
        height: 8vh;
        display: flex;
        align-items: center;
        p {
          font-family: Lexend;
          font-weight: 700;
          font-size: 28px;
        }
      }
      .information {
        max-height: 36vh;
        margin: 0px 48px;
        padding: 16px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        p {
          font-family: Lexend;
          font-size: 20px;
        }
      }
      .agree-button-wrap {
        height: 8vh;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .agree-button {
          background-color: black;
          border-radius: 48px;
          ${'' /* width: 250px; */}
          ${'' /* height: 64px; */}
        p {
            padding: 16px 24px;
            font-family: Lexend;
            font-size: 15px;
            color: white;
          }
        }
      }
    }
  }
`;

export function genPresenterViewOnlyStyle() {
  return IS_PRESENTER_VIEW_ONLY
    ? {
        width: `${WIDTH ? `${WIDTH}px` : '100vw'}`,
        height: `${HEIGHT ? `${HEIGHT}px` : '100vh'}`,
        padding: '0px',
      }
    : {
        maxWidth: '1920px',
        height: '100vh',
        width: '100%',
        maxHeight: '1080px',
        minWidth: '1280px',
        minHeight: '720px',
        aspectRatio: '16/9',
      };
}

export function genKioskStyle({ isNeedAlphaChannel }) {
  return {
    maxHeight: '100%',
    // minWidth: '607.5px',
    height: '100vh',
    maxWidth: isNeedAlphaChannel ? 'none' : '1080px',
    aspectRatio: '9/16',
    // minHeight: '1080px',
    width: 'auto',
  };
}

export function genDesktopStyle({ isNeedAlphaChannel }) {
  return IS_PRESENTER_VIEW_ONLY
    ? {
        width: `${WIDTH ? `${WIDTH}px` : '100vw'}`,
        height: `${HEIGHT ? `${HEIGHT}px` : '100vh'}`,
        padding: '0px',
      }
    : {
        maxWidth: '100%',
        minWidth: '1280px',
        height: '100vh',
        // maxHeight: isNeedAlphaChannel ? 'none' : '1080px',
        aspectRatio: isNeedAlphaChannel ? 'none' : '16/9',
        minHeight: '650px',
        width: isNeedAlphaChannel ? '100%' : 'auto',
      };
}
