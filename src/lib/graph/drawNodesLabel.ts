import { GraphNode } from "../types/GraphNode";

const drawNodeLabel = (
  context: CanvasRenderingContext2D,
  node: GraphNode,
  scale: number,
) => {
  context.font = `${Math.round(2 * scale)}px sans-serif`;
  context.textAlign = "center";
  context.fillStyle = "#fff";

  context.fillText(node.id, node.x, node.y + (5 * scale));
}

const drawNodesLabel = (
  context: CanvasRenderingContext2D,
  nodes: GraphNode[],
  scale: number = 1,
) => {
  nodes.forEach((node) => {
    drawNodeLabel(context, node, scale)
  })
};

export default drawNodesLabel;
