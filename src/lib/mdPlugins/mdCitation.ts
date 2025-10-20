import MarkdownIt from 'markdown-it';
import mdRegexFactory from 'markdown-it-regex'

const mdCitation = (md: MarkdownIt, _: any) => {
  md.use(
    mdRegexFactory,
    {
      name: 'citation',
      regex: /\[\^([^\]]+?)\](?!:)/,
      replace: (match: string) => {
        return `<sup class=\"citation\">
          <a
            href=\"#${match}\"
            onclick="document.getElementById('${match}').scrollIntoView(); return false;"
          >
            [${match}]
          </a>
        </sup>`;
      }
    },
  );
}

export default mdCitation;

