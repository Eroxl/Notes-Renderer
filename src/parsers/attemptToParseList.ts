import getJoinedLinesLength from "../lib/getJoinedLineLengths";
import Node from "../types/Node";
import Parser from "../types/Parser";

const getIndentationLevel = (line: string): number => {
  if (!line || !line.length) return 0;

  if (!/^\s/.test(line.charAt(0))) return 0;

  return 1 + getIndentationLevel(line.slice(1)); 
}

const getEncompassingLinesLength = (
  lines: string[],
  indentationLevel: number,
  offset: number
): number => {
  if (!lines[offset] || !lines[offset].length) return 0;

  if (getIndentationLevel(lines[offset]) < indentationLevel) return 0;

  return getEncompassingLinesLength(lines, indentationLevel, offset + 1) + 1;
}

const getOffsetsOnNextIndentationLevel = (lines: string[], indentationLevel: number, offset: number): number[] => {
  if (!lines[offset] || !lines[offset].length) return [];

  if (getIndentationLevel(lines[offset]) !== indentationLevel) {
    return getOffsetsOnNextIndentationLevel(lines, indentationLevel, offset + 1);
  }

  return [
    offset,
    ...getOffsetsOnNextIndentationLevel(lines, indentationLevel, offset + 1)
  ];
}

const parseList = (lines: string[], offset: number = 0): Node => {
  if (lines.length === offset - 1) {
    return {
      content: lines[offset].trimStart().slice(2),
      properties: {},
      type: 'list',
    }
  }

  const indentationLevel = getIndentationLevel(lines[offset]);

  const encompassedLinesLength = getEncompassingLinesLength(lines, indentationLevel, offset + 1) + 1

  const childNodesOffsets = getOffsetsOnNextIndentationLevel(
    lines.slice(offset, encompassedLinesLength),
    getIndentationLevel(lines[offset + 1]),
    offset+1,
  );

  return {
    content: lines[offset].trimStart().slice(2),
    properties: {
      subNodes: childNodesOffsets.map((childOffset) => parseList(lines, childOffset))
    },
    type: 'list',
  }
};

const attemptToParseList: Parser = (lines) => {
  if (!lines[0].startsWith("-")) return;

  const listLength = getJoinedLinesLength(/^\s+-/, lines, 1) + 1;

  return {
    consumedLines: listLength,
    node: parseList(lines.slice(0, listLength)) as Node,
  }
};

export default attemptToParseList;
