import fs from "fs";
import Token from "markdown-it/lib/token.mjs";

import calculateHash from "./calculateHash";

const DESMOS_CACHE_LOCATION = process.env['INPUT_DESMOS_CACHE_PATH'];

const desmosGraph = (tokens: Token[], index: number) => {
  const content = tokens[index + 1].content;
  const hash = calculateHash(content);

  const graphData = fs.readFileSync(`${DESMOS_CACHE_LOCATION}/desmos-graph-${hash}.svg`).toString();

  return (
    `<div class="desmos-graph">
      ${graphData}
    </div>`
  );

};

export default desmosGraph;

