import React, { useState, useEffect } from 'react';
import { useMount, useUnmount } from 'ahooks';
// import get from 'lodash/get';
import { useRouter } from 'next/router';
import has from 'lodash/has';
import Head from 'next/head';
import get from 'lodash/get';
// import queryString from 'query-string';

// components
import ConfigCreator from '@chatbot-test/components/UIConfig/configCreator/Index';
import Spinner from '@/chatbot-packages/ui/shared-components/Spinner';
import { message } from 'antd';

// hooks
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';

// utils
import { getLoginedProfileId } from '@/chatbot-packages/utils/auth.tsx';

// import 'antd/dist/antd.min.css';
let isShowedLoginMsg = false;
export default function Socket() {
  const router = useRouter();
  const { query } = router;
  const [backgroundImage, setBackgroundImage] = useState(
    'https://chatbot-demo.g.aitention.com/data-dev/static/ces/kiosk_expo_bg.jpg',
  );
  const [pageLoading, setPageLoading] = useState(true);
  const [isPasscodeOrProfileError /* , setIsPasscodeOrProfileError */] = useState(false);
  const { getFrontendProfileJson, setIsCreatorMode } = useProfileConfig();

  // const { isNeedFillBG, bgLeft, bgRight, bgWidth } = useMemo(() => {
  //   if (typeof window === 'undefined') {
  //     return {};
  //   }
  //   const showWidth = (windowInnerHeight * 16) / 9;
  //   const isNeedMirror = showWidth < windowInnerHeight;
  //   const diff = windowInnerHeight - showWidth;
  //   // 213.35 3413.3
  //   return {
  //     isNeedFillBG: isNeedMirror,
  //     bgLeft: !isNeedMirror ? 0 : diff / 2 - showWidth + 1,
  //     bgRight: !isNeedMirror ? 0 : showWidth + diff / 2 - 2,
  //     bgWidth: !isNeedMirror ? 0 : diff / 2 + 1,
  //   };
  // }, [windowInnerHeight]);

  useMount(() => {
    const profileId = getLoginedProfileId();
    setIsCreatorMode(true);
    if (profileId) {
      // getProfileConfig({
      //   onSuccess: (res) => {
      //     // Some neccessary props
      //     const modelId = get(res, ['data', 'modelId'], '');
      //     setPageLoading(false);
      //     setProfileConfigData(get(res, 'data', {}));
      //     if (modelId !== '') {
      //       // success
      //       const profileBoomerangType = get(res, ['data', 'responseWaitForBoomerangLoop'], false);
      //       setIsNewBoomerang(profileBoomerangType);
      //     } else {
      //       // error
      //       setIsPasscodeOrProfileError(true);
      //     }
      //   },
      //   onError: (err) => {
      //     console.log(err);
      //     setPageLoading(false);
      //     setIsPasscodeOrProfileError(true);
      //   },
      // });
      getFrontendProfileJson({
        onSuccess: (res) => {
          const backgroundImageUrl = get(res, ['data', 'basicConfig', 'backgroundImageUrl'], '');
          if (backgroundImageUrl) {
            setBackgroundImage(backgroundImageUrl);
          }
          setPageLoading(false);
        },
        onError: (err) => {
          console.log(err);
          setPageLoading(false);
          // setIsPasscodeOrProfileError(true);
        },
        profileId,
      });
    } else {
      setPageLoading(false);
    }
  });

  useUnmount(() => {
    setIsCreatorMode(false);
  });

  useEffect(() => {
    if (has(query, 'isLoginSuccess') && !isShowedLoginMsg) {
      const isLoginSuccess = query.isLoginSuccess === 'true';
      isShowedLoginMsg = true;
      if (isLoginSuccess) {
        message.success('Login success', 1);
      } else {
        message.warning('Login failed, please try again', 1);
      }
      router.replace('/uiStyleMaker');
    }
  }, [query, router]);

  return (
    <>
      <Head>
        <title>Frontend Style Maker</title>
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
      ) : isPasscodeOrProfileError ? (
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
          <p
            style={{
              color: 'white',
              fontSize: '30px',
            }}
          >
            The service name or the passcode is not correct. Please check the URL.
          </p>
        </div>
      ) : (
        <>
          <ConfigCreator backgroundImage={backgroundImage} />
        </>
      )}
    </>
  );
}
