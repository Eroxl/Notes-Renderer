import React from 'react';

import './globals.css'

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    pageName: string,
  }
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-nord-0">
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
