import { SimulationNodeDatum } from 'd3';

export interface GraphNode extends SimulationNodeDatum {
  id: string;
  name: string;
  group: string;
  linkCount: number;
}
