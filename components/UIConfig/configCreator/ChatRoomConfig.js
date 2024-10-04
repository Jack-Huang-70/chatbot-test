import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import noop from 'lodash/noop';
import get from 'lodash/get';

// components
import { Divider, Input, Select, Space, Button, Checkbox, message } from 'antd';
import UserAuthChecker from './UserAuthChecker';

// hooks
import { useMount } from 'ahooks';
import { ROOM_ID } from '@/chatbot-packages/hooks/core/socket/useOpenSocket';
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';

// utils
import localStorageOrCookiesHandler from '@/chatbot-packages/utils/localStorageOrCookiesHandler';
import { checkUserAuth } from '@/chatbot-packages/utils/auth/checkAuth';

// styles
import { CopyOutlined } from '@ant-design/icons';

const StyledConfigSection = styled.section`
  position: relative;
  padding: 16px;
  background-color: #fff;

  .close-button {
    position: absolute;
    top: 8px;
    right: 4px;
    border: none;

    > a {
      color: #000;
    }
  }

  p {
    display: flex;
    align-items: center;
    min-width: 70px;
    margin: 0px;
    margin-right: 8px;
  }

  > section {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  .room-id-wrap {
    display: flex;
    margin-right: 16px;
  }

  .common-input-wrap {
    display: flex;
    align-items: center;
    margin-right: 16px;
    .ant-input-group {
      display: flex;
      align-items: center;

      .ant-input {
        width: 150px;
      }
    }
  }

  .long-input-wrap {
    display: flex;
    align-items: center;
    margin-right: 16px;
    width: 100%;
    .ant-input-group {
      display: flex;
      align-items: center;

      .ant-input {
        width: 100%;
      }
    }
  }

  .category-section {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 8px;
    border: 1px solid lightgray;
    border-radius: 6px;

    .box-wrap {
      display: flex;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0px;
      }
    }
  }

  .common-url-section {
    .common-url-wrap {
      display: flex;
      align-items: center;
      margin-right: 16px;

      > p {
        min-width: 124px;
      }

      .ant-input-group {
        display: flex;
        align-items: center;

        .ant-input {
          width: 300px;
        }
      }
    }
  }

  .buttons-section {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;

export default function ChatRoomConfig({
  isShowPresenterPreviewState,
  isConnectionValid = true,
  onPresenterPreviewSelect = noop,
  // onConnectClick = noop,
  onDisconnectClick = noop,
}) {
  const [isShowProfile, setIsShowProfile] = useState(false);

  // const [isShowPresenterViewState, setIsShowPresenterViewState] = useState();
  const [selectedRoomId, setSelectedRoomId] = useState(ROOM_ID);
  const [newRoomId, setNewRoomId] = useState('');
  const [roomIdArray, setRoomIdArray] = useState(['Room1']);
  const [checked, setChecked] = useState(false);
  const [socketUrlState, setsocketUrlState] = useState(process.env.NEXT_PUBLIC_SOCKET_URL_CHATROOM);
  const [videoDomainChecked, setVideoDomainChecked] = useState(false);
  const [videoDomainState, setVideoDomainState] = useState(
    process.env.NEXT_PUBLIC_VIDEO_DOMAIN_CHATROOM,
  );

  const [boomerangUrlChecked, setBoomerangUrlChecked] = useState(false);
  const [boomerangUrlState, setBoomerangUrlState] = useState('');

  const [iconUrlChecked, setIconUrlChecked] = useState(false);
  const [iconUrlState, setIconUrlState] = useState('');

  const [companyLogoUrlChecked, setCompanyLogoUrlChecked] = useState(false);
  const [companyLogoUrlState, setCompanyLogoUrlState] = useState('');
  const [backgroundImageUrlState, setBackgroundImageUrlState] = useState('');

  const [styleConfigChecked, setStyleConfigChecked] = useState(false);
  const [styleConfigState, setStyleConfigState] = useState('');

  const [isShowChatHistory, setIsShowChatHistory] = useState('hide');
  const [isContinuousRecordState, setIsContinuousRecordState] = useState(true);
  const [modelIdState, setModelIdState] = useState('');
  const [voiceIdState, setVoiceIdState] = useState('');
  const [languageCodeState, setLanguageCodeState] = useState('en-US');
  const [presenterNameState, setPresenterNameState] = useState('');
  const [showPlayBackState, setShowPlayBackState] = useState(false);
  const [disableInputWhenPlayingState, setDisableInputWhenPlayingState] = useState(false);
  const [responseWaitForBoomerangLoopState, setResponseWaitForBoomerangLoopState] = useState(false);
  const [showClearChatState, setShowClearChatState] = useState(false);
  const [isNeedAlphaChannelState, setIsNeedAlphaChannelState] = useState(false);
  const [waitingMessageFrameState, setWaitingMessageFrameState] = useState(100);

  const [passcodeState, setPasscodeState] = useState('');
  const [initialBotIdState, setInitialBotIdState] = useState('');
  const [botPressBotIdState, setBotPressBotIdState] = useState('');
  const [modelIdOptionArray, setModelIdOptionArray] = useState([]);
  const [voiceIdOptionArray, setVoiceIdOptionArray] = useState([]);
  const [languageCodeArray, setLanguageCodeArray] = useState([]);
  const [initialBotIdArray, setInitialBotIdArray] = useState([]);
  const [botPressBotIdArray, setBotPressBotIdArray] = useState([]);
  const [profileIdArray, setProfileIdArray] = useState([]);
  const [newProfileId, setNewProfileId] = useState('');
  const [genericBotPromptState, setGenericBotPromptState] = useState('');
  const [funBotPromptState, setFunBotPromptState] = useState('');
  const [genericBotModelState, setGenericBotModelState] = useState('');
  const [funBotModelState, setFunBotModelState] = useState('');
  const [genericBotModelArray, setGenericBotModelArray] = useState([]);
  const [funBotModelArray, setFunBotModelArray] = useState([]);
  const [defaultFirstMessageState, setDefaultFirstMessageState] = useState('');
  // const [isSlowNetworkModeState, setIsSlowNetworkModeState] = useState(false);
  const [companyNameState, setCompanyNameState] = useState('');
  const [lipSyncEndpointState, setLipSyncEndpointState] = useState('');
  const [lipSyncEndpointOptionArray, setLipSyncEndpointOptionArray] = useState([]);
  const [newLipSyncEndpoint, setNewLipSyncEndpoint] = useState('');
  const [normalizeState, setNormalizeState] = useState('');
  const [normalizeOptionArray, setNormalizeOptionArray] = useState([]);
  const [botEngineState, setBotEngineState] = useState('');
  const [botEngineOptionArray, setBotEngineOptionArray] = useState([]);

  const { getProfileConfig, updateProfileConfig, getProfileOption, serviceName, passcode } =
    useProfileConfig();

  const dropdownRenderCallback = useCallback(
    (menu) => (
      <>
        {menu}

        <Divider
          style={{
            margin: '8px 0',
          }}
        />
        <Space
          style={{
            padding: '0 8px 4px',
          }}
        >
          <Input
            value={newRoomId}
            onChange={(evt) => {
              setNewRoomId(evt.target.value);
            }}
            onPressEnter={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();

              const next = [...roomIdArray, evt.target.value];

              setRoomIdArray(next);
              setNewRoomId('');

              localStorageOrCookiesHandler({
                method: 'set',
                key: 'chatRoomSelectedRoomArray',
                value: next,
              });
            }}
          />

          <Button
            type="primary"
            onClick={(evt) => {
              evt.preventDefault();

              const next = [...roomIdArray, newRoomId];

              setRoomIdArray(next);
              setNewRoomId('');

              localStorageOrCookiesHandler({
                method: 'set',
                key: 'chatRoomSelectRoomArray',
                value: next,
              });
            }}
          >
            Add
          </Button>
        </Space>
      </>
    ),
    [newRoomId, roomIdArray],
  );

  const profileCustomDropdownCallback = useCallback(
    (menu) => (
      <>
        {menu}

        <Divider
          style={{
            margin: '8px 0',
          }}
        />
        <Space
          style={{
            padding: '0 8px 4px',
          }}
        >
          <Input
            value={newProfileId}
            onChange={(evt) => {
              setNewProfileId(evt.target.value);
            }}
            onPressEnter={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();

              const next = [...profileIdArray, evt.target.value];

              setProfileIdArray(next);
              setNewProfileId('');
            }}
          />

          <Button
            type="primary"
            onClick={(evt) => {
              evt.preventDefault();

              const next = [...profileIdArray, newProfileId];

              setProfileIdArray(next);
              setNewProfileId('');
            }}
          >
            Add
          </Button>
        </Space>
      </>
    ),
    [newProfileId, profileIdArray],
  );

  const lipSyncEndpointCustomDropdownCallback = useCallback(
    (menu) => (
      <div style={{ width: '100%' }}>
        {menu}

        <Divider
          style={{
            margin: '8px 0',
          }}
        />
        <div style={{ display: 'flex' }}>
          <Input
            value={newLipSyncEndpoint}
            style={{
              width: '100%',
              marginRight: '16px',
            }}
            onChange={(evt) => {
              setNewLipSyncEndpoint(evt.target.value);
            }}
            onPressEnter={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();

              const next = [...lipSyncEndpointOptionArray, evt.target.value];

              setLipSyncEndpointOptionArray(next);
              setNewLipSyncEndpoint('');
            }}
          />

          <Button
            type="primary"
            style={{
              marginRight: '16px',
            }}
            onClick={(evt) => {
              evt.preventDefault();

              const next = [...lipSyncEndpointOptionArray, newLipSyncEndpoint];

              setLipSyncEndpointOptionArray(next);
              setNewLipSyncEndpoint('');
            }}
          >
            Add
          </Button>
        </div>
      </div>
    ),
    [lipSyncEndpointOptionArray, newLipSyncEndpoint],
  );

  const copyTheSelectedValue = useCallback((value = '') => {
    navigator.clipboard.writeText(value).then(
      () => {
        console.log('Copying to clipboard was successful!');
        message.success('Copying to clipboard was successful!');
      },
      (err) => {
        console.error('Could not copy value', err);
        message.error('Could not copy value', err);
      },
    );
  }, []);
  // useEffect(() => {
  //   onConfigHeightChange(height);
  // }, [height, onConfigHeightChange]);

  useMount(() => {
    const selectedRoomIdFromCache = localStorageOrCookiesHandler({
      method: 'get',
      key: 'chatRoomSelectedRoomId',
    });

    if (selectedRoomIdFromCache) {
      setSelectedRoomId(selectedRoomIdFromCache);
    }

    const roomIdArrayFromCache = localStorageOrCookiesHandler({
      method: 'get',
      key: 'chatRoomSelectedRoomArray',
    });

    if (roomIdArrayFromCache) {
      setRoomIdArray(roomIdArrayFromCache.split(','));
    }

    // const isSlowNetworkModeFromCache = localStorageOrCookiesHandler({
    //   method: 'get',
    //   key: 'isSlowNetworkMode',
    // });

    // if (isSlowNetworkModeFromCache) {
    //   setIsSlowNetworkModeState(isSlowNetworkModeFromCache === 'true');
    // }

    getProfileConfig({
      onSuccess: (res) => {
        const profile = get(res, 'data', {});
        setModelIdState(get(profile, 'modelId', ''));
        setVoiceIdState(get(profile, 'voiceId', ''));
        setPasscodeState(get(profile, 'passcode', ''));
        setPresenterNameState(get(profile, 'presenterName', ''));
        setsocketUrlState(get(profile, 'socketUrl', ''));
        setVideoDomainState(get(profile, 'videoDomain', ''));
        setBoomerangUrlState(get(profile, 'boomerangUrl', ''));
        setIconUrlState(get(profile, 'presenterIconUrl', ''));
        setCompanyLogoUrlState(get(profile, 'companyLogoUrl', ''));
        setBackgroundImageUrlState(get(profile, 'backgroundImageUrl', ''));
        setStyleConfigState(get(profile, 'styleConfig', ''));
        setLanguageCodeState(get(profile, 'language', 'en-US'));
        const isShowPresenter = get(profile, 'isDisplayPresenter', true);
        onPresenterPreviewSelect(isShowPresenter ? 'show' : 'hide');
        const isShowChatHistory = get(profile, 'showChatHistory', false);
        setIsShowChatHistory(isShowChatHistory ? 'show' : 'hide');
        setIsContinuousRecordState(get(profile, 'continuousRecord', true));
        setShowPlayBackState(get(profile, 'showPlayBack', false));
        setDisableInputWhenPlayingState(get(profile, 'disableInputWhenPlaying', false));
        setResponseWaitForBoomerangLoopState(get(profile, 'responseWaitForBoomerangLoop', true));
        setShowClearChatState(get(profile, 'showClearChatButton', true));
        setIsNeedAlphaChannelState(get(profile, 'isNeedAlphaChannel', false));
        setWaitingMessageFrameState(get(profile, 'waitingMessageFrame', 100));
        setInitialBotIdState(get(profile, 'initialBotId', ''));
        setBotPressBotIdState(get(profile, 'botPressBotId', ''));
        setGenericBotPromptState(get(profile, 'genericBotPrompt', ''));
        setFunBotPromptState(get(profile, 'funBotPrompt', ''));
        setGenericBotModelState(get(profile, 'genericBotModel', ''));
        setFunBotModelState(get(profile, 'funBotModel', ''));
        setDefaultFirstMessageState(get(profile, 'defaultFirstMessage', ''));
        setCompanyNameState(get(profile, 'companyName', ''));
        setLipSyncEndpointState(get(profile, 'lipSyncEndpoint', ''));
        setNormalizeState(get(profile, 'normalize', ''));
        setBotEngineState(get(profile, 'botEngine', ''));
      },
    });
    getProfileOption({
      onSuccess: (res) => {
        const option = get(res, 'data', {});
        setModelIdOptionArray(get(option, 'modelId', []));
        setVoiceIdOptionArray(get(option, 'voiceId', []));
        setLanguageCodeArray(get(option, 'language', []));
        setInitialBotIdArray(get(option, 'initialBotIdList', []));
        setBotPressBotIdArray(get(option, 'botPressBotIdList', []));
        setProfileIdArray(get(option, 'profile', []));
        setGenericBotModelArray(get(option, 'genericBotModel', []));
        setFunBotModelArray(get(option, 'funBotModel', []));
        setLipSyncEndpointOptionArray(get(option, 'lipSyncEndpoint', []));
        setNormalizeOptionArray(get(option, 'normalize', []));
        setBotEngineOptionArray(get(option, 'botEngine', []));
      },
    });
  });

  return (
    <StyledConfigSection className="config-section">
      {!isShowProfile ? (
        <UserAuthChecker
          onSubmit={(username, password) => setIsShowProfile(checkUserAuth(username, password))}
        />
      ) : (
        <>
          <section>
            <p>Profile:</p>
            <Select
              style={{
                width: 200,
              }}
              placeholder="Change Profile"
              dropdownRender={profileCustomDropdownCallback}
              value={serviceName}
              onChange={(value) => {
                window.location.href = `${window.location.origin}/?service=${value}&passcode=plab-passcode`;
              }}
            >
              {profileIdArray.map((value) => (
                <Select.Option key={value}>{value}</Select.Option>
              ))}
            </Select>
            <div className="common-input-wrap">
              <p style={{ width: '188px', marginLeft: '16px' }}>Passcode:</p>
              <Input.Group compact>
                <Input
                  value={passcodeState}
                  onChange={(evt) => {
                    setPasscodeState(evt.target.value);
                  }}
                />
              </Input.Group>
            </div>
          </section>

          <section>
            <div className="room-id-wrap">
              <p>Room id:</p>

              <Select
                style={{
                  width: 200,
                }}
                placeholder="select room id"
                dropdownRender={dropdownRenderCallback}
                value={selectedRoomId}
                onChange={(value) => {
                  setSelectedRoomId(value);
                }}
              >
                {roomIdArray.map((value) => (
                  <Select.Option key={value}>{value}</Select.Option>
                ))}
              </Select>
            </div>

            {/* <p style={{ marginLeft: '16px' }}>Slow Network Mode: </p>

            <Checkbox
              checked={isSlowNetworkModeState}
              onChange={() => {
                setIsSlowNetworkModeState(!isSlowNetworkModeState);
              }}
            /> */}
            <p>Show Chat History:</p>

            <Select
              style={{
                width: 160,
              }}
              value={isShowChatHistory}
              onChange={(value) => {
                setIsShowChatHistory(value);
              }}
            >
              <Select.Option value="show">Show chat history</Select.Option>
              <Select.Option value="hide">Hide chat history</Select.Option>
            </Select>
          </section>

          <section className="category-section presenter-setting-section">
            <div className="box-wrap">
              <div className="common-input-wrap">
                <p>Presenter:</p>

                <Select
                  defaultValue=""
                  style={{
                    width: 120,
                    marginRight: '16px',
                  }}
                  value={isShowPresenterPreviewState ? 'show' : 'hide'}
                  onChange={(value) => {
                    onPresenterPreviewSelect(value);
                  }}
                >
                  <Select.Option value="show">Show</Select.Option>
                  <Select.Option value="hide">Hide</Select.Option>
                  <Select.Option value="newTab">New Tab</Select.Option>
                </Select>
              </div>

              <div className="common-input-wrap">
                <p style={{ width: '188px' }}>Presenter Name:</p>
                <Input.Group compact>
                  <Input
                    value={presenterNameState}
                    onChange={(evt) => {
                      setPresenterNameState(evt.target.value);
                    }}
                  />
                </Input.Group>
              </div>
              <div className="common-input-wrap">
                <p>Language:</p>
                <Select
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Language"
                  value={languageCodeState}
                  onChange={(value) => {
                    setLanguageCodeState(value);
                  }}
                >
                  {languageCodeArray.map((value) => (
                    <Select.Option key={value}>{value}</Select.Option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="box-wrap">
              <div className="common-input-wrap">
                <p>Presenter Id:</p>
                <Select
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Presenter Id"
                  value={modelIdState}
                  onChange={(value) => {
                    setModelIdState(value);
                  }}
                >
                  {modelIdOptionArray.map((value) => (
                    <Select.Option key={value}>{value}</Select.Option>
                  ))}
                </Select>
              </div>
              <div className="common-input-wrap">
                <p>Voice Id:</p>
                <Select
                  style={{
                    width: 200,
                  }}
                  placeholder="Select Voice Id"
                  value={voiceIdState}
                  onChange={(value) => {
                    setVoiceIdState(value);
                  }}
                >
                  {voiceIdOptionArray.map((value) => (
                    <Select.Option key={value}>{value}</Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          </section>

          <section className="category-section common-url-section">
            <div className="box-wrap">
              <div className="common-url-wrap">
                <p>Socket Url:</p>

                <Checkbox
                  checked={checked}
                  style={{
                    marginRight: '8px',
                  }}
                  onChange={() => {
                    setChecked(!checked);
                  }}
                />

                <Input.Group compact>
                  <Input
                    disabled={!checked}
                    value={socketUrlState}
                    onChange={(evt) => {
                      setsocketUrlState(evt.target.value);
                    }}
                  />
                </Input.Group>
              </div>

              <div className="common-url-wrap">
                <p>Video Domain:</p>

                <Checkbox
                  checked={videoDomainChecked}
                  style={{
                    marginRight: '8px',
                  }}
                  onChange={() => {
                    setVideoDomainChecked(!videoDomainChecked);
                  }}
                />

                <Input.Group compact>
                  <Input
                    disabled={!videoDomainChecked}
                    value={videoDomainState}
                    onChange={(evt) => {
                      setVideoDomainState(evt.target.value);
                    }}
                  />
                </Input.Group>
              </div>
            </div>

            <div className="box-wrap">
              <div className="common-url-wrap">
                <p style={{ width: '140px' }}>Boomerang url:</p>

                <Checkbox
                  checked={boomerangUrlChecked}
                  style={{
                    marginRight: '8px',
                  }}
                  onChange={() => {
                    setBoomerangUrlChecked(!boomerangUrlChecked);
                  }}
                />

                <Input.Group compact>
                  <Input
                    disabled={!boomerangUrlChecked}
                    value={boomerangUrlState}
                    onChange={(evt) => {
                      setBoomerangUrlState(evt.target.value);
                    }}
                  />
                </Input.Group>
              </div>

              <div className="common-url-wrap">
                <p style={{ width: '180px' }}>Presenter Icon Url:</p>

                <Checkbox
                  checked={iconUrlChecked}
                  style={{
                    marginRight: '8px',
                  }}
                  onChange={() => {
                    setIconUrlChecked(!iconUrlChecked);
                  }}
                />

                <Input.Group compact>
                  <Input
                    disabled={!iconUrlChecked}
                    value={iconUrlState}
                    onChange={(evt) => {
                      setIconUrlState(evt.target.value);
                    }}
                  />
                </Input.Group>
              </div>
            </div>
            <div className="box-wrap">
              <div className="common-url-wrap">
                <p style={{ width: '140px' }}>Company Logo url:</p>

                <Checkbox
                  checked={companyLogoUrlChecked}
                  style={{
                    marginRight: '8px',
                  }}
                  onChange={() => {
                    setCompanyLogoUrlChecked(!companyLogoUrlChecked);
                  }}
                />

                <Input.Group compact>
                  <Input
                    disabled={!companyLogoUrlChecked}
                    value={companyLogoUrlState}
                    onChange={(evt) => {
                      setCompanyLogoUrlState(evt.target.value);
                    }}
                  />
                </Input.Group>
              </div>
              <div className="common-url-wrap">
                <p style={{ width: '140px' }}>Background Image url:</p>

                <Input.Group compact>
                  <Input
                    disabled={!isNeedAlphaChannelState}
                    value={backgroundImageUrlState}
                    onChange={(evt) => {
                      setBackgroundImageUrlState(evt.target.value);
                    }}
                  />
                </Input.Group>
              </div>
            </div>
            <div className="box-wrap">
              <div className="common-url-wrap">
                <p style={{ width: '140px' }}>Style config:</p>

                <Checkbox
                  checked={styleConfigChecked}
                  style={{
                    marginRight: '8px',
                  }}
                  onChange={() => {
                    setStyleConfigChecked(!styleConfigChecked);
                  }}
                />

                <Input.Group compact>
                  <Input
                    disabled={!styleConfigChecked}
                    value={styleConfigState}
                    onChange={(evt) => {
                      setStyleConfigState(evt.target.value);
                    }}
                  />
                </Input.Group>
              </div>
            </div>
          </section>

          <section className="category-section">
            <div className="box-wrap">
              <p>Continuous Record:</p>

              <Checkbox
                checked={isContinuousRecordState}
                style={{
                  marginRight: '8px',
                }}
                onChange={() => {
                  setIsContinuousRecordState(!isContinuousRecordState);
                }}
              />

              <p style={{ marginLeft: '16px' }}>Show Playback:</p>

              <Checkbox
                checked={showPlayBackState}
                style={{
                  marginRight: '8px',
                }}
                onChange={() => {
                  setShowPlayBackState(!showPlayBackState);
                }}
              />

              <p style={{ marginLeft: '16px' }}>Disable Input When Playing:</p>

              <Checkbox
                checked={disableInputWhenPlayingState}
                style={{
                  marginRight: '8px',
                }}
                onChange={() => {
                  setDisableInputWhenPlayingState(!disableInputWhenPlayingState);
                }}
              />
            </div>

            <div className="box-wrap">
              <p>Response Wait For Boomerang Loop:</p>

              <Checkbox
                checked={responseWaitForBoomerangLoopState}
                style={{
                  marginRight: '8px',
                }}
                onChange={() => {
                  setResponseWaitForBoomerangLoopState(!responseWaitForBoomerangLoopState);
                }}
              />

              <p style={{ marginLeft: '16px' }}>Show Clear Chat Button</p>

              <Checkbox
                checked={showClearChatState}
                style={{
                  marginRight: '8px',
                }}
                onChange={() => {
                  setShowClearChatState(!showClearChatState);
                }}
              />

              <p style={{ marginLeft: '16px' }}>Is Need Alpha Channel</p>

              <Checkbox
                checked={isNeedAlphaChannelState}
                style={{
                  marginRight: '8px',
                }}
                onChange={() => {
                  setIsNeedAlphaChannelState(!isNeedAlphaChannelState);
                }}
              />
            </div>
            <div className="box-wrap" style={{ alignItems: 'center' }}>
              <p>Play Waiting Message Frame: </p>
              <Input.Group
                compact
                style={{
                  width: '50px',
                }}
              >
                <Input
                  style={{
                    width: '50px',
                  }}
                  value={waitingMessageFrameState}
                  onChange={(evt) => {
                    setWaitingMessageFrameState(evt.target.value);
                  }}
                />
              </Input.Group>
            </div>
          </section>

          <section className="category-section">
            <div
              className="long-input-wrap"
              style={{
                marginBottom: '16px',
              }}
            >
              <p style={{ width: '167px' }}>Initial Bot Id:</p>
              <CopyOutlined
                style={{ marginRight: '8px' }}
                onClick={() => copyTheSelectedValue(initialBotIdState)}
              />
              <Select
                style={{
                  width: '100%',
                }}
                showSearch
                placeholder="Select Initial Bot Id"
                value={initialBotIdState}
                onChange={(value) => {
                  setInitialBotIdState(value);
                }}
              >
                {initialBotIdArray.map(({ id, name, type }) => (
                  <Select.Option key={id}>{`${type}-${name}`}</Select.Option>
                ))}
              </Select>
            </div>

            <div
              className="long-input-wrap"
              style={{
                marginBottom: '16px',
              }}
            >
              <p style={{ width: '167px' }}>Bot Press Bot Id:</p>
              <CopyOutlined
                style={{ marginRight: '8px' }}
                onClick={() => copyTheSelectedValue(botPressBotIdState)}
              />
              <Select
                showSearch
                style={{
                  width: '100%',
                }}
                placeholder="Select Bot Press Bot Id"
                value={botPressBotIdState}
                onChange={(value) => {
                  setBotPressBotIdState(value);
                }}
              >
                {botPressBotIdArray.map(({ id, name, type }) => (
                  <Select.Option key={id}>{`${type}-${name}`}</Select.Option>
                ))}
              </Select>
            </div>

            <div
              className="long-input-wrap"
              style={{
                marginBottom: '16px',
              }}
            >
              <p style={{ width: '190px' }}> Compnay Name :</p>
              <CopyOutlined
                style={{ marginRight: '8px' }}
                onClick={() => copyTheSelectedValue(companyNameState)}
              />
              <Input.Group compact>
                <Input
                  value={companyNameState}
                  onChange={(evt) => {
                    setCompanyNameState(evt.target.value);
                  }}
                />
              </Input.Group>
            </div>

            <div
              className="long-input-wrap"
              style={{
                marginBottom: '16px',
              }}
            >
              <p style={{ width: '190px' }}> Default First Message :</p>
              <CopyOutlined
                style={{ marginRight: '8px' }}
                onClick={() => copyTheSelectedValue(defaultFirstMessageState)}
              />
              <Input.Group compact>
                <Input
                  value={defaultFirstMessageState}
                  onChange={(evt) => {
                    setDefaultFirstMessageState(evt.target.value);
                  }}
                />
              </Input.Group>
            </div>

            <div
              className="long-input-wrap"
              style={{
                marginBottom: '16px',
              }}
            >
              <p style={{ width: '190px' }}> Generic Bot Prompt :</p>
              <CopyOutlined
                style={{ marginRight: '8px' }}
                onClick={() => copyTheSelectedValue(genericBotPromptState)}
              />
              <Input.Group compact>
                <Input
                  value={genericBotPromptState}
                  onChange={(evt) => {
                    setGenericBotPromptState(evt.target.value);
                  }}
                />
              </Input.Group>
            </div>

            <div
              className="long-input-wrap"
              style={{
                marginBottom: '16px',
              }}
            >
              <p style={{ width: '190px' }}>Fun Bot Prompt :</p>
              <CopyOutlined
                style={{ marginRight: '8px' }}
                onClick={() => copyTheSelectedValue(funBotPromptState)}
              />
              <Input.Group compact>
                <Input
                  value={funBotPromptState}
                  onChange={(evt) => {
                    setFunBotPromptState(evt.target.value);
                  }}
                />
              </Input.Group>
            </div>

            <div
              className="common-input-wrap"
              style={{
                marginBottom: '16px',
              }}
            >
              <p style={{ width: '166px' }}>Generic Bot Model:</p>
              <CopyOutlined
                style={{ marginRight: '8px' }}
                onClick={() => copyTheSelectedValue(genericBotModelState)}
              />
              <Select
                style={{
                  width: 600,
                }}
                showSearch
                placeholder="Select Generic Bot Model"
                value={genericBotModelState}
                onChange={(value) => {
                  setGenericBotModelState(value);
                }}
              >
                {genericBotModelArray.map((value) => (
                  <Select.Option key={value}>{value}</Select.Option>
                ))}
              </Select>
            </div>

            <div
              className="common-input-wrap"
              style={{
                marginBottom: '16px',
              }}
            >
              <p style={{ width: '166px' }}>Fun Bot Model:</p>
              <CopyOutlined
                style={{ marginRight: '8px' }}
                onClick={() => copyTheSelectedValue(funBotModelState)}
              />
              <Select
                style={{
                  width: 600,
                }}
                showSearch
                placeholder="Select Fun Bot Model"
                value={funBotModelState}
                onChange={(value) => {
                  setFunBotModelState(value);
                }}
              >
                {funBotModelArray.map((value) => (
                  <Select.Option key={value}>{value}</Select.Option>
                ))}
              </Select>
            </div>
            <div
              className="long-input-wrap"
              style={{
                marginBottom: '16px',
              }}
            >
              <p style={{ width: '166px' }}>Lip Sync Endpoint:</p>
              <CopyOutlined
                style={{ marginRight: '8px' }}
                onClick={() => copyTheSelectedValue(lipSyncEndpointState)}
              />
              <Select
                style={{
                  width: '100%',
                }}
                showSearch
                dropdownRender={lipSyncEndpointCustomDropdownCallback}
                placeholder="Select Lip Sync Endpoint"
                value={lipSyncEndpointState}
                onChange={(value) => {
                  setLipSyncEndpointState(value);
                }}
              >
                {lipSyncEndpointOptionArray.map((value) => (
                  <Select.Option key={value}>{value}</Select.Option>
                ))}
              </Select>
            </div>
            <div
              className="common-input-wrap"
              style={{
                marginBottom: '16px',
              }}
            >
              <p style={{ width: '166px' }}>Normalize:</p>
              <CopyOutlined
                style={{ marginRight: '8px' }}
                onClick={() => copyTheSelectedValue(normalizeState)}
              />
              <Select
                style={{
                  width: 600,
                }}
                showSearch
                placeholder="Select Normalize"
                value={normalizeState}
                onChange={(value) => {
                  setNormalizeState(value);
                }}
              >
                {normalizeOptionArray.map((value) => (
                  <Select.Option key={value}>{value}</Select.Option>
                ))}
              </Select>
            </div>
            <div
              className="common-input-wrap"
              style={{
                marginBottom: '16px',
              }}
            >
              <p style={{ width: '166px' }}>Bot Engine:</p>
              <CopyOutlined
                style={{ marginRight: '8px' }}
                onClick={() => copyTheSelectedValue(botEngineState)}
              />
              <Select
                style={{
                  width: 600,
                }}
                showSearch
                placeholder="Select Bot Engine"
                value={botEngineState}
                onChange={(value) => {
                  setBotEngineState(value);
                }}
              >
                {botEngineOptionArray.map((value) => (
                  <Select.Option key={value}>{value}</Select.Option>
                ))}
              </Select>
            </div>
          </section>

          <section className="buttons-section">
            <div>
              <Button
                danger
                disabled={!isConnectionValid}
                style={{
                  marginRight: '16px',
                }}
                onClick={onDisconnectClick}
              >
                Disconnect
              </Button>
            </div>

            <div>
              <Button
                type="primary"
                onClick={() => {
                  localStorageOrCookiesHandler({
                    method: 'set',
                    key: 'chatRoomSelectedRoomId',
                    value: selectedRoomId,
                  });

                  localStorageOrCookiesHandler({
                    method: 'set',
                    key: `${serviceName}_showPresenter`,
                    value: isShowPresenterPreviewState,
                  });

                  // localStorageOrCookiesHandler({
                  //   method: 'set',
                  //   key: `isSlowNetworkMode`,
                  //   value: isSlowNetworkModeState,
                  // });

                  const nextData = {
                    modelId: modelIdState,
                    voiceId: voiceIdState,
                    presenterName: presenterNameState,
                    passcode: passcodeState,
                    socketUrl: socketUrlState,
                    videoDomain: videoDomainState,
                    boomerangUrl: boomerangUrlState,
                    presenterIconUrl: iconUrlState,
                    companyLogoUrl: companyLogoUrlState,
                    backgroundImageUrl: backgroundImageUrlState,
                    styleConfig: styleConfigState,
                    language: languageCodeState,
                    // isDisplayPresenter: isShowPresenterPreviewState,
                    showChatHistory: isShowChatHistory === 'show',
                    continuousRecord: isContinuousRecordState,
                    showPlayBack: showPlayBackState,
                    disableInputWhenPlaying: disableInputWhenPlayingState,
                    responseWaitForBoomerangLoop: responseWaitForBoomerangLoopState,
                    showClearChatButton: showClearChatState,
                    isNeedAlphaChannel: isNeedAlphaChannelState,
                    waitingMessageFrame: waitingMessageFrameState,
                    initialBotId: initialBotIdState,
                    botPressBotId: botPressBotIdState,
                    genericBotPrompt: genericBotPromptState,
                    funBotPrompt: funBotPromptState,
                    genericBotModel: genericBotModelState,
                    funBotModel: funBotModelState,
                    defaultFirstMessage: defaultFirstMessageState,
                    companyName: companyNameState,
                    lipSyncEndpoint: lipSyncEndpointState,
                    normalize: normalizeState,
                    botEngine: botEngineState,
                  };
                  updateProfileConfig({
                    nextData,
                    onSuccess: () => {
                      window.location.href = `${window.location.origin}${
                        window.location.pathname
                      }?service=${serviceName}&passcode=${passcodeState || passcode}`;
                    },
                    onError: (err) => {
                      console.log(err);
                    },
                  });
                  // onConnectClick({
                  //   socketUrl: socketUrlState,
                  //   roomId: selectedRoomId,
                  // });
                }}
              >
                Update profile
              </Button>
            </div>
          </section>
        </>
      )}
    </StyledConfigSection>
  );
}
