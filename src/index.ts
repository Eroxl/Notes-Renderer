import fs from 'fs';
import { config } from 'dotenv';
import frontmatter from 'front-matter';

import getNotes from './getNotes';
import parseNote from './parseNote';
import renderNote from './renderNote';

// ~ Load environment variables
config();

const {
  NOTES_ROOT_PATH,
  OUTPUT_PATH 
} = process.env;

if (!NOTES_ROOT_PATH) throw new Error('Missing arg `NOTES_ROOT_PATH`');
if (!OUTPUT_PATH) throw new Error('Missing arg `OUTPUT_PATH`');

const notes = getNotes(NOTES_ROOT_PATH)
  .sort();

if (!notes.length) throw new Error('No notes found');

if (!fs.existsSync(`./${OUTPUT_PATH}`)) {
  fs.mkdirSync(`./${OUTPUT_PATH}`);
}

notes.forEach((note) => {
  const attributes = frontmatter(fs.readFileSync(note.path)
    .toString()).attributes as Record<string, unknown> | undefined;

  if (attributes && attributes['excalidraw-plugin'] === 'parsed') return;

  const aliases = attributes ? (attributes['aliases'] as string[] || []) : []

  renderNote(
    parseNote(note.path),
    note.name,
    aliases
  )
    .then((result) => {
      fs.writeFileSync(
        `./${OUTPUT_PATH}/${note.name}`.replace('.md', '.html'),
        result
      )
    })
    .catch(() => {
      console.log(note.name);
    })
})

fs.copyFileSync('./src/styles.css', `${OUTPUT_PATH}/styles.css`)
