import fs from 'fs';
import fm from "front-matter";

const getLinks = (content: string): string[] => {
  const links = [];

  const markdownLinks = content.matchAll(/\[\[(.*?)\]\]/g);

  markdownLinks.forEach((a) => {
    const pageName = a[1].split('#')[0];
    const fileExtension = pageName.split('.')[1];

    content = content.replaceAll(a[0], '');

    if (fileExtension && !fileExtension.endsWith('md')) return;

    links.push(a[1].split('#')[0].split('|')[0]);
  })

  const wikiLinks = content.matchAll(/\[(.*?)\]\(([^)]*)\)/g);

  wikiLinks.forEach((a) => {
    links.push(decodeURI(a[2].split('.')[0]))
  })

  return links;
};

const getConnections = (notePath: string): string[] => {
  const { body: noteContent } = fm(
    fs.readFileSync(notePath)
      .toString()
  );

  const links = getLinks(noteContent)

  return links;
};

export default getConnections;
