'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, X, ArrowUp, ArrowDown, CornerDownLeft } from 'lucide-react';
import Fuse from 'fuse.js';

type Note = {
  name: string;
  url: string;
};

type SearchModalProps = {
  notes: Note[];
};

const SearchModal: React.FC<SearchModalProps> = ({ notes }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const fuse = useRef(new Fuse(notes, { keys: ['name'], threshold: 0.2, minMatchCharLength: 2 }));

  const results = query.trim() === ''
    ? []
    : fuse.current.search(query).map((r) => r.item).slice(0, 50);

  const dismiss = () => {
    setOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const keyupHandler = (e: KeyboardEvent) => {
      console.log('[SearchModal] keyup', e.key);
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keyup', keyupHandler, true);
    return () => window.removeEventListener('keyup', keyupHandler, true);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => { selectedRef.current?.scrollIntoView({ block: 'nearest' }); }, [selectedIndex]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('[SearchModal] input onKeyDown', e.key);
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      dismiss();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      router.push(`/${results[selectedIndex].url}`);
      dismiss();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        className="w-[90vw] md:w-[580px] bg-nord-1 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 bg-nord-0">
          <Search className="w-4 h-4 text-white/35 flex-shrink-0" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-white/90 placeholder-white/30 text-sm outline-none"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/25 hover:text-white/50 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="max-h-[320px] overflow-y-auto no-scrollbar">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center text-white/25 text-sm">
              {query.trim() === '' ? 'Start typing to search notes' : 'No notes found'}
            </div>
          ) : (
            <div className="py-1.5">
              {results.map((note, i) => (
                <button
                  key={note.url}
                  ref={i === selectedIndex ? selectedRef : null}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                    i === selectedIndex
                      ? 'bg-nord-2 text-white/90'
                      : 'text-white/55 hover:bg-nord-2/50 hover:text-white/80'
                  }`}
                  onClick={() => { router.push(`/${note.url}`); dismiss(); }}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${i === selectedIndex ? 'text-nord-8' : 'text-white/30'}`} />
                  <span className="text-sm truncate">{note.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 px-4 py-2 border-t border-white/8 text-white/20 text-xs">
          <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3" /><ArrowDown className="w-3 h-3" /> navigate</span>
          <span className="flex items-center gap-1"><CornerDownLeft className="w-3 h-3" /> open</span>
          <span className="flex items-center gap-1"><X className="w-3 h-3" /> close</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
