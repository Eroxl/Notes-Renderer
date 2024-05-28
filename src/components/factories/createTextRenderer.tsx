import TextNode from "src/lib/types/TextNode";
import Content from "../Content";

const createTextRenderer = (
  className: string,
): React.FC<{ node: TextNode }> => {
  return (props) => {
    const { node } = props;

    return (
      <div className={className}>
        {(node.properties.content as string || "").split('\n').flatMap((text, index) => {
          if (index % 2 === 0) return <Content textContent={text} />;

          return [
            <br />,
            <Content textContent={text} />
          ]
        })}
      </div>
    )
  }
};

export default createTextRenderer;
