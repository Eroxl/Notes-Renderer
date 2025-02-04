import getValidNotes from "./getValidNotes";

const pathCache = Object.fromEntries(
  getValidNotes(process.env['INPUT_NOTES_ROOT_PATH'] || '')
    .map((note) => ([
      note.name.toLowerCase(), note.path
    ]))
);

const getNotePath = (noteName: string): string | undefined => {
  return pathCache[noteName.toLowerCase()];
};

export default getNotePath;

