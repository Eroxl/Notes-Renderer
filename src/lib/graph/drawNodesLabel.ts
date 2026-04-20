import { GraphNode } from '../types/GraphNode';
import { nodeRadius } from './drawNodes';

const drawNodesLabel = (
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  scale: number = 1,
) => {
  const fontSize = Math.max(2.5, 3 * scale);
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = '#D8DEE9';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  nodes.forEach(node => {
    if (node.x === undefined || node.y === undefined) return;
    ctx.fillText(node.name, node.x, node.y + nodeRadius(node) + 1);
  });
};

export default drawNodesLabel;
