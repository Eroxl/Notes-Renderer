import * as d3 from 'd3';

const createGraphView = (width: number, height: number) => {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio ?? 1 : 1;

  return d3.select('#graph-view')
    .append('canvas')
    .attr('width', width * dpr)
    .attr('height', height * dpr)
    .style('width', '100%')
    .style('height', '100%') as d3.Selection<HTMLCanvasElement, unknown, HTMLElement, unknown>;
};

export default createGraphView;
