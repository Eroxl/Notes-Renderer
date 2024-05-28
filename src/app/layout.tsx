import React from 'react';

import './globals.css';
import FileExplorer from 'src/components/FileExplorer';

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    pageName: string,
  }
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html>
      <body className="bg-nord-0 flex flex-row">
        <FileExplorer />
        <div className="w-full h-screen p-10 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
