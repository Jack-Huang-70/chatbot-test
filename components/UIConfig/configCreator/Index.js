/* eslint-disable no-unused-vars */
import React, { useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import Hotkeys from 'react-hot-keys';

// components
import { Select, Checkbox, Input, message } from 'antd';
import Core from '@chatbot-test/core/Index';

// contanst
import {
  FOR_DEMO_UI_CONFIG,
  TYPE_V1_UI_CONFIG,
  DEFAULT_DESKTOP_UI_CONFIG,
  TYPE_V1_RIGHT_UI_CONFIG,
  DEFAULT_VERTICAL_UI_CONFIG,
  DEFAULT_WIDGET_UI_CONFIG,
  MIDLAND_UI_CONFIG,
} from '@chatbot-test/components/UIConfig/defaultUIConfig/index';

// hooks
import useProfileConfig from '@/chatbot-packages/hooks/useProfileConfig';

const StyledConfigCreator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .config-panel-wrap ::-webkit-scrollbar {
    display: none;
  }
  .config-panel-wrap {
    position: absolute;
    z-index: 11;
    cursor: pointer;
    top: 24px;
    right: 8px;
    display: flex;
    height: 90%;
    div {
      height: 48px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 24px;
      padding: 14px 24px;
      border-radius: 1000px;
      border: solid 1px #d9d9d9;
      background-color: #fff;
      margin-right: 16px;
    }
    p {
      flex-grow: 0;
      font-family: Lexend;
      font-size: 16px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #232323;
      margin-bottom: 3px;
    }
    .control-config-panel ::-webkit-scrollbar {
      display: none;
    }
    .control-config-panel {
      width: 700px;
      height: 100%;
      border-radius: 4px;
      maxheight: 100vh;
      overflow: scroll;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .config-header {
        display: flex;
        border: none;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .config-selection {
        display: flex;
        border: none;
        margin-bottom: 4px;
      }
    }
  }
`;

export default function ConfigCreator({ backgroundImage = '' }) {
  const [creatorStyleConfigState, setCreatorStyleConfigState] = useState({});
  const [isShowWidgetMode, setIsShowWidgetMode] = useState(false);
  const [isShowKiosk, setIsShowKiosk] = useState(false);
  const [isOpenConfig, setIsOpenConfig] = useState(false);
  const [selectedDefaultProfile, setSelectedDefaultProfile] = useState('');
  const [showingTab, setShowingTab] = useState('chatRoomContentWrapStyle');
  const [showingClass, setShowingClass] = useState('Common');
  const [currentAddingKey, setCurrentAddingKey] = useState('');
  const [currentAddingValue, setCurrentAddingValue] = useState('');
  const [currentProfileId, setCurrentProfileId] = useState('');
  const [currentDesktopProfile, setCurrentDestopProfile] = useState({});
  const [currentKioskProfile, setCurrentKioskProfile] = useState({});
  const [currentWidgetProfile, setCurrentWidgetProfile] = useState({});
  const [updateTransparentStandingVideoCanvasState, setUpdateTransparentStandingVideoCanvasState] =
    useState(null);
  const { cachedProfileConfig, updateCreatorProfile } = useProfileConfig();

  useEffect(() => {
    if (selectedDefaultProfile === 'V1L') {
      setCreatorStyleConfigState(TYPE_V1_UI_CONFIG);
    } else if (selectedDefaultProfile === 'V1R') {
      setCreatorStyleConfigState(TYPE_V1_RIGHT_UI_CONFIG);
    } else if (selectedDefaultProfile === 'dm') {
      setCreatorStyleConfigState(FOR_DEMO_UI_CONFIG);
    } else if (selectedDefaultProfile === 'kiosk') {
      setCreatorStyleConfigState(DEFAULT_VERTICAL_UI_CONFIG);
    } else if (selectedDefaultProfile === 'widget') {
      setCreatorStyleConfigState(DEFAULT_WIDGET_UI_CONFIG);
    } else {
      setCreatorStyleConfigState(DEFAULT_DESKTOP_UI_CONFIG);
    }
    if (updateTransparentStandingVideoCanvasState) {
      setTimeout(() => {
        updateTransparentStandingVideoCanvasState();
      }, [100]);
    }
  }, [selectedDefaultProfile, updateTransparentStandingVideoCanvasState]);

  useEffect(() => {
    if (isShowKiosk) {
      setCurrentKioskProfile(creatorStyleConfigState);
      updateCreatorProfile('kiosk', creatorStyleConfigState);
    } else if (isShowWidgetMode) {
      setCurrentWidgetProfile(creatorStyleConfigState);
      updateCreatorProfile('widget', creatorStyleConfigState);
    } else {
      setCurrentDestopProfile(creatorStyleConfigState);
      updateCreatorProfile('desktop', creatorStyleConfigState);
    }
  }, [creatorStyleConfigState, isShowKiosk, isShowWidgetMode, updateCreatorProfile]);

  const showingContent = useMemo(() => {
    const targetData = get(
      creatorStyleConfigState,
      !isShowWidgetMode ? showingTab : ['widgetConfig', showingTab],
      {},
    );
    if (showingTab === 'common') {
      const commonData = [
        {
          label: 'Presenter Info',
          key: 'isShowPresenterInfo',
          value: get(creatorStyleConfigState, 'isShowPresenterInfo', false),
        },
        {
          label: 'Button Set',
          key: 'isShowButtonSet',
          value: get(creatorStyleConfigState, 'isShowButtonSet', false),
        },
        {
          label: 'Input Section Clear Button',
          key: 'isShowInputSectionClearButton',
          value: get(creatorStyleConfigState, 'isShowInputSectionClearButton', false),
        },
        {
          label: 'Input Section Input bar',
          key: 'isShowInputSectionInputBar',
          value: get(creatorStyleConfigState, 'isShowInputSectionInputBar', false),
        },
        {
          label: 'Presenter Icon Button Set',
          key: 'isShowPresenterIconButtonSet',
          value: get(creatorStyleConfigState, 'isShowPresenterIconButtonSet', false),
        },
        {
          label: 'Root Background Color',
          key: 'rootBackgroundColor',
          value: get(creatorStyleConfigState, 'rootBackgroundColor', '#ffffff'),
        },
      ];
      return commonData.map(({ label, key, value }) => {
        return key === 'rootBackgroundColor' ? (
          <div className="config-selection" key={label}>
            <p>{label}</p>
            <Input
              value={value}
              onChange={(evt) => {
                setCreatorStyleConfigState((prev) => {
                  return {
                    ...prev,
                    [key]: evt.target.value,
                  };
                });
              }}
            />
          </div>
        ) : (
          <div className="config-selection" key={label}>
            <p>{label}</p>
            <Checkbox
              checked={value}
              style={{
                marginRight: '8px',
              }}
              onChange={(evt) => {
                setCreatorStyleConfigState((prev) => {
                  return {
                    ...prev,
                    [key]: evt.target.checked,
                  };
                });
              }}
            />
          </div>
        );
      });
    }
    if (showingTab === 'widgetCommon') {
      const commonData = [
        {
          label: 'Is Hide DigitalHuman',
          key: 'isHideDigitalHuman',
          value: get(creatorStyleConfigState, 'isHideDigitalHuman', false),
        },
        {
          label: 'Default Language',
          key: 'defaultLanguage',
          value: get(creatorStyleConfigState, 'defaultLanguage', 'en-US'),
        },
        {
          label: 'Default First Message',
          key: 'defaultFirstMessage',
          value: get(creatorStyleConfigState, 'defaultFirstMessage', 'Hello'),
        },
      ];
      return commonData.map(({ label, key, value }) => {
        return key === 'isHideDigitalHuman' ? (
          <div className="config-selection" key={label}>
            <p>{label}</p>
            <Checkbox
              checked={value}
              style={{
                marginRight: '8px',
              }}
              onChange={(evt) => {
                setCreatorStyleConfigState((prev) => {
                  return {
                    ...prev,
                    [key]: evt.target.checked,
                  };
                });
              }}
            />
          </div>
        ) : (
          <div className="config-selection" key={label}>
            <p>{label}</p>
            <Input
              value={value}
              onChange={(evt) => {
                setCreatorStyleConfigState((prev) => {
                  return {
                    ...prev,
                    [key]: evt.target.value,
                  };
                });
              }}
            />
          </div>
        );
      });
    }
    const targetDataKeyArray = Object.keys(targetData);
    if (targetDataKeyArray.length > 0) {
      return targetDataKeyArray.map((key) => {
        const value = get(targetData, key, '');
        const isBooleanValue = isBoolean(value);
        if (key === 'sessionTimeFormat') {
          // This code use to prevent you change a wrong format and crash the config creator, you can comment this code to change it after you save the json you did.
          // And remember to enable back this code after you finish it.
          // Or you can just add this key inside widgetConfig->sessionStartTimeConfig into the generated JSON directly
          return (
            <div className="config-selection" key={key}>
              <p>
                {' '}
                {`${key}: Please enable it by search this String, will crash if format is wrong`}
              </p>
            </div>
          );
        }
        return (
          <div className="config-selection" key={key}>
            <p>{key}</p>
            {isBooleanValue ? (
              <Checkbox
                checked={get(targetData, key, false)}
                style={{
                  marginRight: '8px',
                }}
                onChange={(evt) => {
                  if (isShowWidgetMode) {
                    setCreatorStyleConfigState((prev) => {
                      return {
                        ...prev,
                        widgetConfig: {
                          ...get(prev, 'widgetConfig', {}),
                          [showingTab]: {
                            ...targetData,
                            [key]: evt.target.checked,
                          },
                        },
                      };
                    });
                  } else {
                    setCreatorStyleConfigState((prev) => {
                      return {
                        ...prev,
                        [showingTab]: {
                          ...targetData,
                          [key]: evt.target.checked,
                        },
                      };
                    });
                  }
                }}
              />
            ) : (
              <Input
                value={get(targetData, key, '')}
                onChange={(evt) => {
                  setCreatorStyleConfigState((prev) => {
                    if (isShowWidgetMode) {
                      return {
                        ...prev,
                        widgetConfig: {
                          ...get(prev, 'widgetConfig', {}),
                          [showingTab]: {
                            ...targetData,
                            [key]: evt.target.value,
                          },
                        },
                      };
                    }
                    return {
                      ...prev,
                      [showingTab]: {
                        ...targetData,
                        [key]: evt.target.value,
                      },
                    };
                  });
                }}
              />
            )}
          </div>
        );
      });
    }
    return <p> Nothing</p>;
  }, [creatorStyleConfigState, isShowWidgetMode, showingTab]);

  return (
    <StyledConfigCreator style={{ justifyContent: isShowWidgetMode ? 'flex-start' : 'center' }}>
      <Hotkeys
        keyName={`Esc`}
        allowRepeat={true}
        onKeyDown={(keyname, e) => {
          e.preventDefault();
          setIsOpenConfig(false);
        }}
      />
      <Core
        isDesktop={!isShowKiosk && !isShowWidgetMode}
        isWidget={isShowWidgetMode}
        isVertical={isShowKiosk}
        backgroundImage={backgroundImage}
        profileConfigData={get(cachedProfileConfig, 'data', {})}
        isConfigCreator={true}
        creatorStyleConfig={creatorStyleConfigState}
        isWaitForResponseBoomerangMode={false}
        setUpdateTransparentStandingVideoCanvasState={setUpdateTransparentStandingVideoCanvasState}
      />

      <div className="config-panel-wrap">
        {!isOpenConfig ? (
          <div
            className="control-button"
            style={{ backgroundColor: '#435cee' }}
            onClick={() => setIsOpenConfig(true)}
          >
            <p style={{ color: 'white' }}>Config </p>
          </div>
        ) : (
          <div className="control-config-panel">
            <div className="config-header">
              <p>Config panel </p>
              <p onClick={() => setIsOpenConfig(false)}>X </p>
            </div>
            <div className="config-selection">
              <p>Profile ID </p>
              <Input
                value={currentProfileId}
                onChange={(evt) => {
                  setCurrentProfileId(evt.target.value);
                }}
              />
            </div>
            <div className="config-selection">
              <p>Default Profile: </p>
              <Select
                defaultValue=""
                style={{
                  width: 200,
                  marginRight: '16px',
                  border: 'none',
                }}
                value={selectedDefaultProfile}
                onChange={(value) => {
                  setSelectedDefaultProfile(value);
                }}
              >
                <Select.Option value="current">Current Profile</Select.Option>
                <Select.Option value="V1L">V1 Left</Select.Option>
                <Select.Option value="V2">V2</Select.Option>
                <Select.Option value="V1R">V1 Right</Select.Option>
                <Select.Option value="dm">Demo</Select.Option>
                <Select.Option value="kiosk">Kiosk</Select.Option>
                <Select.Option value="widget">Widget</Select.Option>
                <Select.Option value="midLand">Mid Land</Select.Option>
              </Select>
            </div>
            <div className="config-selection">
              <p>Widget Mode: </p>
              <Checkbox
                checked={isShowWidgetMode}
                style={{
                  marginRight: '8px',
                }}
                onChange={() => {
                  setIsShowWidgetMode(!isShowWidgetMode);
                  if (isShowWidgetMode) {
                    setSelectedDefaultProfile('current');
                  } else {
                    setSelectedDefaultProfile('widget');
                    setIsShowKiosk(false);
                  }
                }}
              />
            </div>
            <div className="config-selection">
              <p>Kiosk Mode: </p>
              <Checkbox
                checked={isShowKiosk}
                style={{
                  marginRight: '8px',
                }}
                onChange={() => {
                  setIsShowKiosk(!isShowKiosk);

                  if (isShowKiosk) {
                    setSelectedDefaultProfile('current');
                  } else {
                    setSelectedDefaultProfile('kiosk');
                    setIsShowWidgetMode(false);
                  }
                }}
              />
            </div>
            <div className="config-selection" style={{ marginBottom: '16px' }}>
              {['Model', 'Chat Area', 'Common'].map((value) => {
                return (
                  <p
                    key={value}
                    onClick={() => setShowingClass(value)}
                    style={{
                      color: showingClass === value ? '#435cee' : 'gray',
                    }}
                  >
                    {value}
                  </p>
                );
              })}
            </div>
            <div className="config-selection" style={{ marginBottom: '16px' }}>
              {(isShowWidgetMode
                ? [
                    { label: 'Model Config', value: 'modelPositionConfig', classType: 'Model' },
                    { label: 'Chat Zone', value: 'chatZoneStyle', classType: 'Chat Area' },
                    { label: 'Subtitle', value: 'subtitleConfig', classType: 'Chat Area' },
                    {
                      label: 'Subtitle Wrap',
                      value: 'subtitleStyleConfig',
                      cclassType: 'Chat Area',
                    },
                    { label: 'Skip Button', value: 'skipButtonConfig', classType: 'Chat Area' },
                    { label: 'Common', value: 'widgetCommon', classType: 'Common' },
                    {
                      label: 'Widget Layout Config',
                      value: 'widgetLayoutConfig',
                      classType: 'Common',
                    },
                    {
                      label: 'Chat Zone Position',
                      value: 'chatZoneWrapStyle',
                      classType: 'Common',
                    },
                    {
                      label: 'Header',
                      value: 'headerStyleConfig',
                      classType: 'Common',
                    },
                    {
                      label: 'Model Position',
                      value: 'modelWrapStyle',
                      classType: 'Common',
                    },
                    {
                      label: 'Session Start Time',
                      value: 'sessionStartTimeConfig',
                      classType: 'Chat Area',
                    },
                    {
                      label: 'Input Content Wrap',
                      value: 'inputContentWrapConfig',
                      classType: 'Chat Area',
                    },
                    {
                      label: 'Input Content',
                      value: 'inputContentConfig',
                      classType: 'Chat Area',
                    },
                    {
                      label: 'Message Box',
                      value: 'messageBoxCustomStyle',
                      classType: 'Chat Area',
                    },
                    {
                      label: 'Choice Wrap Style',
                      value: 'choiceWrapCustomStyle',
                      classType: 'Chat Area',
                    },
                    {
                      label: 'Choice Style',
                      value: 'choiceCustomStyle',
                      classType: 'Chat Area',
                    },
                  ].filter((data) => {
                    const { classType } = data;
                    return classType === showingClass;
                  })
                : isShowKiosk
                  ? [
                      { label: 'Header', value: 'currentHeaderConfig', classType: 'Common' },
                      {
                        label: 'Button set',
                        value: 'currentButtonSetConfig',
                        classType: 'Common',
                      },
                      {
                        label: 'Chat zone',
                        value: 'currentChatZoneConfig',
                        classType: 'Chat Area',
                      },
                      { label: 'Model', value: 'currentModelKioskConfig', classType: 'Model' },
                    ].filter((data) => {
                      const { classType } = data;
                      return classType === showingClass;
                    })
                  : [
                      { label: 'Plug Ins', value: 'basicConfig', classType: 'Common' },
                      {
                        label: 'Model Position',
                        value: 'chatRoomContentWrapStyle',
                        classType: 'Model',
                      },
                      { label: 'Model Config', value: 'modelPositionConfig', classType: 'Model' },
                      {
                        label: 'Chat Zone Wrap',
                        value: 'chatZoneWrapStyle',
                        classType: 'Chat Area',
                      },
                      { label: 'Chat Zone', value: 'chatZoneStyle', classType: 'Chat Area' },
                      { label: 'Subtitle', value: 'subtitleConfig', classType: 'Chat Area' },
                      {
                        label: 'Subtitle Wrap',
                        value: 'subtitleStyleConfig',
                        classType: 'Chat Area',
                      },
                      { label: 'Skip Button', value: 'skipButtonConfig', classType: 'Chat Area' },
                      {
                        label: 'Placeholder',
                        value: 'chatPlaceholderStyle',
                        classType: 'Chat Area',
                      },
                      { label: 'Common', value: 'common', classType: 'Common' },
                    ].filter((data) => {
                      const { classType } = data;
                      return classType === showingClass;
                    })
              ).map(({ label, value }) => {
                return (
                  <p
                    key={value}
                    onClick={() => setShowingTab(value)}
                    style={{
                      color: showingTab === value ? '#435cee' : 'gray',
                    }}
                  >
                    {label}
                  </p>
                );
              })}
            </div>
            {showingContent}
            {showingTab !== 'common' && showingTab !== '' && (
              <div className="config-selection">
                <Input
                  value={currentAddingKey}
                  onChange={(evt) => {
                    setCurrentAddingKey(evt.target.value);
                  }}
                />
                <p> : </p>
                <Input
                  value={currentAddingValue}
                  onChange={(evt) => {
                    setCurrentAddingValue(evt.target.value);
                  }}
                />
                <button
                  type="button"
                  style={{ width: '250px' }}
                  onClick={() => {
                    if (currentAddingKey && currentAddingValue) {
                      setCreatorStyleConfigState((prev) => {
                        if (isShowWidgetMode) {
                          return {
                            ...prev,
                            widgetConfig: {
                              ...get(prev, 'widgetConfig', {}),
                              [showingTab]: {
                                ...get(creatorStyleConfigState, ['widgetConfig', showingTab], {}),
                                [currentAddingKey]: currentAddingValue,
                              },
                            },
                          };
                        }
                        return {
                          ...prev,
                          [showingTab]: {
                            ...get(creatorStyleConfigState, showingTab, {}),
                            [currentAddingKey]: currentAddingValue,
                          },
                        };
                      });
                      setCurrentAddingKey('');
                      setCurrentAddingValue('');
                    }
                  }}
                >
                  New Style
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                // navigator.clipboard.writeText(JSON.stringify(creatorStyleConfigState)).then(
                //   () => {
                //     console.log('Copying to clipboard was successful!');
                //     message.success('Copying to clipboard was successful!');
                //   },
                //   (err) => {
                //     console.error('Could not copy value', err);
                //     message.error('Could not copy value', err);
                //   },
                // );
                const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                  JSON.stringify(creatorStyleConfigState),
                )}`;
                const link = document.createElement('a');
                link.href = jsonString;
                link.download = `${currentProfileId || `data_${Date.now()}`}.json`;

                link.click();
              }}
            >
              Copy config
            </button>
          </div>
        )}
      </div>
    </StyledConfigCreator>
  );
}
