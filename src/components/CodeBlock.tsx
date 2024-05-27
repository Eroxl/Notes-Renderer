import React from 'react';
import TextNode from 'src/lib/types/TextNode';
import DesmosGraph from './codeBlockRenderers/DesmosGraph';
import Column from './codeBlockRenderers/Column';

type CodeBlockProps = {
  node: TextNode,
};

const codeBlockRenderers: Record<string, React.FC<{
  node: TextNode;
}>> = {
  'desmos-graph': DesmosGraph,
  'col': Column,
  'col-md': Column,
};

const CodeBlock: React.FC<CodeBlockProps> = (props) => {
  const { node } = props;

  const Renderer = codeBlockRenderers[node['properties']['type'] as string];

  if (Renderer) return (
    <Renderer
      node={node}
    />
  )
};

export default CodeBlock;
