import Parser from "../types/Parser";

const createSingleLineParser = (
  regex: RegExp,
  nodeType: string,
): Parser => (
  (lines) => {
    const match = lines[0].match(regex);

    if (!match) return;

    return {
      consumedLines: 1,
      node: {
        properties: {
          content: lines[0].slice(match[0].length || 0),
        },
        type: nodeType
      }
    }
  }
);

export default createSingleLineParser;