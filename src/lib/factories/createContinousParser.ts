import Parser from "../types/Parser";
import { getContinousLines } from "../getContinousLines";

const createContinousParser = (
  allowedLines: RegExp[],
  nodeType: string,
  removeCount: number = 0,
): Parser => (
  (lines) => {  
    const linesToParse = getContinousLines(allowedLines, lines);
  
    if (!linesToParse) return;

    const content = lines
      .slice(0, linesToParse)
      .map((line) => line.slice(removeCount))
      .join('\n');
    
    return {
      consumedLines: linesToParse,
      node: {
        properties: {
          content
        },
        type: nodeType,
      }
    }
  }
);

export default createContinousParser;
