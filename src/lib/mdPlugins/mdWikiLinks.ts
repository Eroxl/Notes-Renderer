import MarkdownIt from 'markdown-it';
import mdRegexFactory from 'markdown-it-regex'

const mdWikiLinks = (md: MarkdownIt, _: any) => {
  md.use(
    mdRegexFactory,
    {
      name: 'wiki-link',
      regex: /\[\[(.*)\]\]/,
      replace: (match: string) => {
        return `<a href="./${match}">${match}</a>`
      }
    }
  )
}

export default mdWikiLinks;

