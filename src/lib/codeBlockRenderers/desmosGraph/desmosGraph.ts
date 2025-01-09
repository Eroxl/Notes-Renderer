import fs from "fs";

import calculateHash from "./calculateHash";

const DESMOS_CACHE_LOCATION = process.env['INPUT_DESMOS_CACHE_PATH'];

const desmosGraph = (content: string) => {
  const hash = calculateHash(content);

  const graphData = fs.readFileSync(`${DESMOS_CACHE_LOCATION}/desmos-graph-${hash}.svg`).toString();

  return (
    `<div class="desmos-graph">
      ${graphData}
    </div>`
  );

};

export default desmosGraph;

