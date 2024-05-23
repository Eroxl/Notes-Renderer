import calloutRenderer from "../renderers/calloutRenderer";
import htmlElementRendererFactory from "../renderers/htmlElementRendererFactory";
import listRenderer from "../renderers/listRenderer";
import mathRenderer from "../renderers/mathRenderer";
import Node from "../types/Node";

htmlElementRendererFactory('div', 'quote')

const RENDERERS = {
  callout: calloutRenderer,
  quote: htmlElementRendererFactory('div', 'quote'),
  list: listRenderer,
  math: mathRenderer,

  h1: htmlElementRendererFactory('h1'),
  h2: htmlElementRendererFactory('h2'),
  h3: htmlElementRendererFactory('h3'),
  h4: htmlElementRendererFactory('h4'),
  h5: htmlElementRendererFactory('h5'),
  h6: htmlElementRendererFactory('h6'),
} as Record<string, ((node: Node) => string) | ((node: Node) => Promise<string>)>;

export default RENDERERS;
