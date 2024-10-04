import React from 'react';
import { useRouter } from 'next/router';

// lodash
import get from 'lodash/get';

// components
import { Button, Result } from 'antd';

// utils
import getAcceptableChatbotTypeArray from '@/chatbot-packages/utils/getAcceptableChatbotTypeArray';

const AppNotFound = () => {
  const router = useRouter();

  const acceptableChatbotTypeArray = getAcceptableChatbotTypeArray();
  const route = get(acceptableChatbotTypeArray, [0], '');

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button
          type="primary"
          onClick={() => {
            router.replace(`/${route}`);
          }}
        >
          Back Home
        </Button>
      }
    />
  );
};
export default AppNotFound;
