import React from "react";
import renderers from "src/lib/constants/renderers";
import TextNode from "src/lib/types/TextNode";

const TextBlock: React.FC<{node: TextNode}> = (props) => {
  const { node } = props;
  
  const NodeRenderer = renderers[node.type];

  if (!NodeRenderer) return "";

  return (
    <NodeRenderer node={node} />
  )
}

export default TextBlock;
