import React from 'react';

interface DesktopNavProps {
  children: React.ReactNode;
}

const DesktopNav = ({ children }: DesktopNavProps) => (
  <div className="hidden md:flex md:w-96 h-screen bg-nord-1 print:hidden flex-col overflow-y-auto overscroll-none no-scrollbar">
    {children}
  </div>
);

export default DesktopNav;
