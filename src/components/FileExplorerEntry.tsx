"use client";

import { usePathname } from 'next/navigation';
import { FolderTreeEntry } from "./FileExplorer";
import Link from "next/link";
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

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

  const pathname = usePathname();
  const isActiveFile = entry.name === pathname.slice(pathname.lastIndexOf('/')+1).replaceAll('%20', ' ')

  const [isExpanded, setIsExpanded] = useState(false);

  const hasNote = entry.hasNote;

  const isFile = Boolean(entry.subFiles?.filter((subFile) => subFile.name).length);

  return (
    <div
      className="flex flex-col gap-0.5 select-none"
    >
      <span
        className={`${entry.subFiles && "font-normal"} w-full rounded-md flex flex-row ${isFile || 'ml-5'} ${hasNote || 'hover:cursor-pointer'}`}
        id={isActiveFile ? 'active-file' : ''}
        style={{
          color: entry.subFiles?.length ? fileColour : '#d0d0d0',
          backgroundColor: isActiveFile && `${fileColour}0F`,
          paddingLeft: `${indentation * 1}rem`,
        }}
        onClick={() => {
          if (hasNote) return;

          setIsExpanded(!isExpanded) 
        }}
      >
        {
          isFile && (
            <ChevronRight
              className={`h-5 w-5 my-auto hover:cursor-pointer ${isExpanded && 'rotate-90'}`}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )
        }
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
        className={`overflow-clip w-full overflow-ellipsis relative ${isExpanded || 'hidden'}`}
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