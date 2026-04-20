import React from 'react';
import NodeGraph from 'src/components/NodeGraph';
import getGraphData from 'src/lib/getGraphData';

const GraphPage = () => {
  const { nodes, links } = getGraphData(process.env['INPUT_NOTES_ROOT_PATH'] as string);

  return (
    <main className="w-full h-full">
      <NodeGraph nodeData={nodes} linkData={links} />
    </main>
  );
};

export default GraphPage;
