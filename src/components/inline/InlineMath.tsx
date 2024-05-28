import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

import fs from 'fs';

const mathJAXPreamble = fs.readFileSync(process.env['INPUT_PREAMBLE_PATH']).toString();

const aligner = `
<span
  style="display: inline-block; width: 0;"
>
  \u200b
</span>
`;

const InlineMath: React.FC<{ content: string }> = async (props) => {
  const { content } = props;

  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);

  const tex = new TeX({packages: AllPackages});
  const svg = new SVG();
  const html = mathjax.document('', { InputJax: tex, OutputJax: svg });

  const nodeDisplay = html.convert(`${mathJAXPreamble} ${content}` || '', { display: false });
  const svgCode = adaptor.outerHTML(nodeDisplay);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: `${svgCode}\n ${aligner}` }}
      className="w-min inline-block"
    />
  )
};

export default InlineMath;
