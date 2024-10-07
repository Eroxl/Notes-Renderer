import React from "react";

import TextNode from "src/lib/types/TextNode";
import TextBlock from "../TextBlock";
import parseNodes from "src/lib/parseNodes";

const Column: React.FC<{ node: TextNode }> = async (props) => {
  const { node } = props;

  const subNodes = node['properties']['subNodes'] as TextNode[];

  if (!subNodes.length) return;

  return (
    <div 
      className={`flex gap-4 ${node['properties'['type'] === 'col-md' && 'flex-col']}`}
    >
      {await Promise.all(subNodes.map(async (subNode) => (
        <div
          style={{
            width: `${100 / subNodes.length}%`
          }}
        >
          {await (async () => {
            if (typeof subNode === 'string') {
              return ((await parseNodes(subNode))
                .map((node) => <TextBlock node={node} />))
            }
    
            return (
              <TextBlock
                node={subNode}
              />
            );
          })()}
        </div>
      )))}
    </div>
  );
};

export default Column;
