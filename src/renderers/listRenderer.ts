import renderContent from "../renderContent";
import Node from "../types/Node";

const listRenderer = async (
  node: Node
): Promise<string> => (`
<ul>
<li>
${await renderContent(node.content)}
</li>
${
  node.properties['subNodes']
    ? (await Promise.all((node.properties['subNodes'] as Node[]).map(async (node) => await listRenderer(node)))).join('\n')
    : ""
}
</ul>`
)

export default listRenderer;
