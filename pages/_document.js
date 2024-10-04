// pages/_document.js

import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';

// utils
import { createEmotionCache } from '@/chatbot-packages/utils/createEmotionCache';

export default class MyDocument extends Document {
  // https://dev.to/britotiagos/how-add-style-components-to-nextjs-and-start-using-it-4kdf
  // https://github.com/vercel/next.js/blob/deprecated-main/examples/with-styled-components/pages/_document.js
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;

    // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) =>
          function EnhanceApp(props) {
            return <App emotionCache={cache} {...props} />;
          },
      });

    const initialProps = await Document.getInitialProps(ctx);
    // This is important. It prevents Emotion to render invalid HTML.
    // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      emotionStyleTags,
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta name="apple-mobile-web-app-title" content="AIDOL Assistant" />
          <meta name="application-name" content="AIDOL Assistant" />
          <meta name="msapplication-TileColor" content="#2d89ef" />
          <meta name="theme-color" content="#ffffff" />
          <meta
            name="description"
            content="A real time digital human chatbot with Generative AI technologies."
          />
          <meta name="emotion-insertion-point" content="" />

          <link rel="alternate" lang="en" href="https://chat.pantheonlab.ai/" />
          <link rel="alternate" lang="x-default" href="https://chat.pantheonlab.ai/" />
          <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="true" />
          {/* <link
              href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
              rel="stylesheet"
              integrity="sha384-T8Gy5hrqNKT+hzMclPo118YTQO6cYprQmhrYwIiQ/3axmI1hQomh7Ud2hPOy8SP1"
              crossorigin="anonymous"
              media="screen"
            /> */}

          {/* https://nextjs.org/docs/messages/google-font-display */}
          <link
            href="https://fonts.googleapis.com/css2?family=Lexend&display=swap"
            rel="stylesheet"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&family=PT+Sans&display=swap"
            rel="stylesheet"
          />
          {/* <link
            rel="preload"
            href="https://cdn-public.aivo.ai/pantheonlabFonts/woff/LORE-Regular.woff"
            as="font"
            type="font/woff"
          />
          <link
            rel="preload"
            href="https://cdn-public.aivo.ai/pantheonlabFonts/woff/LORE-Bold.woff"
            as="font"
            type="font/woff"
          /> */}

          {this.props.emotionStyleTags}

          {/* Global site tag (gtag.js) - Google Analytics */}
          <script id="HEADER_GA_SCRIPT" />
          {/* End Google Tag Manager */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
