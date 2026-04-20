"use client";

import { useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';

const NoteContent = ({ html }: { html: string }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Let external links and explicit new-tab links open normally
      if (
        href.startsWith('http') ||
        href.startsWith('//') ||
        target.getAttribute('target') === '_blank'
      ) return;

      e.preventDefault();

      const url = new URL(href, window.location.href);
      router.push(url.pathname + url.hash);
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [router]);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-4 -mt-8"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default NoteContent;
