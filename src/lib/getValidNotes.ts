import fs from 'fs';

const getValidNotes = (
  path: string,
): {
  name: string,
  path: string,
}[] => {
  const children = fs
    .readdirSync(path)
    .filter((file) => !file.startsWith('.'))

  const subDirectories = children.filter((child) => fs.lstatSync(`${path}/${child}`).isDirectory())

  return [
    ...children
      .filter((child) => fs.lstatSync(`${path}/${child}`).isFile())
      .map((child) => ({
        name: child.split('.')[0],
        path: `${path}/${child}`,
      }))
    ,
    ...subDirectories.flatMap((subDirectory) => getValidNotes(`${path}/${subDirectory}`))
  ];
};

export default getValidNotes;
