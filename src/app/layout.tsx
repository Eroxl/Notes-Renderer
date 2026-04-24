import React from 'react';
import fs from 'fs';
import fm from 'front-matter';

import './globals.css';
import './desmosGraph.css';
import './timeline.css';
import './citations.css';
import FileExplorer from 'src/components/FileExplorer';
import SearchModal from 'src/components/SearchModal';
import NavWrapper from 'src/components/NavWrapper';
import MobileNav from 'src/components/MobileNav';
import DesktopNav from 'src/components/DesktopNav';
import getValidNotes from 'src/lib/getValidNotes';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = async (props: RootLayoutProps) => {
  const { children } = props;

  const notes = getValidNotes(process.env['INPUT_NOTES_ROOT_PATH'] as string)
    .filter(({ path }) => path.endsWith('.md'))
    .filter(({ path }) => {
      const attributes = fm(fs.readFileSync(path).toString()).attributes as Record<string, unknown>;
      return attributes['excalidraw-plugin'] === undefined;
    })
    .map(({ name, url }) => ({ name, url }));

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="https://bill-ion.github.io/tikzjax-live/dist/fonts.css" />
        <script defer src="https://bill-ion.github.io/tikzjax-live/dist/tikzjax.js" />

        <link href="https://unpkg.com/nord-highlightjs@0.1.0/dist/nord.css" rel="stylesheet" type="text/css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
      </head>
      <body className="bg-nord-0 flex flex-col md:flex-row">
        <NavWrapper>
          <MobileNav>
            <FileExplorer />
            <SearchModal notes={notes} />
          </MobileNav>
          <DesktopNav>
            <FileExplorer />
            <SearchModal notes={notes} />
          </DesktopNav>
        </NavWrapper>
        <div className="w-full h-screen overflow-hidden print:h-full print:overflow-visible pt-16 md:pt-0">
          {children}
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
