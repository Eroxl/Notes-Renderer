import MarkdownIt from 'markdown-it';
import mdRegexFactory from 'markdown-it-regex'
import { cleanURL } from '../getValidNotes';

const mdWikiLinks = (md: MarkdownIt, _: any) => {
  md.use(
    mdRegexFactory,
    {
      name: 'wiki-link',
      regex: /\[\[(.*?)\]\]/,
      replace: (match: string) => {
        const portions = match.split("|");

        const text = portions.length === 2 ? portions[1] : portions[0];
        const linkParts = portions[0].split('#');
        const page = cleanURL(linkParts[0]);
        const anchor = linkParts.length > 1 ? `#${cleanURL(linkParts[1])}` : '';
        const href = page ? `../${page}${anchor}` : anchor;

        return `<a href="${href}">${text}</a>`;
      }
    }
  )
}

export default mdWikiLinks;

