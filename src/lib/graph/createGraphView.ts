import * as d3 from 'd3';

const createGraphView = (
  width: number,
  height: number,
) => (
  d3.select("#graph-view")
    .append("canvas")
    .attr("width", width)
    .attr("height", height)
);

export default createGraphView;
