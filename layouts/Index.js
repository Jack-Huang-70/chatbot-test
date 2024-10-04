import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

// components
import Layout from './Layout';

export default function LayoutIndex({ children }) {
  const router = useRouter();
  const {
    // pathname,
    route,
  } = useMemo(() => {
    return { pathname: router?.pathname || '', route: router?.route || '/' };
  }, [router]);

  const intl = useIntl();

  return (
    <Layout intl={intl} route={route}>
      {children}
    </Layout>
  );
}
