import mathJAX from 'mathjax-node';

import mathJAXPreamble from '../constants/mathJAXPreamble';
import Node from "../types/Node";

mathJAX.config({});

mathJAX.start();


const mathRenderer = async (node: Node): Promise<string> => {
  return `
  <div class="block-math">
    ${(await mathJAX.typeset({
      format: 'TeX',
      math: `${mathJAXPreamble}\n${node.content}`,
      svg: true,
    })).svg}
  </div>
  `
};

export default mathRenderer;
