import React from 'react';
import { notFound } from 'next/navigation';

import getNoteMetadata from '../../lib/getNoteMetadata';
import getNoteContent from '../../lib/getNoteContent';
import renderContent from '../../lib/renderContent';
import getValidNotes from '../../lib/getValidNotes';
import PageMetadata from '../../components/PageMetadata';
import NoteContent from '../../components/NoteContent';
import PageWrapper from '../../components/PageWrapper';

const Note = async ({ params }: { params: Promise<{ pageName: string }> }) => {
  const { pageName } = await params;

  const pageMetadata = getNoteMetadata(decodeURIComponent(pageName));

  if (!pageMetadata) notFound();

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
    <PageWrapper name={pageMetadata.name}>
      <PageMetadata metadata={metadata} />
      <style>{style}</style>
      <NoteContent html={html} />
    </PageWrapper>
  )
}

const generateStaticParams = (): { pageName: string }[] => {
  const notesPath = process.env['INPUT_NOTES_ROOT_PATH']

  if (!notesPath) throw new Error("No notes path provided");

  return getValidNotes(notesPath)
    .filter((path) => path.path.endsWith('.md'))
    .flatMap((path) => {
      return [
        { pageName: encodeURIComponent(path.url) },
      ];
    });
}

export { generateStaticParams };

export default Note;
