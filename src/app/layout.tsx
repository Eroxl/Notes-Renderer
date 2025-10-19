import React from 'react';

import './globals.css';
import './desmosGraph.css';
import './timeline.css';
import './citations.css';
import FileExplorer from 'src/components/FileExplorer';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = async (props: RootLayoutProps) => {
  const { children } = props;

  return (
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="https://bill-ion.github.io/tikzjax-live/dist/fonts.css" />
        <script defer src="https://bill-ion.github.io/tikzjax-live/dist/tikzjax.js" />

        <link href="https://unpkg.com/nord-highlightjs@0.1.0/dist/nord.css" rel="stylesheet" type="text/css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
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
