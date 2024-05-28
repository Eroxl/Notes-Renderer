"use client";

import { useEffect, useState } from "react";
import { FolderTreeEntry } from "./FileExplorer";
import Link from "next/link";

type FileExplorerEntryProps = {
  entry: FolderTreeEntry,
  fileColour: string,
  indentation: number
};

const FileExplorerEntry: React.FC<FileExplorerEntryProps> = (props) => {
  const {
    entry,
    fileColour,
    indentation
  } = props;

  const [isActiveFile, setIsActiveFile] = useState(false);

  const hasNote = entry.hasNote;

  useEffect(() => {
    setIsActiveFile(
      entry.name === document.URL.slice(document.URL.lastIndexOf('/')+1).replaceAll('%20', ' ')
    );
  }, [document.URL])

  return (
    <div
      className="flex flex-col gap-0.5"
    >
      <span
        className={`${entry.subFiles && "font-normal"} w-full rounded-md`}
        id={isActiveFile ? 'active-file' : ''}
        style={{
          color: entry.subFiles?.length ? fileColour : '#d0d0d0',
          backgroundColor: isActiveFile && `${fileColour}0F`,
          paddingLeft: `${indentation * 1}rem`,
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
      <div
        className="overflow-clip w-full overflow-ellipsis relative"
      >
        <div
          className="w-[0.5px] absolute left-1 -top-1 -bottom-1 bg-[#4c566a]"
          style={{
            marginLeft: `${indentation * 1}rem`,
          }}
        />
        {
          entry.subFiles
            ?.filter((subFile) => subFile.name)
            .map((subFile) => (
              <FileExplorerEntry
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

export default FileExplorerEntry;