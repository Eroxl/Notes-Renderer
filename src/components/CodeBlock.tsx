import React from 'react';
import TextNode from 'src/lib/types/TextNode';
import Content from './Content';
import DesmosGraph from './codeBlockRenderers/DesmosGraph';

type CodeBlockProps = {
  node: TextNode,
};

const codeBlockRenderers: Record<string, React.FC<{
  node: TextNode;
}>> = {
  'desmos-graph': DesmosGraph,
};

const CodeBlock: React.FC<CodeBlockProps> = (props) => {
  const { node } = props;

  const Renderer = codeBlockRenderers[node['properties']['type'] as string];

  if (Renderer) return (
    <Renderer
      node={node}
    />
  )

  return node.properties['content'] as string;
};

export default CodeBlock;
