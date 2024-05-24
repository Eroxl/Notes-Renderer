import Parser from "../types/Parser";

export const getEncompassingMathLines = (lines: string[], offset: number = 0): number => {
  if (lines[offset] === undefined) return 0;

  if (lines[offset].trim().endsWith('$$')) return 1;

  return getEncompassingMathLines(lines, offset + 1) + 1;
}

const parseMath: Parser = (lines: string[]) => {
  if (!lines.length) return;

  if (!lines[0].startsWith('$$')) return;

  if (lines[0].slice(2).endsWith('$$')) {
    return {
      consumedLines: 1,
      node: {
        properties: {
          content: lines[0].slice(2, -2),
        },
        type: 'math'
      }
    }
  }

  const mathBlockLength = getEncompassingMathLines(lines, 1) + 1;

  return {
    consumedLines: mathBlockLength,
    node: {
      properties: {
        content: lines.slice(1, mathBlockLength-1).join("\n"),
      },
      type: 'math'
    }
  }
};

export default parseMath;
