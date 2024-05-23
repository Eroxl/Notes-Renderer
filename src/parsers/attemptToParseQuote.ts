import getJoinedLinesLength from "../lib/getJoinedLineLengths";
import type Parser from "../types/Parser";

const attemptToParseQuote: Parser = (
  lines: string[],
) => {
  if (lines.length === 0) return;
  
  const isValidQuote = lines[0].startsWith('>') && !lines[0].startsWith('> $$')

  if (!isValidQuote) return;

  const linesToParse = getJoinedLinesLength(/^>[^\$]{2}|^>$|^> $/, lines) || 1;

  const quoteContent = lines
    .slice(0, linesToParse)
    .map((line) => line.slice(2))
    .join('\n');

  console.log(quoteContent);

  return {
    consumedLines: linesToParse,
    node: {
      content: quoteContent,
      properties: {},
      type: 'quote',
    }
  }
};

export default attemptToParseQuote;
