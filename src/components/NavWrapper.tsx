"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const NavContent = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  if (searchParams.get('preview') === '1') return null;
  return <>{children}</>;
};

const NavWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense>
    <NavContent>{children}</NavContent>
  </Suspense>
);

export default NavWrapper;
