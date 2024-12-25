import TextNode from "src/lib/types/TextNode";
import parseNodes from "src/lib/parseNodes";
import TextBlock from "./TextBlock";

const Quote: React.FC<{ node: TextNode}> = async (props) => {
  const { node } = props;
  const { content } = node.properties as { content: string };

  const subNodes = await parseNodes(content);

  return (
    <div
      className="border-l-2 border-nord-3 pl-3 text-[#9eafcc] my-4"
    >
      {subNodes.map((textNode) => (
        <TextBlock node={textNode} />
      ))}
    </div>
  )
}

export default Quote;
