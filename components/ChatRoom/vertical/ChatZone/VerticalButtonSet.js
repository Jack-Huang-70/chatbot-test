import React, { useMemo } from 'react';
import styled from 'styled-components';

// lodash
import get from 'lodash/get';

// hooks
import { useAddDataTestId } from '@/chatbot-packages/qa/useAddDataTestId';

const StyledVerticalButtonSet = styled.div`
  position: absolute;
  top: 202px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 200px;
  z-index: 11;
  width: 100%;
  padding: 32px;
  .button-block {
    height: 200px;
    width: 297px;
    background-color: white;
    border-radius: 24px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    p {
      font-family: 'Lexend';
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
      color: #162547;
    }
    .button-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      margin-top: 8px;
    }
  }
`;

export default function VerticalButtonSet({ currentButtonSetConfig = {} }) {
  const {
    isShowButtonSet,
    button1Icon,
    button1CopyWriting,
    button2Icon,
    button2CopyWriting,
    button3Icon,
    button3CopyWriting,
    fontColor,
  } = useMemo(() => {
    return {
      isShowButtonSet: get(currentButtonSetConfig, 'isShowButtonSet', true),
      button1Icon: get(currentButtonSetConfig, 'button1Icon', ''),
      button1CopyWriting: get(currentButtonSetConfig, 'button1CopyWriting', ''),
      button2Icon: get(currentButtonSetConfig, 'button2Icon', ''),
      button2CopyWriting: get(currentButtonSetConfig, 'button2CopyWriting', ''),
      button3Icon: get(currentButtonSetConfig, 'button3Icon', ''),
      button3CopyWriting: get(currentButtonSetConfig, 'button3CopyWriting', ''),
      fontColor: get(currentButtonSetConfig, 'fontColor', ''),
    };
  }, [currentButtonSetConfig]);

  const buttonSizeArray = useMemo(() => {
    return [
      {
        img: button1Icon === '' ? '/test/assets/location.png' : button1Icon,
        name: 'station',
        defaultMessage: 'Station Finding',
        customMessage: button1CopyWriting || '',
      },
      {
        img: button2Icon === '' ? '/test/assets/gateInfo.png' : button2Icon,
        name: 'mall',
        defaultMessage: 'Mall Finding',
        customMessage: button2CopyWriting || '',
      },
      {
        img: button3Icon === '' ? '/test/assets/call.png' : button3Icon,
        name: 'call',
        defaultMessage: 'Call For Help',
        customMessage: button3CopyWriting || '',
      },
    ];
  }, [
    button1CopyWriting,
    button1Icon,
    button2CopyWriting,
    button2Icon,
    button3CopyWriting,
    button3Icon,
  ]);

  useAddDataTestId();

  return isShowButtonSet ? (
    <StyledVerticalButtonSet>
      {buttonSizeArray.map((data, index) => {
        const { img, name, defaultMessage, customMessage } = data;
        return (
          <div
            className="button-block"
            key={`nav-button-set-${index}-${name}`}
            style={name === 'call' ? { backgroundColor: '#A1354A' } : {}}
          >
            <div className="button-content">
              {/* eslint-disable-next-line @next/next/no-img-element*/}
              <img alt={`img-button-index-${name}`} src={img} style={{ marginBottom: '16px' }} />
              <p style={name === 'call' ? { color: 'white' } : { color: fontColor || '#162547' }}>
                {customMessage || defaultMessage}
              </p>
            </div>
          </div>
        );
      })}
    </StyledVerticalButtonSet>
  ) : null;
}
