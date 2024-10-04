import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// lodash
import get from 'lodash/get';

// hooks
import useCommonEntryLogic from '@/chatbot-packages/hooks/useCommonEntryLogic';

// components
import Head from 'next/head';
import Core from '@chatbot-test/core/Index';
import Spinner from '@/chatbot-packages/ui/shared-components/Spinner';

const ChatbotTypeEntry = () => {
  const router = useRouter();
  const query = get(router, 'query', {});

  const { chatbotType, isFullScreenChatbotOnMobile, eventActive } = useMemo(() => {
    return {
      chatbotType: get(query, 'chatbotType', ''),
      isFullScreenChatbotOnMobile: get(query, 'isFullScreenChatbotOnMobile', false),
      eventActive: get(query, 'eventActive', false),
    };
  }, [query]);

  const [nextChatbotType, setNextChatbotType] = useState('');

  useEffect(() => {
    setNextChatbotType(chatbotType);
  }, [chatbotType]);

  const { authToken, pageLoading, profileConfig, kioskConfig } =
    useCommonEntryLogic(nextChatbotType);

  const renderCoreComponent = useCallback(() => {
    const props = {
      profileConfigData: profileConfig,
      customAuthToken: authToken,
      isEventActive: eventActive,
      // Here is to control which waiting Message logic you need, it would be no waiting message if = '' or not included below 3 types,
      // Type = ['bySend','byMessage','byFrame']
      // Detail: https://www.notion.so/pantheonlab/Waiting-Message-Logic-0e43922aa462480c8801bc4cc70b227a
      waitingMessageLogicType: '',
    };

    switch (chatbotType) {
      case 'desktop':
        return (
          <Core
            isDesktop={true}
            isFullScreenChatbotOnMobile={isFullScreenChatbotOnMobile}
            {...props}
          />
        );
      case 'widget':
        return (
          <Core
            isWidget={true}
            isFullScreenChatbotOnMobile={isFullScreenChatbotOnMobile}
            {...props}
          />
        );
      case 'vertical':
        return (
          <>
            <Core isVertical={true} newKioskCustomConfig={kioskConfig} {...props} />
          </>
        );
      default:
        return null;
    }
  }, [
    authToken,
    chatbotType,
    isFullScreenChatbotOnMobile,
    kioskConfig,
    profileConfig,
    eventActive,
  ]);

  return (
    <>
      <Head>
        <title>Pantheon Lab Digital Assistant</title>
      </Head>
      {pageLoading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100%',
            backgroundColor: 'dimgray',
            opacity: '0.5',
            borderRadius: '16px',
          }}
        >
          <Spinner />
        </div>
      ) : (
        renderCoreComponent()
      )}
    </>
  );
};

export default ChatbotTypeEntry;
