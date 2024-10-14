import type { GraphNode } from "../types/GraphNode";
import type { GraphLink } from "../types/GraphLink";
import * as d3 from "d3";

const createGraphForceSimulation = (
  nodes: GraphNode[],
  links: GraphLink[],
  width: number,
  height: number
) => (
  d3.forceSimulation(nodes as any)
    .force("link", d3.forceLink(links as any)
      .id(d => (d as GraphNode).id)
      .distance(2)
      .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-250))
    .force("x", d3.forceX(width / 2).strength(1))
    .force("y", d3.forceY(height / 2).strength(1))
    .alphaDecay(0.05)
    .alphaMin(0.0025)
)

export default createGraphForceSimulation;
