/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';

// lodash
import noop from 'lodash/noop';
import get from 'lodash/get';

// conext
import { useDigitalHumanPreview } from '@chatbot-test/core/digitalHumanPreview/PreviewContext';

// components
import { Space, Dropdown, Divider } from 'antd';

// styles
import { HomeOutlined } from '@ant-design/icons';

const StyledVerticalHeader = styled.div`
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 176px;

  .line {
    width: 56px;
    height: 0px;
    border: 2px solid #ffffff;
    transform: rotate(90deg);
    background-color: ${(props) => `${props.fontColor || 'white'}`};
  }

  .info-bar {
    height: 176px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .date-block {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    p {
      opacity: ${(props) => `${props.isShowText ? 1 : 0}`};
      font-family: 'Lexend';
      font-style: normal;
      font-weight: 500;
      font-size: 32px;
      line-height: 40px;
      text-align: center;
      margin: 0px;
      color: ${(props) => `${props.fontColor || 'white'}`};
    }

    .home-button-wrap {
      svg {
        width: 48px;
        height: 48px;
        color: dimgray;
        margin-right: 12px;
      }
    }
  }
`;

export default function VerticalHeader({
  clearSocket = noop,
  currentHeaderConfig = {},
  setIsShowLoginTab = noop,
  setSelectedServiceLanguage = noop,
}) {
  const { eventActiveConfig } = useDigitalHumanPreview();

  const [unixTime, setUnixTime] = useState(0);
  const genFormatedDateFromUnixTime = useCallback((unixTime, dateFormat) => {
    // const DATE_TIME_FORMAT = 'dd/MM HH:mm:ss';
    return isValid(unixTime) ? format(unixTime, dateFormat) : '';
  }, []);
  const hoursTime = unixTime === 0 ? '00:00' : genFormatedDateFromUnixTime(unixTime, 'HH:mm');
  const date =
    unixTime === 0 ? '23 March 2023' : genFormatedDateFromUnixTime(unixTime, 'd MMMM yyyy');
  const weekDay = unixTime === 0 ? 'Teusday' : genFormatedDateFromUnixTime(unixTime, 'EEEE');

  useEffect(() => {
    const interval = setInterval(() => setUnixTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const { logoImgLink, logo2ImgLink, languageImgLink, fontColor, mainColor, subColor } =
    useMemo(() => {
      return {
        logoImgLink: get(currentHeaderConfig, 'logoImgLink', ''),
        logo2ImgLink: get(currentHeaderConfig, 'logo2ImgLink', ''),
        languageImgLink: get(currentHeaderConfig, 'languageImgLink', ''),
        languageArray: get(currentHeaderConfig, 'languageArray', []),
        fontColor: get(currentHeaderConfig, 'fontColor', ''),
        mainColor: get(currentHeaderConfig, 'mainColor', ''),
        subColor: get(currentHeaderConfig, 'subColor', ''),
      };
    }, [currentHeaderConfig]);

  const languagesItems = useMemo(() => {
    const buttonStyle = {
      height: '48px',
      backgroundColor: mainColor || '#162547',
      color: fontColor || 'white',
      fontSize: '24px',
      textAlign: 'center',
      fontFamily: 'Lexend',
      marginBottom: '2px',
      paddingTop: '8px',
    };
    const onButtonClick = (langCode) => {
      clearSocket();
      setSelectedServiceLanguage(langCode);
    };

    return [
      {
        key: '1',
        style: buttonStyle,
        langCode: 'en-US',
        label: 'English',
      },
      {
        key: '2',
        style: buttonStyle,
        langCode: 'zh-HK',
        label: '廣東話',
      },
      {
        key: '3',
        style: buttonStyle,
        langCode: 'zh-CN',
        label: '普通話',
      },
    ].map(({ key, style, langCode, label }) => {
      return {
        key,
        label: (
          <div
            style={style}
            onClick={() => {
              onButtonClick(langCode);
            }}
          >
            {label}
          </div>
        ),
      };
    });
  }, [fontColor, mainColor, clearSocket, setSelectedServiceLanguage]);

  return (
    <StyledVerticalHeader
      isShowText={unixTime !== 0}
      fontColor={fontColor}
      style={
        mainColor === ''
          ? {}
          : {
              background: mainColor,
            }
      }
    >
      <div
        className="info-bar"
        style={
          mainColor === ''
            ? {}
            : {
                background: mainColor,
              }
        }
      >
        <div
          className="header-bar"
          style={{
            width: '100%',
            height: '8px',
            position: 'absolute',
            top: '0px',
            opacity: subColor === '' ? 0 : 1,
            zIndex: '12',
            backgroundColor: subColor || 'white',
          }}
        />

        <div
          className="icon-block-1"
          onClick={() => {
            clearSocket();

            if (window.location.search.includes('mode=qa')) {
              setTimeout(() => {
                window.open('/vertical?mode=qa', '_self');
              }, 1000);
            }
          }}
        >
          <img
            src={logoImgLink || '/test/assets/pantheon_lab_logo.png'}
            alt="icon-1"
            style={{ margin: '32px 12px 32px 32px', width: '20%', objectFit: 'contain' }}
          />
        </div>

        <div className="icon-block-2" onClick={get(eventActiveConfig, 'onSwitchEventURL', null)}>
          <img
            src={logo2ImgLink || '/test/assets/pantheon_lab_logo_white.png'}
            alt="icon-2"
            style={{ marginRight: '20px', width: '20%', objectFit: 'contain' }}
          />
        </div>

        <div className="date-block">
          <p>24°C</p>
          <div className="line" />
          <p>{hoursTime}</p>
          <div className="line" />
          <div
            className="date-content"
            onClick={() => setIsShowLoginTab(true)}
            style={{ cursor: 'pointer' }}
          >
            <p style={{ fontSize: '24px' }}> {date}</p>
            <p style={{ fontSize: '24px' }}> {`(${weekDay})`}</p>
          </div>
        </div>

        <Dropdown
          menu={{
            items: languagesItems,
            style: {
              backgroundColor: mainColor || '#162547',
            },
          }}
          trigger={['click']}
        >
          <Space>
            <img
              src={languageImgLink || '/test/assets/language.png'}
              alt="chat-icon"
              // style={{ margin: '56px 60px 56px 32px' }}
            />
          </Space>
        </Dropdown>

        <Divider type="vertical" />

        <div className="home-button-wrap" onClick={clearSocket}>
          <HomeOutlined />
        </div>
      </div>
    </StyledVerticalHeader>
  );
}
