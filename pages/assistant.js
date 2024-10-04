import React, { useState, useEffect } from 'react';
import { useMount } from 'ahooks';
import get from 'lodash/get';
import { useRouter } from 'next/router';
import has from 'lodash/has';
import Head from 'next/head';

// import queryString from 'query-string';
// ahooks

// components
import { message } from 'antd';
import Core from '@chatbot-test/core/Index';
import Spinner from '@/chatbot-packages/ui/shared-components/Spinner';

// hooks
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';

// utils
// import { getLoginedProfileId } from '@/chatbot-packages/utils/auth';

// import 'antd/dist/antd.min.css';
let isShowedLoginMsg = false;
export default function Socket() {
  const router = useRouter();
  const { query } = router;

  const [pageLoading, setPageLoading] = useState(true);
  const [
    isNewBoomerang,
    //setIsNewBoomerang
  ] = useState(false);
  const [profileConfigData, setProfileConfigData] = useState({});
  const [isPasscodeOrProfileError, setIsPasscodeOrProfileError] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(
    'https://chatbot-demo.g.aitention.com/data-dev/static/ces/kiosk_expo_bg.jpg',
  );
  const [pageTitle, setPageTitle] = useState('AIDOL Assistant');
  const [isNeedPrivacyPolicy, setIsNeedPrivacyPolicy] = useState(false);
  const [customDefaultLanguage, setCustomDefaultLanguage] = useState('en-US');
  const [isUseTWDomain, setIsUseTWDomain] = useState(false);
  const [isNeedFaceDetection, setIsNeedFaceDetection] = useState(false);
  const [isNeedMultipleLanguages, setIsNeedMultipleLanguages] = useState(false);
  const [isNeedChangeLanguageCommand, setIsNeedChangeLanguageCommand] = useState(false);

  const { getFrontendProfileJson } = useProfileConfig();

  useMount(() => {
    // #Chatbot_Build Step 1: update the profile Id to the project profileID
    const profileId = 'cVfUCBCfyKhUq3MxJ49qI';
    // const profileId = getLoginedProfileId();
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
      if (profileId === 'il_1OIi7yT1tMEPuCJimG') {
        setIsUseTWDomain(true);
      }
      getFrontendProfileJson({
        onSuccess: (res) => {
          console.log(res);
          const backgroundImageUrl = get(res, ['data', 'basicConfig', 'backgroundImageUrl'], '');
          const pageTitle = get(res, ['data', 'basicConfig', 'pageTitle'], '');
          const isNeedPrivacyPolicyConfig = get(
            res,
            ['data', 'basicConfig', 'isNeedPrivacyPolicy'],
            false,
          );
          const defaultLanguage = get(res, ['data', 'basicConfig', 'defaultLanguage'], 'en-US');
          const isNeedFaceDetectionCache = get(
            res,
            ['data', 'basicConfig', 'isNeedFaceDetection'],
            false,
          );
          const isNeedMultipleLanguagesCache = get(
            res,
            ['data', 'basicConfig', 'isNeedMultipleLanguages'],
            false,
          );
          const isEnableChangeLanguageCommand = get(
            res,
            ['data', 'basicConfig', 'isEnableChangeLanguageCommand'],
            false,
          );
          if (backgroundImageUrl) {
            setBackgroundImage(backgroundImageUrl);
          }
          if (pageTitle) {
            setPageTitle(pageTitle);
          }
          if (isNeedPrivacyPolicyConfig) {
            setIsNeedPrivacyPolicy(isNeedPrivacyPolicyConfig);
          }
          if (defaultLanguage) {
            setCustomDefaultLanguage(defaultLanguage);
          }
          if (isNeedFaceDetectionCache) {
            setIsNeedFaceDetection(isNeedFaceDetectionCache);
          }
          if (isNeedMultipleLanguagesCache) {
            setIsNeedMultipleLanguages(isNeedMultipleLanguagesCache);
          }
          if (isEnableChangeLanguageCommand) {
            setIsNeedChangeLanguageCommand(isEnableChangeLanguageCommand);
          }
          setProfileConfigData(res?.data || {});
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
      setIsPasscodeOrProfileError(true);
    }
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
      router.replace('/assistant');
    }
  }, [query, router]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
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
          <Core
            profileConfigData={profileConfigData}
            isWaitForResponseBoomerangMode={isNewBoomerang}
            isDesktop={true}
            isChatbotWidget={false}
            isVertical={false}
            isMultipleLanguages={false}
            backgroundImage={backgroundImage}
            isNeedPrivacyPolicy={isNeedPrivacyPolicy}
            customDefaultLanguage={customDefaultLanguage}
            isUseTWDomain={isUseTWDomain}
            isNeedFaceDetection={isNeedFaceDetection}
            isNeedMultipleLanguages={isNeedMultipleLanguages}
            isNeedChangeLanguageCommand={isNeedChangeLanguageCommand}
          />
        </>
      )}
    </>
  );
}
