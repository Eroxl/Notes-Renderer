"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const PageWrapperInner = ({ name, children }: { name: string; children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    window.getSelection()?.removeAllRanges();
  }, [name]);

  return (
    <div className={`overflow-y-scroll overflow-x-clip print:h-full print:overflow-visible page h-screen max-w-2xl w-full mx-auto text-nord-4 no-scrollbar print:pb-0 ${isPreview ? 'pb-8' : 'pb-48'}`}>
      <div className={`font-bold text-4xl ${isPreview ? 'pt-4' : 'pt-12'}`}>
        {name}
      </div>
      {children}
    </div>
  );
};

const PageWrapper = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <Suspense>
    <PageWrapperInner name={name}>{children}</PageWrapperInner>
  </Suspense>
);

export default PageWrapper;
