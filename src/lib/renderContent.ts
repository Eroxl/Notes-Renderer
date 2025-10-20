import markdownit, { Options } from 'markdown-it'
import mdMathJax from 'markdown-it-mathjax-chtml';
import mdCallouts from 'markdown-it-obsidian-callouts';
import { markdownItTable as mdTables } from 'markdown-it-table';
import mdWikiLinks from './mdPlugins/mdWikiLinks';
import mdCustomCodeblocks from './mdPlugins/mdCustomCodeblocks';
import fs from 'fs';
import Token from 'markdown-it/lib/token.mjs';
import tikz from './codeBlockRenderers/tikz';
import desmosGraph from './codeBlockRenderers/desmosGraph/desmosGraph';
import mdEmbeds from './mdPlugins/mdEmbeds';
import timeline from './codeBlockRenderers/timeline';
import mdCitation from './mdPlugins/mdCitation';

const mdjax = mdMathJax();
const md = markdownit({ linkify: false })
  .disable(['fence', 'link'])
  .use(mdCallouts)
  .use(mdCustomCodeblocks, {
    renderers: {
      'col': (content: string) => {
        const {
          html,
          style
        } = renderContent(content);

        return `
          <style>
            ${style}
          </style>
          <div class="col">
            ${html}
          </div>
        `;
      },
      'col-md': (content: string) => {
        const {
          html,
          style
        } = renderContent(content);

        return `
          <style>
            ${style}
          </style>
          <div class="col-md">
            ${html}
          </div>
        `;
      },
      tikz,
      'timeline-labeled': timeline,
      'desmos-graph': desmosGraph,
    }
  })
  .use(mdEmbeds)
  .use(mdCitation)
  .use(mdWikiLinks)
  .use(mdTables)
  .use(mdjax.plugin());

const mathJAXPreamble = fs.readFileSync(process.env['INPUT_PREAMBLE_PATH']).toString();

const renderContent = (content: string) => {
  const renderedContent = md
    .render(`$$${mathJAXPreamble}$$\n${content}`.replaceAll(/%%.*%%/g, ''))
    .toString()
    .replaceAll(/<a href="(\S+)\.md/g, '<a href="$1')
    .replaceAll(/href="file=([^"]+)"/g, 'href="$1"')
    .replaceAll(/<td>(.*?)\<\/td>/gm, (_: unknown, p1: string) => {
      return `<td>${p1
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&amp;', '&')}</td>`
        .replaceAll('&quot;', '"')
    })
    .replaceAll(
      /\[([^\]]+)\]\(([^\)]+)\)/g,
      (_: unknown, p1: string, p2: string) => {
        return `<a href="${p2.replace('.md', '')}">${p1}</a>`;
      }
    )
    .replaceAll(
      /(\[\^([^\]]+?)\]:) (.+?)(?:(\[\^[^\]]+?\]:)|$)/mg,
      (_: unknown, __: string, citationName: string, content: string) => {
        return `
          <span
            id="${citationName}"
            class="citation-definition"
          >
            <span class="citation-definition-id">
              ${citationName}:
            </span>
            <span class="citation-definition-content">
              ${content}
            </span>
          </span>
        `;
      }
    )
    

  return {
    html: renderedContent,
    style: mdjax.getCSS()
  };
};

export default renderContent;

