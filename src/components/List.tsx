import React from 'react';
import TextNode from 'src/lib/types/TextNode';

type ListProps = {
  node: TextNode,
};

const List: React.FC<ListProps> = (props) => {
  const { node } = props;

  return (
    <ul>
      <li>
        {node.properties['content'] as string}
      </li>

      {
        node.properties['subNodes'] && (node.properties['subNodes'] as TextNode[])?.map((subNode) => (
          <List node={subNode} />
        ))
      }
    </ul>
  )
};

export default List;
