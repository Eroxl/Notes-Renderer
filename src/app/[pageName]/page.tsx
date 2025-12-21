import React from 'react';

import getNoteMetadata from '../../lib/getNoteMetadata';
import getNoteContent from '../../lib/getNoteContent';
import renderContent from '../../lib/renderContent';
import getValidNotes from '../../lib/getValidNotes';
import PageMetadata from '../../components/PageMetadata';

const Note = async ({ params }: { params: Promise<{ pageName: string }> }) => {
  const { pageName } = await params;

  const pageMetadata = getNoteMetadata(decodeURIComponent(pageName));

  const {
    content,
    metadata
  } = getNoteContent(pageMetadata.path);

  if (metadata['excalidraw-plugin'] !== undefined) return '';

  const {
    html,
    style
  } = renderContent(content);

  return (
    <div className="overflow-y-scroll overflow-x-clib  print:h-full print:overflow-visible page h-screen max-w-2xl w-full mx-auto text-nord-4 no-scrollbar pb-48 print:pb-0">
      <div
        className="font-bold text-4xl pt-12"
      >
        {pageMetadata.name}
      </div>
      <PageMetadata metadata={metadata} />

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

const generateStaticParams = (): { pageName: string }[] => {
  const notesPath = process.env['INPUT_NOTES_ROOT_PATH']

  if (!notesPath) throw new Error("No notes path provided");


  return getValidNotes(notesPath)
    .filter((path) => path.path.endsWith('.md'))
    .flatMap((path) => {
      return [
        { pageName: encodeURIComponent(path.url) },                          // Raw name
      ];
    });
}

export { generateStaticParams };

export default Note;
