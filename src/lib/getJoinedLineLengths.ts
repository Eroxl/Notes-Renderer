const getJoinedLinesLength = (
  regex: RegExp,
  lines: string[],
  offset = 0,
): number => {
  if (
    !lines.length
    || lines.length < offset
  ) return 0;

  if (
    regex.test(lines[offset])
  ) return getJoinedLinesLength(regex, lines, offset + 1) + 1;

  return 0;
};

export default getJoinedLinesLength;
