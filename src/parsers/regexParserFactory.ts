import Parser from "../types/Parser";

const regexParserFactory = (
  regex: RegExp,
  nodeType: string,
): Parser => (
  (lines) => {
    const match = lines[0].match(regex);

    if (!match) return;

    return {
      consumedLines: 1,
      node: {
        content: lines[0].slice(match[0].length || 0),
        properties: {},
        type: nodeType
      }
    }
  }
);

export default regexParserFactory;
