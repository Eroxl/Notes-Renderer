import MarkdownIt from 'markdown-it';
import mdRegexFactory from 'markdown-it-regex'

const mdWikiLinks = (md: MarkdownIt, _: any) => {
  md.use(
    mdRegexFactory,
    {
      name: 'wiki-link',
      regex: /\[\[(.*?)\]\]/,
      replace: (match: string) => {
        const portions = match.split("|");

        const text = portions.length === 2 ? portions[1] : portions[0];
        const link = portions[0];


        return `<a href="./${link}">${text}</a>`;
      }
    }
  )
}

export default mdWikiLinks;

