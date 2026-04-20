import { GraphNode } from '../types/GraphNode';
import { GraphLink } from '../types/GraphLink';

const LINK_COLOR = '#4C566A';

const drawLinks = (
  ctx: CanvasRenderingContext2D,
  links: GraphLink[],
  opacity: number = 0.35,
) => {
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = LINK_COLOR;
  ctx.lineWidth = 0.8;

  links.forEach(link => {
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

export default drawLinks;
