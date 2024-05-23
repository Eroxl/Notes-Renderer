import renderContent from "../renderContent";
import Node from "../types/Node";

const htmlElementRendererFactory = (
  htmlNode: string,
  htmlClass: string = "",
) => (
  async (node: Node) => (`
<${htmlNode}
  class="${htmlClass}"
>
${await renderContent(node.content)}
</${htmlNode}>`
  )
);

export default htmlElementRendererFactory;
