export const DEFAULT_WIDGET_UI_CONFIG = {
  isHideDigitalHuman: false,
  defaultLanguage: 'en-US',
  defaultFirstMessage: 'Hello',
  widgetConfig: {
    chatZoneWrapStyle: {
      backgroundColor: 'transparent',
      height: 'calc( 100% - 0px )',
      width: '100%',
      padding: '0px',
      bottom: '0px',
      borderRadius: '16px',
    },
    modelWrapStyle: {
      height: '100%',
      width: '100%',
      padding: '0px',
      bottom: '0px',
      borderRadius: '16px',
    },
    chatZoneStyle: {
      digitalHumanChatBackgroundColor: '',
      clientChatBackgroundColor: '',
      themeColor: '',
      inputPlaceholderChat: '',
    },
    modelPositionConfig: {
      marginLeft: '0px',
      transform: 'scale(1)',
      bottom: '0%',
    },
    subtitleConfig: { fontColor: 'white', fontSize: 20 },
    subtitleStyleConfig: {
      width: '35%',
      maxHeight: '10%',
      backgroundColor: '#333333',
    },
    widgetLayoutConfig: {
      display: 'flex',
      flexDirection: 'row',
    },
    skipButtonConfig: {},
  },
};
