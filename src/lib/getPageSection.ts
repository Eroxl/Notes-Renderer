const findSingleBlock = (pageContent: string, blockID: string) => {
  const lines = pageContent.split('\n');

  const blockIDIndex = lines.indexOf(blockID);

  if (!blockIDIndex) return `No block with id ${blockID}`;

  const linesBeforeBlockID = lines.slice(0, blockIDIndex).reverse();

  let output = '';

  for (let i = 0; i < linesBeforeBlockID.length; i++) {
    const line = linesBeforeBlockID[i];

    if (line === '' && !output.length) continue;

    if (line === '$$' && output.startsWith('$$')) return `${output}$$`;

    if (line !== '$$' && !output.startsWith('$$')) return line;

    output += line;
  }
}

const getPageSection = (pageContent: string, sections: string[]) => {
  const isSingleBlock = sections[0].startsWith('^');

  if (isSingleBlock) return findSingleBlock(pageContent, sections[0]);

  let outputContent = '';

  const lines = pageContent.split('\n');

  const getHeadingDepth = (line: string) => {
    return line.match(/^#+/)?.[0].length || 7;
  }

  let path = sections;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingDepth = getHeadingDepth(line);

    if (headingDepth <= getHeadingDepth(outputContent) && outputContent !== '') break;

    if (outputContent !== '') {
      outputContent += `${line}\n`;
      continue;
    }

    if (!line.trimEnd().endsWith(`# ${path[0]}`)) continue;

    path = path.slice(1);

    if (path.length !== 0) continue;

    outputContent += `${line}\n`
  }

  return outputContent;
};

export default getPageSection;

