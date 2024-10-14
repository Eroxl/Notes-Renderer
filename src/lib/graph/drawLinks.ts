import { GraphLink } from "../types/GraphLink";

const drawLinks = (
  context: CanvasRenderingContext2D,
  links: GraphLink[],
  opacity: number = 1,
  color: string = '#434c5e',
) => {
  context.beginPath();
  context.globalAlpha = opacity;

  links.forEach((link) => {
    if (
      typeof link.source !== 'object'
      || typeof link.target !== 'object'
    ) return;

    context.moveTo(link.source.x, link.source.y);
    context.lineTo(link.target.x, link.target.y);
  })

  context.strokeStyle = color;
  context.lineWidth = 0.25;
  context.stroke()
}

export default drawLinks;
