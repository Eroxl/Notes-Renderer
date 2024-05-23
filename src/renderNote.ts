import Node from "./types/Node"
import RENDERERS from "./constants/RENDERERS";
import renderContent from "./renderContent";

const renderAliases = (aliases: string[]) => `
<div class="aliases">
  <div class="title">
    aliases
  </div>
  <div class="entries">
    ${aliases.join(", ")}
  </div>
</div>
`

const renderNotes = async (nodes: Node[], pageTitle: string, aliases: string[]) => (
  `
  <!DOCTYPE html>
  <head>
    <link rel="stylesheet" type="text/css" href="./styles.css"></link>
  </head>
  <body>
    <div class="page">
      <div class="title">
        ${pageTitle.split('.').slice(0, -1).join('.')}
      </div>

      ${aliases.length ? renderAliases(aliases) : ""}

      <div class="content">
        ${
          (await Promise.all(nodes
            .slice(aliases.length ? aliases.length + 3 : 0)
            .map(async (node) => {
                if (node.type === 'comment') return;

                if (!RENDERERS[node.type]) return `<span>${await renderContent(node.content)}</span><br/>`

                return await RENDERERS[node.type](node);
            })
          )).join('\n')
        }
      </div>
    </div>
  </body>
  `
);

export default renderNotes;
