import fs from "fs";
import PARSERS from "./constants/PARSERS";
import Node from "./types/Node";

const parseNoteIntoNodes = (
  content: string[],
): Node[] => {
  const output: Node[] = []

  for (let lineIndex = 0; lineIndex < content.length; lineIndex++) {
    const availableContent = content.slice(lineIndex);
    let didFindParser = false;

    for (let i = 0; i < PARSERS.length; i++) {
      const parser = PARSERS[i];
      
      const parserResponse = parser(availableContent);
  
      if (!parserResponse) continue;
  
      output.push(parserResponse.node);

      lineIndex += parserResponse.consumedLines - 1;
      
      didFindParser = true;
      break;
    }

    if (didFindParser) continue;

    output.push({
      content: availableContent[0],
      properties: {},
      type: 'text',
    })
  }

  return output;
};

const parseNote = (
  notePath: string,
) => {
  const fileContent = fs.readFileSync(notePath)
    .toString()
    .split('\n');

  const parsedNodes = parseNoteIntoNodes(fileContent);

  return parsedNodes;
};

export default parseNote;
