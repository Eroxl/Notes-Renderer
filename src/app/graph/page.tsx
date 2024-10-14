import fs from 'fs';
import React from 'react';
import fm from 'front-matter';

import getValidNotes from 'src/lib/getValidNotes';
import getConnections from 'src/lib/getConnections';
import NodeGraph from 'src/components/NodeGraph';
import getNotePath from 'src/lib/getNotePath';
import { GraphLink } from 'src/lib/types/GraphLink';
import { GraphNode } from 'src/lib/types/GraphNode';

const isValidPage = (page: string) => {
  const notePath = getNotePath(page);
  
  if (!notePath) return true;

  const { attributes } = fm(
    fs
      .readFileSync(notePath)
      .toString()
  );

  return attributes['excalidraw-plugin'] !== 'parsed';
}

const formatGraphData = (pages: {
  name: string,
  group: string,
  links: string[],
}[]) => {
  const validNodes = Object.fromEntries(pages.map((node) => [node.name, true]))
  const nodeData: GraphNode[] = [];

  const linkData: GraphLink[] = pages
    .flatMap((node) => {
      node.links
        .forEach((link) => {
          if (validNodes[link]) return;

          validNodes[link] = true;
          nodeData.push({
            id: link,
            group: 'non-existant'
          })
        })

      return (
          node.links.map((link) => ({
          source: node.name,
          target: link,
        }))
      );
    })

    
  nodeData.push(...pages.map((page) => ({
    id: page.name,
    group: page.group,
  })))
  
  return [linkData, nodeData] as const;
}

const Graph = async () => {
  const notesPath = process.env['INPUT_NOTES_ROOT_PATH']

  if (!notesPath) throw new Error("No notes path provided");

  const [links, nodes] = formatGraphData(
    getValidNotes(notesPath)
      .map((note) => ({
        name: note.name,
        group: note.path.replace(notesPath, '').split('/')[1].split('/')[0],
        links: getConnections(note.path).filter(isValidPage),
      }))
      .filter((page) => isValidPage(page.name))
  );

  return (
    <NodeGraph
      nodeData={nodes}
      linkData={links}
    />
  );
}

export default Graph;
