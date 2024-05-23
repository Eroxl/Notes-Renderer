import renderContent from "../renderContent";
import Node from "../types/Node";

const calloutRenderer = async (
  node: Node
) => `
<div
  class="callout" data-callout-type="${node.properties['type']}"
>
<div
  class="callout-title"
>
${node.properties['title'] || node.properties['type']}
</div>
<div
  class="callout-content"
>
${await renderContent(node.content)}
</div>
</div>
`;

export default calloutRenderer;
