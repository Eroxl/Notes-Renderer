import MarkdownIt from 'markdown-it';

declare module "markdown-it-regex" {
  interface RegexPluginOptions {
    name: string;
    regex: RegExp;
    replace: (match: RegExpMatchArray) => string;
  }

  const markdownItRegex: (md: MarkdownIt, opts: RegexPluginOptions) => void;
  export = markdownItRegex;
}

