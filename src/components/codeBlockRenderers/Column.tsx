import React from "react";

import TextNode from "src/lib/types/TextNode";
import TextBlock from "../TextBlock";
import parseNodes from "src/lib/parseNodes";

const Column: React.FC<{ node: TextNode }> = (props) => {
  const { node } = props;

  const subNodes = node['properties']['subNodes'] as TextNode[];

  if (!subNodes.length) return;

  return (
    <div 
      className={`flex gap-4 ${node['properties'['type'] === 'col-md' && 'flex-col']}`}
    >
      {subNodes.map((subNode) => (
        <div
          style={{
            width: `${100 / subNodes.length}%`
          }}
        >
          {(() => {
            if (typeof subNode === 'string') {
              return parseNodes(subNode)
                .map((node) => <TextBlock node={node} />)
            }
    
            return (
              <TextBlock
                node={subNode}
              />
            );
          })()}
        </div>
      ))}
    </div>
  );
};

export default Column;
