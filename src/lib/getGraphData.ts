import getValidNotes, { cleanURL } from './getValidNotes';
import getNoteContent from './getNoteContent';
import { GraphNode } from './types/GraphNode';
import { GraphLink } from './types/GraphLink';

// [[Page]], [[Page#anchor]], [[Page|text]], [[Page#anchor|text]]
const WIKI_LINK_REGEX = /\[\[([^\]|#\n]+)(?:#[^\]|\n]*)?(?:\|[^\]\n]*)?\]\]/g;
// [text](Page.md) or [text](Some%20Page.md) — local .md links only
const MD_LINK_REGEX = /\[[^\]]*\]\(([^)]+\.md)\)/g;

const getGroup = (notePath: string, notesPath: string): string => {
  const relative = notePath.slice(notesPath.length + 1);
  const parts = relative.split('/');
  return parts.length > 1 ? parts[0] : '';
};

const addLink = (
  sourceUrl: string,
  rawTarget: string,
  nodeIdSet: Set<string>,
  linkSet: Set<string>,
  links: GraphLink[],
) => {
  const targetUrl = cleanURL(rawTarget.replace(/\.md$/i, '').trim());
  if (!nodeIdSet.has(targetUrl) || targetUrl === sourceUrl) return;
  const key = [sourceUrl, targetUrl].sort().join('\0');
  if (linkSet.has(key)) return;
  linkSet.add(key);
  links.push({ source: sourceUrl, target: targetUrl });
};

const EXCLUDED_FOLDERS = ['99 - Classes', '13 - Politics'];

const shouldExclude = (notePath: string, notesPath: string): boolean => {
  if (!notePath.endsWith('.md')) return true;

  const relative = notePath.slice(notesPath.length + 1);
  const topFolder = relative.split('/')[0];
  if (EXCLUDED_FOLDERS.some(f => topFolder === f)) return true;

  const { metadata } = getNoteContent(notePath);
  if ((metadata as Record<string, unknown>)['excalidraw-plugin'] === 'parsed') return true;

  return false;
};

const getGraphData = (notesPath: string): { nodes: GraphNode[], links: GraphLink[] } => {
  const notes = getValidNotes(notesPath).filter(n => !shouldExclude(n.path, notesPath));

  const nodes: GraphNode[] = notes.map(note => ({
    id: note.url,
    name: note.name,
    group: getGroup(note.path, notesPath),
    linkCount: 0,
  }));

  const nodeIdSet = new Set(nodes.map(n => n.id));
  const linkSet = new Set<string>();
  const links: GraphLink[] = [];

  for (const note of notes) {
    const { content } = getNoteContent(note.path);

    let match: RegExpExecArray | null;

    const wikiRe = new RegExp(WIKI_LINK_REGEX.source, 'g');
    while ((match = wikiRe.exec(content)) !== null) {
      addLink(note.url, match[1], nodeIdSet, linkSet, links);
    }

    const mdRe = new RegExp(MD_LINK_REGEX.source, 'g');
    while ((match = mdRe.exec(content)) !== null) {
      addLink(note.url, match[1], nodeIdSet, linkSet, links);
    }
  }

  const nodeById = new Map(nodes.map(n => [n.id, n]));
  for (const link of links) {
    nodeById.get(link.source as string)!.linkCount++;
    nodeById.get(link.target as string)!.linkCount++;
  }

  return { nodes, links };
};

export default getGraphData;
