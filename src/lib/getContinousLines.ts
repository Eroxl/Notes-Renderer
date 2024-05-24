export const getContinousLines = (
  allowedLines: RegExp[],
  lines: string[],
  offset = 0
): number => {
  if (!lines.length
    || lines.length < offset) return 0;

  if (allowedLines.some((regex) => regex.test(lines[offset]))) return getContinousLines(allowedLines, lines, offset + 1) + 1;

  return 0;
};
