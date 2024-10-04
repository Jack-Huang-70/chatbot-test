import React, { useMemo } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import noop from 'lodash/noop';
import get from 'lodash/get';

// hooks
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';

// styles
import companyLogo from '@chatbot-test/public/test/assets/No_tagline@3x.png';

const StyledChatPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .placeholder-text-wrap {
    margin-bottom: 16px;

    > p {
      margin: 0px;
      opacity: 0.7;
      font-family: Lexend;
      font-size: 40px;
      text-align: center;
      color: #fff;
    }
  }

  .company-info {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    > p {
      margin: 0px;
      margin-right: 24px;
      opacity: 0.7;
      font-family: Lexend;
      font-size: 20px;
      color: #fff;
    }

    .company-logo {
      width: 180px;
      height: 40px;
      background-image: url('${(props) => props.logoState}');
      background-position: left center;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }

  .say-hi-button {
    width: 288px;
    height: 40px;
    padding: 8px 0;
    border-radius: 14px 14px 0px 14px;
    border: 0px;
    /* background-color: white; */
    background-image: linear-gradient(123deg, #7399fb 8%, #8db5e6 75%);
    justify-content: center;
    align-items: center;
    display: flex;
    opacity: 0.95;

    > span {
      font-family: Lexend;
      font-size: 12px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
    }

    &.disabled {
      background-color: lightgray;

      > span {
        color: #fff;
      }
    }
  }
`;

export default function ChatPlaceholder({ onSayHiClick = noop, defaultFirstMessage = '' }) {
  const { cachedProfileConfig } = useProfileConfig();

  const { companyLogoUrl } = useMemo(() => {
    return {
      companyLogoUrl: get(cachedProfileConfig, ['data', 'companyLogoUrl'], ''),
    };
  }, [cachedProfileConfig]);

  return (
    <StyledChatPlaceholder
      className="chat-placeholder"
      logoState={companyLogoUrl === '' ? companyLogo : companyLogoUrl}
    >
      <button type="button" className={cx('say-hi-button qa-start-button')} onClick={onSayHiClick}>
        <span>{defaultFirstMessage}</span>
      </button>
    </StyledChatPlaceholder>
  );
}
