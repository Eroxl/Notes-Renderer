import Node from './Node';

type Parser = (
  lines: string[]
) => undefined | {
  consumedLines: number, 
  node: Node,
}

export default Parser;