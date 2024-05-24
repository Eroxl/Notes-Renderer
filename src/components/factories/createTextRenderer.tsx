import TextNode from "src/lib/types/TextNode";

const createTextRenderer = (
  className: string,
): React.FC<{ node: TextNode }> => {
  return (props) => {
    const { node } = props;

    return (
      <div className={className}>
        {(node.properties.content as string || "").split('\n').flatMap((text, index) => {
          if (index % 2 === 0) return text;

          return [
            <br />,
            text
          ]
        })}
      </div>
    )
  }
};

export default createTextRenderer;
