import type { SimulationNodeDatum } from "d3";

export type GraphNode = {
  id: string,
  group: string
} & d3.SimulationNodeDatum;
