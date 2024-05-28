import React from 'react';

import fs from 'fs';
import fm from 'front-matter';
import FileExplorerEntry from './FileExplorerEntry';

export type FolderTreeEntry = {
  name: string,
  hasNote: boolean
  subFiles?: FolderTreeEntry[],
}

const getFolderTree = (
  path: string,
): FolderTreeEntry => {
  const isFile = fs.lstatSync(path).isFile();
  const fileName = path.slice(
    path.lastIndexOf('/')+1,
    path.lastIndexOf('.') === -1 ? undefined : path.lastIndexOf('.') 
  ) 

  if (isFile) {
    if (!path.endsWith('.md')) return;

    const fileMetadata = fm(
      fs.readFileSync(path)
        .toString()
    ).attributes

    if (fileMetadata['excalidraw-plugin'] === 'parsed') return;

    return { name: fileName, hasNote: true }
  }
  
  const subFiles = fs
    .readdirSync(path)
    .map((subFile) => getFolderTree(`${path}/${subFile}`))
    .filter((subFile) => subFile !== undefined);

  const isFolderNote = subFiles.some((subFile) => subFile['name'] === fileName && subFile['hasNote'])

  return {
    name: fileName,
    hasNote: isFolderNote,
    subFiles: subFiles
      .filter((subFile) => !(subFile['name'] === fileName && subFile['hasNote']))
  }
}

const fileTree = getFolderTree(process.env['NOTES_ROOT_PATH'] as string);

const FileExplorer: React.FC = () => (
  <div
    className="bg-nord-1 w-96 h-screen overflow-y-scroll p-4 no-scrollbar relative"
    id="nav-bar"
  >
    {fileTree.subFiles?.map((subFile) => (
      <FileExplorerEntry
        entry={subFile}
        key={subFile.name}
        fileColour="#51e1e9"
        indentation={0}
      />
    ))}
  </div>
);

export default FileExplorer;
