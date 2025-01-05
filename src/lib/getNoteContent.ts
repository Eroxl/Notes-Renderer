import fs from 'fs';
import fm from 'front-matter';

const contentCache = {};

const getNoteContent = (notePath: string): { content: string, metadata: Record<string, unknown> } => {
  if (contentCache[notePath]) return contentCache[notePath];

  const { attributes: metadata, body: content } = fm(
    fs.readFileSync(notePath)
      .toString()
  );

  contentCache[notePath] = {
    content,
    metadata
  }

  return contentCache[notePath]
};

export default getNoteContent;
