import getValidNotes from "./getValidNotes";

const pathCache = Object.fromEntries(
  getValidNotes(process.env['INPUT_NOTES_ROOT_PATH'] || '')
    .map((note) => ([
      note.url, note 
    ]))
);

const getNoteMetadata = (noteName: string) => {
  return pathCache[noteName.toLowerCase()];
};

export default getNoteMetadata;

