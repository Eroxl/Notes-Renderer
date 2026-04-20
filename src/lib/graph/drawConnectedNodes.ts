import { GraphNode } from '../types/GraphNode';
import { GraphLink } from '../types/GraphLink';

const LINK_COLOR = '#ECEFF4';

const drawConnectedNodes = (
  ctx: CanvasRenderingContext2D,
  hoveredNodeId: string,
  nodes: GraphNode[],
  links: GraphLink[],
) => {
  const connectedLinks = links.filter(link => {
    const sourceId = typeof link.source === 'object'
      ? (link.source as GraphNode).id
      : link.source as string;
    const targetId = typeof link.target === 'object'
      ? (link.target as GraphNode).id
      : link.target as string;
    return sourceId === hoveredNodeId || targetId === hoveredNodeId;
  });

  ctx.strokeStyle = LINK_COLOR;
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.9;

  connectedLinks.forEach(link => {
    const source = link.source as GraphNode;
    const target = link.target as GraphNode;
    if (source.x === undefined || source.y === undefined) return;
    if (target.x === undefined || target.y === undefined) return;

    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
};

export default drawConnectedNodes;
