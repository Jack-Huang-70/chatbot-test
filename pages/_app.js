import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { IntlProvider } from 'react-intl';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';

// components
import LayoutIndex from '@chatbot-test/layouts/Index';

// utils
import { createEmotionCache } from '@/chatbot-packages/utils/createEmotionCache';
import 'regenerator-runtime/runtime';

// lang
import * as locales from '../locales/index';

// styles
import '../styles/globals.css';

const clientSideEmotionCache = createEmotionCache();
const myTheme = createTheme({});

const theme = {
  ...myTheme,
};

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
  const router = useRouter();
  const { locale, defaultLocale } = router;
  const messages = locales.default[locale];
  const isMobileIOS =
    typeof navigator !== 'undefined'
      ? /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      : false;

  return (
    <>
      {/* when using an Input Method Editor (IME) keyboard on a mobile device, it often causes issues with the page background and input box being enlarged, which can affect the user experience. this is typically because the browser automatically zooms in on the input area when it gains focus for user input. */}
      {isMobileIOS && (
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Head>
      )}
      <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LayoutIndex>
              <Component {...pageProps} />
            </LayoutIndex>
          </ThemeProvider>
        </CacheProvider>
      </IntlProvider>
    </>
  );
}

export default MyApp;
