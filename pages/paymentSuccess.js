import React from 'react';
import Head from 'next/head';

import Spinner from '@/chatbot-packages/ui/shared-components/Spinner';

export default function PaymentSuccess() {
  return (
    <>
      <Head>
        <title>Payment Success</title>
      </Head>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '0px',
          left: '0px',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          opacity: '1',
          borderRadius: '16px',
        }}
      >
        <Spinner style={{ fontSize: '80px' }} />
        <p style={{ color: '#0287ff', fontSize: '32px', fontFamily: ' UniversLT67Bold' }}>
          Payment success, please wait...
        </p>
      </div>
    </>
  );
}
