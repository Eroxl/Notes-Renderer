import fs from 'fs';
import NoteFile from './types/NoteFile';

const getNotes = (
  path: string,
): NoteFile[] => {
  const children = fs
    .readdirSync(path)
    .filter((file) => !file.startsWith('.'))

  const subDirectories = children.filter((child) => fs.lstatSync(`${path}/${child}`).isDirectory())

  return [
    ...children
      .filter((child) => child.endsWith('.md'))
      .map((child) => ({
        name: child,
        path: `${path}/${child}`
      }))
    ,
    ...subDirectories.flatMap((subDirectory) => getNotes(`${path}/${subDirectory}`))
  ];
};

export default getNotes;
