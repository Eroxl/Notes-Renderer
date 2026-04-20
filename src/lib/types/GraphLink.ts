import { SimulationLinkDatum } from 'd3';
import { GraphNode } from './GraphNode';

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}
