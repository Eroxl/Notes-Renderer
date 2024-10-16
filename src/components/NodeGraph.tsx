"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import createGraphForceSimulation from 'src/lib/graph/createGraphForceSimulation';
import createGraphView from 'src/lib/graph/createGraphView';
import drawNodes from 'src/lib/graph/drawNodes';
import drawLinks from 'src/lib/graph/drawLinks';
import { GraphNode } from 'src/lib/types/GraphNode';
import { GraphLink } from 'src/lib/types/GraphLink';
import drawConnectedNodes from 'src/lib/graph/drawConnectedNodes';
import drawNodesLabel from 'src/lib/graph/drawNodesLabel';
import { useRouter } from 'next/navigation';

const ANIMATION_LENGTH = 100;
const FINAL_OPACITY = 0.5;
const TEXT_FADE_START = 3.5;

const NodeGraph: React.FC<{
  linkData: GraphLink[],
  nodeData: GraphNode[],
}> = (props) => {
  const { linkData, nodeData } = props;
  const graph = useRef(null);
  const transform = useRef({
    x: 0,
    y: 0,
    k: 1
  });
  const currentlyHoveredNode = useRef<GraphNode | undefined>(null);
  const currentBackgroundOpacity = useRef(1);

  const router = useRouter()

  useEffect(() => {
    if (!graph.current) return;

    d3
      .select("#graph-view")
      .select("canvas")
      .remove();

    const width = graph.current.offsetWidth;
    const height = graph.current.offsetHeight;

    const simulation = createGraphForceSimulation(nodeData, linkData, width, height)
    const canvas = createGraphView(width, height);

    const canvasContext = canvas
      .node()
      .getContext('2d');

    const resetScreen = () => {
      canvasContext.clearRect(0, 0, width, height);
      canvasContext.setTransform(1, 0, 0, 1, 0, 0);
      canvasContext.translate(transform.current.x, transform.current.y);
      canvasContext.scale(transform.current.k, transform.current.k);
    }

    const tick = () => {
      resetScreen();

      const quadTree = d3.quadtree<GraphNode>()
        .x(d => d.x)
        .y(d => d.y)
        .addAll(nodeData)
        .extent([
          [0, 0],
          [width, height]
        ]);

      canvas.on("mousemove", (e) => {
        const x = (e.layerX - transform.current.x) / transform.current.k;
        const y = (e.layerY - transform.current.y) / transform.current.k;
        
        const closestNode = quadTree.find(x, y, Math.sqrt(transform.current.k) + 1);

        if (
          closestNode &&
          closestNode.id === currentlyHoveredNode.current?.id
        ) return;

        const shouldTransitonBackwards = (
          currentlyHoveredNode.current !== undefined 
          && currentlyHoveredNode.current !== null
          && !closestNode
        );

        if (shouldTransitonBackwards) {
          const baseNodeID = `${currentlyHoveredNode.current.id}`;

          const timer = setInterval(() => {
            if (
              currentlyHoveredNode.current?.id
            ) {
              clearInterval(timer);
  
              return;
            }
  
            const scaledProgress = (currentBackgroundOpacity.current - FINAL_OPACITY)/(1 - FINAL_OPACITY)
            const t = d3.easeCubic(scaledProgress);
  
            resetScreen();
            drawLinks(canvasContext, linkData, t);
            drawNodes(canvasContext, nodeData, (t * (1 - FINAL_OPACITY)) + FINAL_OPACITY);
            drawConnectedNodes(canvasContext, baseNodeID, nodeData, linkData, false);
  
            if (transform.current.k >= TEXT_FADE_START) {
              canvasContext.globalAlpha = Math.min(0.75, Math.max(transform.current.k - TEXT_FADE_START, 0) / 4);
              drawNodesLabel(canvasContext, nodeData, 1);
              canvasContext.globalAlpha = 1;
            }

            currentBackgroundOpacity.current += (1 / ANIMATION_LENGTH);
  
            if (currentBackgroundOpacity.current >= 1) {
              clearInterval(timer);
              return;
            }
          }, 1);
        }

        currentlyHoveredNode.current = closestNode;

        if (!closestNode) {
          document.body.style.cursor = '';
          return;
        }

        const hoverNodeID = `${currentlyHoveredNode.current.id}`;

        const timer = setInterval(() => {
          if (
            hoverNodeID !== currentlyHoveredNode.current?.id
          ) {
            clearInterval(timer);
            tick();

            return;
          }

          const scaledProgress = (currentBackgroundOpacity.current - FINAL_OPACITY)/(1 - FINAL_OPACITY)
          const t = d3.easeCubic(scaledProgress);

          resetScreen();
          drawLinks(canvasContext, linkData, t);
          drawNodes(canvasContext, nodeData, (t * (1 - FINAL_OPACITY)) + FINAL_OPACITY);

          if (transform.current.k >= TEXT_FADE_START) {
            canvasContext.globalAlpha = Math.min(0.75, Math.max(transform.current.k - TEXT_FADE_START, 0) / 4) / 4
            drawNodesLabel(canvasContext, nodeData, 1);
            canvasContext.globalAlpha = 1;
          }

          if (transform.current.k >= TEXT_FADE_START) {
            drawConnectedNodes(canvasContext, currentlyHoveredNode.current.id, nodeData, linkData, true, 1);
          } else {
            drawConnectedNodes(canvasContext, currentlyHoveredNode.current.id, nodeData, linkData, false);
            drawNodesLabel(canvasContext, nodeData.filter((node) => (node.id === hoverNodeID)), (6 - transform.current.k) + 1)
          }

          currentBackgroundOpacity.current -= (1 / ANIMATION_LENGTH);

          if (currentBackgroundOpacity.current <= FINAL_OPACITY) {
            clearInterval(timer);
            return;
          }
        }, 1);

        // ~ Change to pointer
        document.body.style.cursor = 'pointer';
      });

      drawLinks(canvasContext, linkData);
      drawNodes(canvasContext, nodeData);
      
      if (transform.current.k >= TEXT_FADE_START) {
        canvasContext.globalAlpha = Math.min(0.75, Math.max(transform.current.k - TEXT_FADE_START, 0) / 4)
        drawNodesLabel(canvasContext, nodeData, 1);
        canvasContext.globalAlpha = 1;
      }
    }

    canvas.call(
      d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (e) => {
          transform.current = e.transform

          tick();
        })
    )

    canvas.on('click', () => {
      if (!currentlyHoveredNode.current) return;

      
      router.push(`${currentlyHoveredNode.current.id}`)
    })

    simulation
      .on('tick', tick);
  }, [graph.current])

  return (
    <div
      id="graph-view" 
      ref={graph}
      className="w-full h-full p-0"
    />
  )
};

export default NodeGraph;
