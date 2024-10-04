/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { useMount } from 'ahooks';
// import get from 'lodash/get';
import { useRouter } from 'next/router';
import has from 'lodash/has';
import Head from 'next/head';
import axios from 'axios';

import { message, Input, Select } from 'antd';
import Spinner from '@/chatbot-packages/ui/shared-components/Spinner';

// utils
import { clearAuth, getUserToken, setAuth, setProfileId } from '@/chatbot-packages/utils/auth.tsx';

// styles
const StyledLoginPage = styled.div`
  .loading-panel {
    font-family: Lexend;
    font-size: 24px;
  }
  .header {
    height: 8vh;
    width: 100vw;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
  }
  .login-panel {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 92vh;
    p {
      text-align: center;
    }

    .welcoming-msg {
      font-family: Lexend;
      font-size: 20px;
      width: 30vw;
      height: 20vh;
    }
  }
  .loading-spinner {
    .ant-spin {
      .anticon {
        font-size: 14px !important;
      }
    }
  }
`;

let isShowedLoginMsg = false;
export default function Socket() {
  const router = useRouter();
  const { query } = router;

  const [isPageLoading, setIsPageLoading] = useState(true);
  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  // const [loginProfileId, setLoginProfileId] = useState('');
  const [isLogined, setIsLogined] = useState(false);
  const [customRedirectUrl, setCustomRedirectUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [profileIdArray, setProfileIdArray] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    if (has(query, 'isLoginSuccess') && !isShowedLoginMsg) {
      const isLoginSuccess = query.isLoginSuccess === 'true';
      isShowedLoginMsg = true;
      if (isLoginSuccess) {
        message.success('Login success', 1);
      } else {
        message.warning('Login failed, please try again', 1);
      }
      router.replace('/');
    }
  }, [query, router]);

  useEffect(() => {
    // if (has(query, 'profile')) {
    //   setLoginProfileId(query.profile);
    // }
    if (has(query, 'subpath')) {
      setCustomRedirectUrl(query.subpath);
    }
  }, [query, router]);

  useEffect(() => {
    if (authToken) {
      const config = {
        method: 'get',
        maxBodyLength: Infinity, // url: 'http://localhost:8801/v1/oauth/signin',
        url: `${process.env.NEXT_PUBLIC_LOGIN_SERVER_URL}/v1/user/data`,
        // ?timestamp=${Date.now()}
        headers: {
          // Origin: 'http://test.plab.ai',
          Authorization: `Bearer ${authToken}`,
        },
      };
      setIsProfileLoading(true);
      axios
        .request(config)
        .then((response) => {
          if (response?.data && response?.status === 200) {
            const dataArray = response.data.profiles || [];
            const processedArray = dataArray
              .map((profileData) => {
                const { is_active, name, profile_id } = profileData;
                if (is_active && profile_id) {
                  return { name: name || profile_id, profileId: profile_id };
                }
                return null;
              })
              .filter((v) => v);
            setProfileIdArray(processedArray);
            if (processedArray.length > 0) {
              setSelectedProfileId(processedArray[0]?.profileId || '');
            }
          }
          setIsProfileLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsProfileLoading(false);
        });
    }
  }, [authToken]);

  useMount(async () => {
    const userAuthToken = await getUserToken();
    if (userAuthToken) {
      setIsLogined(true);
      setAuthToken(userAuthToken);
      setIsPageLoading(false);
    } else {
      setIsLogined(false);
      setAuthToken('');
      setIsPageLoading(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Real Time Digital Human Chat - AIDOL Assistant - Login</title>
      </Head>
      <StyledLoginPage>
        {isPageLoading ? (
          <div className="loading-panel">Loading... ...</div>
        ) : (
          <>
            <div className="header">
              <img
                src="/test/assets/assistantLogo.svg"
                alt="aidol-assist-logo"
                style={{
                  height: '4vh',
                  margin: 'auto',
                }}
              />
            </div>

            <div className="login-panel">
              <div className="welcoming-msg">
                <p style={{ marginBottom: '24px' }}>Welcome to AIDOL Assistant!</p>
                <p>Please Login to start your wonderful Digital assistant.</p>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 'auto',
                }}
              >
                {isLogined ? (
                  <>
                    <div
                      style={{
                        height: '72px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginBottom: '24px',
                        width: '30vw',
                      }}
                    >
                      {isProfileLoading ? (
                        <p style={{ fontFamily: 'Lexend', width: '100%', textAlign: 'center' }}>
                          Loading Profile Data...
                        </p>
                      ) : profileIdArray.length === 0 ? (
                        <p style={{ fontFamily: 'Lexend' }}>
                          {`Sorry, it seems that your don't have any profile access right, please
                          contact to Aidol team.`}
                        </p>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          <Select
                            style={{
                              maxWidth: '300px',
                              width: '100%',
                            }}
                            placeholder="Change Profile"
                            value={selectedProfileId}
                            onChange={(value) => {
                              setSelectedProfileId(value);
                            }}
                          >
                            {profileIdArray.map(({ name, profileId }) => (
                              <Select.Option key={profileId} value={profileId}>
                                <p
                                  style={{
                                    fontSize: '20px',
                                    fontFamily: 'Lexend',
                                  }}
                                >
                                  {name}
                                </p>
                              </Select.Option>
                            ))}
                          </Select>
                          <button
                            type="button"
                            style={{
                              backgroundColor: '#0057A3',
                              border: '1px solid gray',
                              borderRadius: '16px',
                              padding: '12px',
                            }}
                            onClick={() => {
                              setProfileId(selectedProfileId);
                              window.location.href = customRedirectUrl
                                ? `/${customRedirectUrl}`
                                : '/assistant';
                            }}
                          >
                            <p style={{ fontFamily: 'Lexend', color: 'white' }}>Connect!</p>
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      style={{
                        // backgroundColor: '#0057A3',
                        border: '1px solid gray',
                        borderRadius: '16px',
                        padding: '12px',
                      }}
                      onClick={() => {
                        setIsLogined(false);
                        clearAuth();
                        setAuthToken('');
                        setProfileIdArray('');
                        setProfileId('');
                      }}
                    >
                      <p style={{ fontFamily: 'Lexend' }}>Logout</p>
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        height: '72px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginBottom: '24px',
                        width: '30vw',
                      }}
                    >
                      <p
                        style={{
                          marginRight: '16px',
                          minWidth: '80px',
                          fontFamily: 'Lexend',
                          textAlign: 'left',
                        }}
                      >
                        Email:{' '}
                      </p>
                      <Input
                        style={{
                          height: '40px',
                        }}
                        value={loginEmail}
                        onChange={(evt) => {
                          setLoginEmail(evt.target.value);
                        }}
                      />
                    </div>
                    <div
                      style={{
                        height: '72px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginBottom: '24px',
                        width: '30vw',
                      }}
                    >
                      <p
                        style={{
                          marginRight: '16px',
                          minWidth: '80px',
                          fontFamily: 'Lexend',
                          textAlign: 'left',
                        }}
                      >
                        Password:
                      </p>
                      <Input
                        style={{
                          height: '40px',
                        }}
                        type="password"
                        value={loginPassword}
                        onChange={(evt) => {
                          setLoginPassword(evt.target.value);
                        }}
                      />
                    </div>
                    {/* <div
                      style={{
                        height: '72px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginBottom: '48px',
                        width: '30vw',
                      }}
                    >
                      <p
                        style={{
                          marginRight: '16px',
                          minWidth: '80px',
                          fontFamily: 'Lexend',
                          textAlign: 'left',
                        }}
                      >
                        Profile Id:
                      </p>
                      <Input
                        style={{
                          height: '40px',
                        }}
                        value={loginProfileId}
                        onChange={(evt) => {
                          setLoginProfileId(evt.target.value);
                        }}
                      />
                    </div> */}
                    <button
                      type="button"
                      disabled={isLoginLoading}
                      style={{
                        backgroundColor: '#0057A3',
                        border: '1px solid gray',
                        borderRadius: '16px',
                        padding: '12px',
                        width: '20vw',
                      }}
                      onClick={() => {
                        const config = {
                          method: 'post',
                          maxBodyLength: Infinity, // url: 'http://localhost:8801/v1/oauth/signin',
                          url: `${process.env.NEXT_PUBLIC_LOGIN_SERVER_URL}/v1/oauth/signin`,
                          headers: {
                            // Origin: 'http://test.plab.ai',
                            'Content-Type': 'application/json',
                          },
                          data: {
                            password: loginPassword,
                            email: loginEmail,
                            // profileId: loginProfileId,
                            // subpath: customRedirectUrl ? `/${customRedirectUrl}` : '/assistant',
                          },
                          maxRedirects: 0,
                          validateStatus: null,
                        };
                        setIsLoginLoading(true);
                        axios
                          .request(config)
                          .then((response) => {
                            if (response?.data && response?.status === 200) {
                              // window.location.href = response.data.url;
                              const { email, id, name, role, token } = response.data;
                              setAuthToken(token);
                              setIsLogined(true);
                              const query = {
                                token,
                                email,
                                id,
                                name,
                                role,
                              };
                              const user = JSON.parse(JSON.stringify(query));
                              setAuth(user);
                            } else {
                              console.error('Email or password error, please try again');
                              message.warning(
                                'Login failed, please check the email and password',
                                2,
                              );
                            }
                            setIsLoginLoading(false);
                          })
                          .catch((error) => {
                            setIsLoginLoading(false);
                            console.error(error);
                          });
                      }}
                    >
                      {isLoginLoading ? (
                        <div
                          className="loading-spinner"
                          style={{
                            fontSize: '8px',
                          }}
                        >
                          <Spinner />
                        </div>
                      ) : (
                        <p style={{ fontFamily: 'Lexend', color: 'white' }}>Login</p>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </StyledLoginPage>
    </>
  );
}
