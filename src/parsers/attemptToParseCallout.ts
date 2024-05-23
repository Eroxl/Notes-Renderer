import getJoinedLinesLength from "../lib/getJoinedLineLengths";
import type Parser from "../types/Parser";

const getCalloutMetadata = (header: string) => {
  const metaData = header
    .match(/^> \[!(.*)\] ?(.*)?/)
    ?.slice(1)

  return {
    type: metaData?.[0],
    title: metaData?.[1],
  }
};

const attemptToParseCallout: Parser = (
  lines: string[],
) => {
  if (!lines.length) return;
  
  const isValidCallout = /^> \[!.*\]/.test(lines[0]);

  if (!isValidCallout) return;

  const linesToParse = getJoinedLinesLength(/^> /, lines);

  const calloutLines = lines.slice(0, linesToParse);

  if (!calloutLines.length) return;

  const calloutMetadata = getCalloutMetadata(calloutLines[0]);
  const calloutContent = calloutLines
    .slice(1)
    .map((line) => line.slice(2))
    .join('\n');

  return {
    consumedLines: linesToParse,
    node: {
      content: calloutContent,
      properties: calloutMetadata,
      type: 'callout',
    }
  }
};

export default attemptToParseCallout;
