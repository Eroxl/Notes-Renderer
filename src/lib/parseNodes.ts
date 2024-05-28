import Parser from "./types/Parser";
import createContinousParser from "./factories/createContinousParser";
import createSingleLineParser from "./factories/createSingleLineParser";
import parseCallout from "./parsers/parseCallout";
import parseCodeblock from "./parsers/parseCodeblock";
import parseList from "./parsers/parseList";
import parseMath from "./parsers/parseMath";
import TextNode from "./types/TextNode";
import parseEmbed from "./parsers/parseEmbed";

const parsers: Parser[] = [
  createSingleLineParser(/^# /, 'h1'),
  createSingleLineParser(/^## /, 'h2'),
  createSingleLineParser(/^### /, 'h3'),
  createSingleLineParser(/^#### /, 'h4'),
  createSingleLineParser(/^##### /, 'h5'),
  createSingleLineParser(/^###### /, 'h6'),

  createSingleLineParser(/^\%\%/, 'comment'),
  createSingleLineParser(/^\^/, 'comment'),

  parseCallout,
  createContinousParser([/^>/], 'quote', 2),

  parseMath,
  parseList,
  parseCodeblock,
  parseEmbed,
];

const parseNodes = (content: string) => {
  const contentByLines = content.split('\n');
  
  const output: TextNode[] = []

  for (let lineIndex = 0; lineIndex < contentByLines.length; lineIndex++) {
    const availableContent = contentByLines.slice(lineIndex);
    let didFindParser = false;

    for (let i = 0; i < parsers.length; i++) {
      const parser = parsers[i];
      
      const parserResponse = parser(availableContent);
  
      if (!parserResponse) continue;
  
      output.push(parserResponse.node);

      lineIndex += parserResponse.consumedLines - 1;
      
      didFindParser = true;
      break;
    }

    if (didFindParser) continue;

    if (!availableContent[0]) continue;

    output.push({
      properties: {
        content: availableContent[0]
      },
      type: 'text',
    })
  }

  return output;
};

export default parseNodes;
