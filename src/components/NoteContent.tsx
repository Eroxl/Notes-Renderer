"use client";

import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';

interface PreviewState {
  href: string;
  x: number;
  top: number;
  bottom: number;
  key: number;
}

const isInIframe = () => typeof window !== 'undefined' && window.self !== window.top;

const NoteContent = ({ html }: { html: string }) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCount = useRef(0);
  const activeHref = useRef<string | null>(null);


  useEffect(() => {
    if (isInIframe()) return;

    const el = ref.current;
    if (!el) return;

    el.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('//')) return;
      const url = new URL(href, window.location.href);
      url.searchParams.set('preview', '1');
      const tag = document.createElement('link');
      tag.rel = 'prefetch';
      tag.href = url.toString();
      document.head.appendChild(tag);
    });
  }, [html]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isInternal = (href: string) =>
      !href.startsWith('http') && !href.startsWith('//');

    const navigate = (href: string) => {
      const url = new URL(href, window.location.href);
      const path = url.pathname + url.hash;
      if (window.self !== window.top && window.top) {
        window.top.location.href = path;
      } else {
        router.push(path);
      }
    };

    const cleanups: (() => void)[] = [];

    el.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || !isInternal(href) || link.getAttribute('target') === '_blank') return;

      const onClick = (e: MouseEvent) => {
        e.preventDefault();
        navigate(href);
      };
      link.addEventListener('click', onClick);
      cleanups.push(() => link.removeEventListener('click', onClick));
    });

    const handleMouseOver = (e: MouseEvent) => {
      if (isInIframe()) return;
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || !isInternal(href)) return;
      if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
      if (activeHref.current === href) return;
      activeHref.current = href;
      const rect = target.getBoundingClientRect();
      setPreviewLoaded(false);
      setPreview({ href, x: rect.left, top: rect.top, bottom: rect.bottom, key: ++hoverCount.current });
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      hideTimer.current = setTimeout(() => {
        activeHref.current = null;
        setPreview(null);
      }, 150);
    };

    el.addEventListener('mouseover', handleMouseOver);
    el.addEventListener('mouseout', handleMouseOut);

    return () => {
      cleanups.forEach(fn => fn());
      el.removeEventListener('mouseover', handleMouseOver);
      el.removeEventListener('mouseout', handleMouseOut);
    };
  }, [html, router]);

  const previewUrl = preview
    ? (() => {
        const url = new URL(preview.href, window.location.href);
        url.searchParams.set('preview', '1');
        return url.toString();
      })()
    : null;

  const previewX = preview ? Math.min(preview.x, window.innerWidth - 420) : 0;
  const previewY = preview
    ? (preview.bottom + 8 + 320 > window.innerHeight ? preview.top - 320 - 8 : preview.bottom + 8)
    : 0;

  return (
    <>
      <div
        ref={ref}
        className="flex flex-col gap-4 -mt-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {preview && previewUrl && (
        <div
          className="fixed z-50 bg-nord-0 rounded-lg overflow-hidden shadow-2xl border border-white/10 px-3 transition-opacity duration-150"
          style={{ left: previewX, top: previewY, width: 420, height: 320, opacity: previewLoaded ? 1 : 0, pointerEvents: 'none' }}
        >
          <iframe
            ref={iframeRef}
            key={preview.key}
            src={previewUrl}
            className="w-full h-full bg-nord-0"
            style={{ pointerEvents: previewLoaded ? 'auto' : 'none', overflow: 'hidden' }}
            sandbox="allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            onLoad={() => { iframeRef.current?.blur(); setPreviewLoaded(true); }}
            onMouseEnter={() => {
              if (hideTimer.current) {
                clearTimeout(hideTimer.current);
                hideTimer.current = null;
              }
            }}
            onMouseLeave={() => {
              hideTimer.current = setTimeout(() => setPreview(null), 150);
            }}
          />
        </div>
      )}
    </>
  );
};

export default NoteContent;
