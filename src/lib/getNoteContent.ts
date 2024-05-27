import fs from 'fs';
import fm from 'front-matter';

import TextNode from "./types/TextNode";
import parseNodes from './parseNodes';

const getNoteContent = (notePath: string): [TextNode[], Record<string, unknown>] => {
  const { attributes: metadata, body: content } = fm(
    fs.readFileSync(notePath)
      .toString()
  );

  const output = parseNodes(content);

  return [
    output,
    metadata as Record<string, unknown>
  ];
};

export default getNoteContent;
