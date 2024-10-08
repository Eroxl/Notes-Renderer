import TextNode from "./TextNode";

type Parser = (lines: string[]) => ({
  consumedLines: number;
  node: TextNode;
} | Promise<{
  consumedLines: number;
  node: TextNode;
}>)

export default Parser;
