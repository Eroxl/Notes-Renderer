import fs from 'fs';
import fm from 'front-matter';

import TextNode from "./types/TextNode";
import parseNodes from './parseNodes';

const contentCache = {};

const getNoteContent = async (notePath: string): Promise<[TextNode[], Record<string, unknown>]> => {
  if (contentCache[notePath]) return contentCache[notePath];

  const { attributes: metadata, body: content } = fm(
    fs.readFileSync(notePath)
      .toString()
  );

  const output = await parseNodes(content);

  contentCache[notePath] = [
    output,
    metadata
  ]

  return [
    output,
    metadata as Record<string, unknown>
  ];
};

export default getNoteContent;
