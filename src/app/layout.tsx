import React from 'react';

import './globals.css'

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <body className="bg-nord-0 flex flex-row">
      <div className="bg-nord-1 w-64 h-screen">
        {/* TODO Navigation Bar */}
      </div>
      <div className="w-full h-screen p-10 overflow-clip">
        {children}
      </div>
    </body>
  </html>
);

export default RootLayout;
