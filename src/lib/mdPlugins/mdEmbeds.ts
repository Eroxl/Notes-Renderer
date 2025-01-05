import MarkdownIt from 'markdown-it';
import mdRegexFactory from 'markdown-it-regex'
import renderContent from '../renderContent';
import getNotePath from '../getNotePath';
import getNoteContent from '../getNoteContent';
import getPageSection from '../getPageSection';
import fs from 'fs';

const mdEmbeds = (md: MarkdownIt, _: any) => {
  md.use(
    mdRegexFactory,
    {
      name: 'embed',
      regex: /!\[\[(.*)\]\]/,
      replace: (match: string) => {
        const [pre, _sizing] = match.split('|');
        const [page, ...sections] = pre.split('#');

        const pagePath = getNotePath(page.split('.')[0]);

        // Embed image
        if (!pagePath?.endsWith('.md')) {
          if (!pagePath?.endsWith('.svg')) {
            console.error(`Unsuported file type for file ${page}`)

            return `ERROR: Unsuported file type for file ${page}`
          }

          return `
            <div class="image-embed">
              ${fs.readFileSync(pagePath)}
            </div>`
        }


        const {
          content
        } = getNoteContent(pagePath);


        if (!sections.length) {
          const {
            html,
            style
          } = renderContent(content);

          return `
            <div class="embed">
              <div class="embed-page">
                ${page}
              </div>
              <div class="embed-content">
                ${html}
              </div>
            </div>`

        }

        const sectionContent = getPageSection(content, sections);
        const {
          html,
          style
        } = renderContent(sectionContent);

        return `
            <div class="embed">
              <div class="embed-content">
                ${html}
              </div>
            </div>`
      }
    }
  )
}

export default mdEmbeds;


