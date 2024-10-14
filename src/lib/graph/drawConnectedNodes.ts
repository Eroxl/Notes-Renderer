import { GraphLink } from "../types/GraphLink";
import { GraphNode } from "../types/GraphNode";
import drawLinks from "./drawLinks";
import drawNodes from "./drawNodes";
import drawNodesLabel from "./drawNodesLabel";

const drawConnectedNodes = (
  context: CanvasRenderingContext2D,
  startingNodeID: string,
  nodes: GraphNode[],
  links: GraphLink[],
  showNames: boolean = true,
  nameScale: number = 1,
) => {
  const connectedNodesIDs = {
    [startingNodeID]: true,
  };

  const connectedLinks = links.filter((link) => {
    if (typeof link.source !== 'object' || typeof link.target !== 'object') return false;

    if (link.source.id !== startingNodeID && link.target.id !== startingNodeID) return false;

    connectedNodesIDs[link.source.id] = true;
    connectedNodesIDs[link.target.id] = true;

    return true;
  })

  const connectedNodes = nodes.filter((node) => connectedNodesIDs[node.id] !== undefined);

  drawLinks(context, connectedLinks);
  drawNodes(context, connectedNodes);

  if (!showNames) return;

  drawNodesLabel(context, connectedNodes, nameScale);
}

export default drawConnectedNodes;
