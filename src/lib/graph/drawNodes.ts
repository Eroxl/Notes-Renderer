import { scaleOrdinal } from "d3";

import { GraphNode } from "../types/GraphNode";

const color = scaleOrdinal([
  "#E05252",
  "#E0B152",
  "#B1E052",
  "#52E052",
  "#52E0B1",
  "#52B1E0",
  "#5252E0",
  "#B152E0",
  "#E052B1"
]);

const drawNode = (
  context: CanvasRenderingContext2D,
  node: GraphNode,
  opacity: number = 1,
  radius: number = 1,
) => {
  context.globalAlpha = opacity;

  context.beginPath();

  context.moveTo(node.x + radius, node.y);
  context.arc(node.x, node.y, radius, 0, 2 * Math.PI);

  context.fillStyle = node.group === 'non-existant' ? '#434c5e' : color(node.group);
  context.fill();

  context.globalAlpha = 1
};

const drawNodes = (
  context: CanvasRenderingContext2D,
  nodes: GraphNode[],
  opacity: number = 1,
  radius: number = 2,
) => {
  nodes.forEach((node) => (drawNode(
    context,
    node,
    opacity,
    radius
  )))
}

export default drawNodes;
