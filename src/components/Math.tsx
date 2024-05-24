import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

import TextNode from "src/lib/types/TextNode";
import fs from 'fs';

const mathJAXPreamble = fs.readFileSync(process.env['PREAMBLE_PATH']).toString();

const Math: React.FC<{ node: TextNode }> = async (props) => {
  const { node } = props;

  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);

  const tex = new TeX({packages: AllPackages});
  const svg = new SVG();
  const html = mathjax.document('', { InputJax: tex, OutputJax: svg });

  const nodeDisplay = html.convert(`${mathJAXPreamble} ${node.properties.content as string}` || '', { display: true });
  const svgCode = adaptor.outerHTML(nodeDisplay);


  return (
    <div
      dangerouslySetInnerHTML={{ __html: svgCode }}
      className="mx-auto w-min"
    />
  )
};

export default Math;
