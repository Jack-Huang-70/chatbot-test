export const DEFAULT_VERTICAL_UI_CONFIG = {
  chatRoomContentWrapStyle: {
    width: '100%',
    borderRadius: '0px',
    margin: '0px',
    height: '100%',
    bottom: '0px',
  },
  chatRoomContentStyle: { height: '100%' },
  chatZoneWrapStyle: {
    margin: '0px',
    height: '92%',
    borderRadius: '0px',
    width: '90%',
    left: '48px',
    bottom: '5%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  chatZoneStyle: {
    backgroundColor: 'transparent',
    height: '70%',
    width: 'fit-content',
    padding: '0px',
    bottom: '0px',
    borderRadius: '0px',
    digitalHumanChatBackgroundColor: '',
    clientChatBackgroundColor: '',
    marginTop: '8px',
    maxWidth: '55%',
    position: 'unset',
    minHeight: '300px',
  },
  modelPositionConfig: {
    marginLeft: '35%', // "",0%
    transform: 'scale(0.7)', // 1.3,0.8
    bottom: '-15%', // -30%, -10%
  },
  subtitleConfig: { fontColor: 'white', fontSize: '1.8vh' },
  subtitleStyleConfig: {
    width: '70%',
    maxHeight: '10%',
    backgroundColor: '#333333',
  },
  skipButtonConfig: { bottom: '48px', right: '48px', width: '60px' },
  isShowPresenterInfo: false,
  rootBackgroundColor: '#ffffff',
  isShowButtonSet: false,
  isShowInputSectionClearButton: false,
  isShowPresenterIconButtonSet: false,
  isShowInputSectionInputBar: false,
  currentHeaderConfig: {
    logoImgLink:
      'https://chatbot-demo.g.aitention.com/data-dev/static/new_kiosk_demo_ui/airport/airportDemoLogo.png',
    weatherImgLink:
      'https://chatbot-demo.g.aitention.com/data-dev/static/new_kiosk_demo_ui/weather_blue.png',
    languageImgLink:
      'https://chatbot-demo.g.aitention.com/data-dev/static/new_kiosk_demo_ui/language_blue.png',
    languageArray: ['airport-kiosk', 'airport-kiosk-hk', 'airport-kiosk-chi'],
    fontColor: '#336CFF',
    mainColor: 'white',
    subColor: '#336CFF',
  },
  currentButtonSetConfig: {
    button1Icon:
      'https://chatbot-demo.g.aitention.com/data-dev/static/new_kiosk_demo_ui/airport/location.png',
    button1CopyWriting: 'Navigation',
    button2Icon:
      'https://chatbot-demo.g.aitention.com/data-dev/static/new_kiosk_demo_ui/airport/gateInfo.png',
    button2CopyWriting: 'Gate Info',
    button3Icon: '',
    button3CopyWriting: '',
    fontColor: '#336CFF',
  },
  currentChatZoneConfig: {
    tapColor: 'https://chatbot-demo.g.aitention.com/data-dev/static/new_kiosk_demo_ui/tap_blue.png',
    fontColor: 'white',
    subColor: '#336CFF',
    buttonColor: '#336CFF',
  },
  currentModelKioskConfig: {
    marginLeft: '35%',
    transform: 'scale(0.7)',
    bottom: '-15%',
  },
};
