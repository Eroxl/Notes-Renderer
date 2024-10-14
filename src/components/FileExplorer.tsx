import React from 'react';

import fs from 'fs';
import fm from 'front-matter';
import FileExplorerEntry from './FileExplorerEntry';
import Link from 'next/link';
import { ScatterChartIcon } from 'lucide-react';

export type FolderTreeEntry = {
  name: string,
  hasNote: boolean
  subFiles?: FolderTreeEntry[],
}

const getFolderTree = (
  path: string,
): FolderTreeEntry => {
  const isFile = fs.lstatSync(path).isFile();

  const hasFileExtension = path.slice(path.lastIndexOf('/')+1).lastIndexOf('.') !== -1;

  const fileName = path.slice(
    path.lastIndexOf('/')+1,
    hasFileExtension ? path.lastIndexOf('.') : undefined
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

const fileTree = getFolderTree(process.env['INPUT_NOTES_ROOT_PATH'] as string);

const FileExplorer: React.FC = () => (
  <div className="w-96 h-screen flex flex-col bg-nord-1">
    <div className="flex flex-col gap-2 px-2 mt-5">
      <Link href="/" >
        <span className="h-5 flex flex-col justify-center text-xl font-bold text-white/90 hover:bg-white/5 p-2 py-4 rounded">
          Eroxl's Notes
        </span>
      </Link>
      <Link href="/graph" className="flex flex-row items-center h-5 w-full p-2 py-4 gap-2 text-white/90 hover:bg-white/5 rounded">
        <ScatterChartIcon className="h-5 w-5 aspect-square" />
        <span className="lex flex-row justify-center text-md font-bold">
          Graph
        </span>
      </Link>
      <div className="w-full h-0.5 rounded-full mt-2 bg-white/20" />
    </div>
    <div
      className="h-full overflow-y-scroll p-4 no-scrollbar relative"
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
  </div>
);

export default FileExplorer;
