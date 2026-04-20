import { GraphNode } from '../types/GraphNode';
import groupColor from './groupColor';

const BASE_RADIUS = 4;
const RADIUS_SCALE = 1.5;

export const nodeRadius = (node: GraphNode) =>
  BASE_RADIUS + Math.sqrt(node.linkCount) * RADIUS_SCALE;

const drawNodes = (
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  opacity: number = 1,
) => {
  ctx.globalAlpha = opacity;

  nodes.forEach(node => {
    if (node.x === undefined || node.y === undefined) return;

    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius(node), 0, 2 * Math.PI);
    ctx.fillStyle = groupColor(node.group);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
};

export default drawNodes;
