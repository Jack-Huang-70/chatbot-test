import React from 'react';
import styled from '@emotion/styled';

const StyledLayout = styled.div``;

const Layout = ({ children }) => {
  return (
    <StyledLayout data-version={`${String(process.env.NAME).toUpperCase()}-${process.env.VERSION}`}>
      <main>{children}</main>
    </StyledLayout>
  );
};

export default Layout;
