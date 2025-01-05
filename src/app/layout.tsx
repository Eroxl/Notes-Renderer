import React from 'react';

import './globals.css';
import './desmosGraph.css';
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
      <head>
        <link rel="stylesheet" type="text/css" href="https://bill-ion.github.io/tikzjax-live/dist/fonts.css" />
        <script defer src="https://bill-ion.github.io/tikzjax-live/dist/tikzjax.js" />
      </head>
      <body className="bg-nord-0 flex flex-row">
        <FileExplorer />
        <div className="w-full h-screen overflow-hidden print:h-full print:overflow-visible">
          {children}
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
