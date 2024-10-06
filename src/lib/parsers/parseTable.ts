import { createMarkdownArrayTable } from "parse-markdown-table";
import getContinousLines from "../getContinousLines";
import Parser from "../types/Parser";

const parseTable: Parser = async (lines: string[]) => {
  if (!lines.length) return;

  if (!lines[0].startsWith('|')) return;

  const linesToParse = getContinousLines([/^\| /], lines);

  const tableText = lines
    .slice(0, linesToParse)
    .join('\n');

  const tableContent = await createMarkdownArrayTable(tableText);

  let rows = [];

  for await (const row of tableContent.rows) {
    rows.push(row);
  }

  return {
    consumedLines: linesToParse,
    node: {
      type: 'table',
      properties: {
        headers: tableContent.headers,
        rows,
      }
    }
  }
};

export default parseTable;
