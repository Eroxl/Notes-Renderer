import React from 'react';

import FileExplorer from 'src/components/FileExplorer';

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    pageName: string,
  }
}

const RootLayout: React.FC<RootLayoutProps> = ({ children, params }) => {
  return (
    <div  className="bg-nord-0 flex flex-row">
      <FileExplorer />
      <div className="w-full h-screen p-10 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default RootLayout;
