import Parser from "../types/Parser";

type EmebdLink = {
  url: string,
  section?: string,
  width?: number,
  height?: number,
};

const parseEmbedLink = (link: string): EmebdLink => {
  const section = link.split('#')[1];
  const aspectRatio = link.split('|')[1];

  const width = +aspectRatio?.split('x')[0] || undefined;
  const height = +aspectRatio?.split('x')[1] || undefined;

  return {
    url: link.replace(`#${section}`, '').replace(`|${aspectRatio}`, ''),
    section,
    width,
    height
  }
};

const parseEmbed: Parser = (lines: string[]) => {
  const match = lines[0].match(/^!\[\[(.*?)\]\]/);

  if (!match) return;

  return {
    consumedLines: 1,
    node: {
      type: 'embed',
      properties: parseEmbedLink(match[1])
    }
  }
};

export default parseEmbed;
