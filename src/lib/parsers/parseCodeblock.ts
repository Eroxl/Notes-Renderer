import parseNodes from "../parseNodes";
import Parser from "../types/Parser";

export const getEncompassingCodeblockLines = (
  lines: string[],
  delineatorLength: number,
  offset: number = 0,
): number => {
  if (lines[offset] === undefined) return 0;

  if (lines[offset].trim().endsWith('`'.repeat(delineatorLength))) return 1;

  return getEncompassingCodeblockLines(lines, delineatorLength, offset + 1) + 1;
}

const parseCodeblock: Parser = (lines: string[]) => {
  if (!lines.length) return;

  if (!lines[0].startsWith('```')) return;

  const codeBlockTypeLength = lines[0].lastIndexOf('`');

  const codeBlockType = lines[0].slice(codeBlockTypeLength+1);

  const codeBlockLength = getEncompassingCodeblockLines(lines, codeBlockTypeLength+1, 1) + 1;

  const codeBlockContent = lines
    .slice(1, codeBlockLength - 1)
    .join('\n') 

  if (codeBlockTypeLength === 2) {
    return {
      consumedLines: codeBlockLength,
      node: {
        type: 'codeblock',
        properties: {
          type: codeBlockType,
          subNodes: [codeBlockContent]
        }
      }
    }
  }

  return {
    consumedLines: codeBlockLength,
    node: {
      type: 'codeblock',
      properties: {
        type: codeBlockType,
        subNodes: parseNodes(codeBlockContent)
      }
    }
  }
};

export default parseCodeblock;
