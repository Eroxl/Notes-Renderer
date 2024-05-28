import React from 'react';

import fs from 'fs';
import Link from 'next/link';
import fm from 'front-matter';

type FileExplorerProps = {
  pagePath: string,
}

type FolderTreeEntry = {
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

type FileExplorerEntryProps = {
  entry: FolderTreeEntry,
  activeFile: string,
  fileColour: string,
  indentation: number
};

const FileExplorerEntry: React.FC<FileExplorerEntryProps> = (props) => {
  const {
    activeFile,
    entry,
    fileColour,
    indentation
  } = props;

  const isActiveFile = entry.name === activeFile;
  const hasNote = entry.hasNote;

  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`${entry.subFiles && "font-normal"} w-full rounded-md`}
        style={{
          color: entry.subFiles?.length ? fileColour : '#d0d0d0',
          paddingLeft: `${indentation * 0.5}rem`,
          backgroundColor: isActiveFile && `${fileColour}0F`,
        }}
      >
        {
          hasNote
            ? (
              <Link
                href={entry.name}
              >
                {entry.name}
              </Link>
            )
            : entry.name
        }
      </span>
      <div className="overflow-clip w-full overflow-ellipsis">
        {
          entry.subFiles
            ?.filter((subFile) => subFile.name)
            .map((subFile) => (
              <FileExplorerEntry
                activeFile={activeFile}
                entry={subFile}
                fileColour={fileColour}
                indentation={indentation + 1}
                key={subFile.name}
              />
            ))
        }
      </div>
    </div>
  )
};

const FileExplorer: React.FC<FileExplorerProps> = (props) => {
  const { pagePath } = props;

  const fileTree = getFolderTree(process.env['NOTES_ROOT_PATH'] as string);

  return (
    <div className="bg-nord-1 w-96 h-screen overflow-y-scroll p-4 no-scrollbar relative">
      {fileTree.subFiles?.map((subFile) => (
        <FileExplorerEntry
          activeFile={pagePath}
          entry={subFile}
          key={subFile.name}
          fileColour="#51e1e9"
          indentation={0}
        />
      ))}
    </div>
  )
};

export default FileExplorer;
