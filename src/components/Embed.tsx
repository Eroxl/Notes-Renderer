import fs from 'fs';

import TextNode from "src/lib/types/TextNode";
import getNoteContent from "src/lib/getNoteContent";
import getNotePath from "src/lib/getNotePath";
import TextBlock from "./TextBlock";

const Embed: React.FC<{ node: TextNode}> = (props) => {
  const { node } = props;

  const {
    url,
    section,
    width,
    height,
  } = node['properties'];

  const fileExtension = (url as string).split('.')[1];

  const isImage = fileExtension !== 'md' && fileExtension !== undefined;

  if (isImage) {
    return (
      <img
        src={`./${url}`}
        width={width as number}
        height={height as number}

        className="aspect-auto"
      />
    )
  }

  const [pageContent, pageMetadata] = getNoteContent(getNotePath(url as string));

  if (pageMetadata['excalidraw-plugin'] === 'parsed') {
    const notePath = getNotePath(url as string);

    const cachedImagePath = notePath.slice(0, notePath.lastIndexOf('.')) + '.svg';

    const svgData = fs.readFileSync(cachedImagePath).toString();

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: svgData }}
        className="mx-auto excalidraw-image"

        style={{
          maxWidth: width as number,
          maxHeight: height as number
        }}
      />
    )
  }

  return (
    <div
      className="border-l-2 border-nord-10 pl-8 py-2 mb-8"
    >
      <div
        className="font-bold"
      >
        {url as string}
      </div>

      {
        pageContent
          .map((textNode) => (
            <TextBlock node={textNode} />
          ))
      }
    </div>
  )
}

export default Embed;
