import React from "react";
import fs from "fs";

import calculateHash from "src/lib/parsers/calculateHash";
import TextNode from "src/lib/types/TextNode";

const DESMOS_CACHE_LOCATION = process.env['DESMOS_CACHE_PATH'];

const DesmosGraph: React.FC<{ node: TextNode }> = (props) => {
  const { node } = props;

  const hash = calculateHash(node.properties['content'] as string);

  const graphData = fs.readFileSync(`${DESMOS_CACHE_LOCATION}/desmos-graph-${hash}.svg`).toString();

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: graphData }}
      className="mx-auto w-min"
    />
  );
};

export default DesmosGraph;
