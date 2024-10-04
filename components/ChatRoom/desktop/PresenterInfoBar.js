import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';

// hooks
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';

// utils
import getLanguageUICopyWriting from '@/chatbot-packages/utils/getLanguageUICopyWriting';

// styles
import presenterIcon from '@chatbot-test/public/test/assets/vanya_icon.png';

const StyledPresenterInfoBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 16px;
  border-radius: 16px;
  background-image: linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);

  .presenter-icon {
    width: 56px;
    height: 56px;
    margin-right: 16px;
    border-radius: 50%;
    background-position: center center;
    background-image: url('${(props) => props.iconState}');
    background-size: cover;
  }

  > p {
    margin-bottom: 0px;
    font-family: Lexend;
    font-size: 16px;
    font-weight: 500;
    color: #000;
  }
`;

export default function PresenterInfoBar({
  isMultipleLanguages = false,
  selectedServiceLanguage = '',
}) {
  const languageUICopyWritingProps = getLanguageUICopyWriting();
  const [presenterName, setPresenterName] = useState(
    process.env.NEXT_PUBLIC_PRESENTER_NAME_CHATROOM,
  );
  const [presenterIconUrl, setPresenterIconUrl] = useState('');
  const [companyName, setCompanyName] = useState('');

  const { cachedProfileConfig } = useProfileConfig();
  useEffect(() => {
    setPresenterName(
      get(cachedProfileConfig, ['data', 'presenterName'], '') ||
        process.env.NEXT_PUBLIC_PRESENTER_NAME_CHATROOM,
    );
    setPresenterIconUrl(get(cachedProfileConfig, ['data', 'presenterIconUrl'], ''));
    setCompanyName(get(cachedProfileConfig, ['data', 'companyName'], ''));
  }, [cachedProfileConfig]);
  return (
    <StyledPresenterInfoBar
      className="presenter-info-bar"
      iconState={presenterIconUrl === '' ? presenterIcon : presenterIconUrl}
    >
      <div className="presenter-icon" />

      {isMultipleLanguages ? (
        <p>
          {selectedServiceLanguage === 'zh-HK'
            ? '香港科技園公司Luncheon 2023虛擬大使'
            : 'Virtual Ambassador of HKSTP’s Media Lunch 2023'}
        </p>
      ) : (
        <p>
          {`${get(
            languageUICopyWritingProps,
            'yourAssistant',
            `Your Digital Assistant from ${companyName === '' ? 'Pantheon Lab' : companyName}`,
          )} - ${presenterName}`}
        </p>
      )}
    </StyledPresenterInfoBar>
  );
}
