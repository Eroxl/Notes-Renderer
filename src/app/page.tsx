import React from 'react';

import renderContent from '../lib/renderContent';

const PAGE_CONTENT = `
# Welcome to My Notes Vault

Welcome to my collection of notes on various topics. This site serves as an organized repository of all my notes.
These notes are converted from **Markdown** to **HTML** and hosted here for easy access and reference.

## About This Site

This site is built using **Markdown** files stored in an [Obsidian vault](https://obsidian.md). The notes are converted
to **HTML** using a [custom renderer](https://github.com/eroxl/notes-renderer) I developed. The purpose of this site is
to provide an easy-to-navigate and visually appealing way to review and study my notes.

## How to Use This Site

Navigating through this site is designed to be intuitive and straightforward. You can use the sidebar to navigate different
subjects and pages and use the links between documents to view related materials.

### The Classes Directory

If you're looking for more linear notes structured around specific courses, check out the [[99 - Classes|classes]] directory.
It contains notes organized by class and topic, as well as relevant practice or assignment files.

## Feedback and Contributions

If you have any suggestions, corrections, or contributions, feel free to [create an issue](https://github.com/Eroxl/Eroxl/issues/new).

Happy studying!
`;

const HomePage = async () => {
  const {
    html,
    style
  } = renderContent(PAGE_CONTENT);

  return (
    <div className="overflow-y-scroll overflow-x-clib  print:h-full print:overflow-visible page h-screen max-w-2xl w-full mx-auto text-nord-4 no-scrollbar pb-48 print:pb-0">
      <div
        className="font-bold text-4xl pt-12"
      >
        Eroxl's Notes
      </div>
      <style>
        {style}
      </style>
      <div
        className="flex flex-col gap-4 -mt-8"
        dangerouslySetInnerHTML={{
          __html: html
        }}
      />
    </div>
  )
}

export default HomePage;
