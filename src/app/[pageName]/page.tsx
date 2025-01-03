import React, { useEffect } from 'react';

import Page from '../../components/Page';
import getValidNotes from 'src/lib/getValidNotes';
import TextNode from 'src/lib/types/TextNode';
import getNotePath from 'src/lib/getNotePath';
import getNoteContent from 'src/lib/getNoteContent';

type Note = {
  pageName: string,
  pageContent: TextNode[],
}

const Note = async ({ params }: { params: { pageName: string } }) => {  
  const { pageName } = params;

  const pagePath = getNotePath(decodeURI(pageName))

  if (!pagePath) {
    return (
      <Page
        title="404"
        content={[{
          type: "callout",
          properties: {
            type: "Warning",
            title: "404",
            content: "Sorry, this page doesn't exist yet :("
          }
        }]}
      />
    );
  }
  
  const [pageContent, pageMetadata] = await getNoteContent(pagePath);

  return (
    <Page
      title={decodeURI(pageName)}
      content={pageContent}
      metadata={pageMetadata}
    />
  );
}

const generateStaticParams = async (): Promise<{ pageName: string }[]> => {
  const notesPath = process.env['INPUT_NOTES_ROOT_PATH']

  if (!notesPath) throw new Error("No notes path provided");

  return getValidNotes(notesPath)
    .flatMap((path) => ([
      {pageName: encodeURI(path.name)},
      {pageName: path.name}
    ]))
}

export { generateStaticParams };

export default Note;
