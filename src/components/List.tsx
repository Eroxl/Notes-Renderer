import React from 'react';
import TextNode from 'src/lib/types/TextNode';
import Content from './Content';

type ListProps = {
  node: TextNode,
};

const List: React.FC<ListProps> = (props) => {
  const { node } = props;

  return (
    <ul
      className="list-disc list-inside pl-4 w-full marker:text-[#4c566a]"
    >
      <li>
        <Content textContent={node.properties['content'] as string} />
      </li>

      <div
        className="pl-4 ml-[0.23rem] w-full border-l border-[#4c566a]"
      >
        {
          node.properties['subNodes'] && (node.properties['subNodes'] as TextNode[])?.map((subNode) => (
            <List node={subNode} />
          ))
        }
      </div>
    </ul>
  )
};

export default List;
