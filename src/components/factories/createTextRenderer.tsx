import TextNode from "src/lib/types/TextNode";

const createTextRenderer = (
  className: string,
): React.FC<{ node: TextNode }> => {
  return (props) => {
    const { node } = props;

    return (
      <div className={className}>
        {node.properties.content as string || ""}
      </div>
    )
  }
};

export default createTextRenderer;
