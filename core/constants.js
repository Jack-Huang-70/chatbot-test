import noop from 'lodash/noop';

export const DEFAULT_CUSTOM_CALLBACK_OBJECT = {
  duringVideo: noop,
  afterVideo: noop,
};

export const RESPONSE_OVERTIME_COUNT = 65 * 1000;

export const { IS_PRESENTER_VIEW_ONLY, WIDTH, HEIGHT, SERVICE_NAME, PASSCODE } = {
  IS_PRESENTER_VIEW_ONLY: false,
  WIDTH: null,
  HEIGHT: null,
  SERVICE_NAME: process.env.NEXT_PUBLIC_SERVICE,
  PASSCODE: process.env.NEXT_PUBLIC_PASSCODE,
};
