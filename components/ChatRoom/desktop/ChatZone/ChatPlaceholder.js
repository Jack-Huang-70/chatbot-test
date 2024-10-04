import React, { useMemo } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import noop from 'lodash/noop';
import get from 'lodash/get';

// utils
import getLanguageUICopyWriting from '@/chatbot-packages/utils/getLanguageUICopyWriting';

// hooks
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';

// components

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
      font-size: ${(props) => `2${props.viewUnit}`};
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
    width: ${(props) => `21.4${props.viewUnit}`};
    padding: 16px 0;
    border-radius: 1000px;
    border: solid 2px #7399fb;
    background-color: white;
    justify-content: center;
    align-items: center;
    display: flex;
    opacity: 0.95;

    > span {
      font-family: Lexend;
      font-size: ${(props) => `1.2${props.viewUnit}`};
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #7399fb;
    }

    &.disabled {
      background-color: lightgray;

      > span {
        color: #fff;
      }
    }
  }
`;

export default function ChatPlaceholder({
  onSayHiClick = noop,
  defaultFirstMessage = 'Hello',
  viewUnit = 'vw',
}) {
  const languageUICopyWritingProps = getLanguageUICopyWriting();
  const { cachedProfileConfig } = useProfileConfig();

  const companyLogoUrl = useMemo(
    () => get(cachedProfileConfig, ['data', 'companyLogoUrl'], ''),
    [cachedProfileConfig],
  );

  return (
    <StyledChatPlaceholder
      className="chat-placeholder"
      logoState={companyLogoUrl === '' ? companyLogo : companyLogoUrl}
      viewUnit={viewUnit}
    >
      <button
        type="button"
        className={cx('say-hi-button qa-start-button')}
        onClick={onSayHiClick}
        style={{
          borderColor: '#7399fb',
        }}
      >
        <span>{`${get(languageUICopyWritingProps, 'say', '')} ${defaultFirstMessage}!`}</span>
      </button>
    </StyledChatPlaceholder>
  );
}
