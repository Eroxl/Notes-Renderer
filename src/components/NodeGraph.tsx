"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import createGraphForceSimulation from 'src/lib/graph/createGraphForceSimulation';
import createGraphView from 'src/lib/graph/createGraphView';
import drawNodes from 'src/lib/graph/drawNodes';
import drawLinks from 'src/lib/graph/drawLinks';
import { GraphNode } from 'src/lib/types/GraphNode';
import { GraphLink } from 'src/lib/types/GraphLink';
import drawConnectedNodes from 'src/lib/graph/drawConnectedNodes';
import drawNodesLabel from 'src/lib/graph/drawNodesLabel';
import { nodeRadius } from 'src/lib/graph/drawNodes';
import { useRouter } from 'next/navigation';

interface GraphPreviewState {
  href: string;
  x: number;
  y: number;
  key: number;
}

const TEXT_FADE_START = 3.5;
const HOVER_EASE = 0.15;
const MAX_NODE_HOVER_RADIUS = 30; // world-space upper bound for quadtree search

const NodeGraph: React.FC<{
  linkData: GraphLink[],
  nodeData: GraphNode[],
}> = (props) => {
  const { linkData, nodeData } = props;
  const graph = useRef<HTMLDivElement>(null);
  const transform = useRef({ x: 0, y: 0, k: 1 });
  const currentlyHoveredNode = useRef<GraphNode | null>(null);
  const displayHoveredNode = useRef<GraphNode | null>(null);
  const hoverProgress = useRef(0);
  const hoverAnimFrame = useRef<number | null>(null);

  const router = useRouter();
  const [preview, setPreview] = useState<GraphPreviewState | null>(null);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animateOutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animateToRef = useRef<(target: number) => void>(() => {});
  const previewKey = useRef(0);

  useEffect(() => {
    if (!graph.current) return;

    d3.select('#graph-view').select('canvas').remove();

    const width = graph.current.offsetWidth;
    const height = graph.current.offsetHeight;

    const simulation = createGraphForceSimulation(nodeData, linkData, width, height);
    const canvas = createGraphView(width, height);

    const dpr = window.devicePixelRatio ?? 1;
    const canvasContext = canvas.node()!.getContext('2d')!;
    canvasContext.scale(dpr, dpr);

    let pendingZoomFrame: number | null = null;

    // Quadtree updated each simulation tick; read by the single mousemove handler
    let quadTree = d3.quadtree<GraphNode>()
      .x(d => d.x ?? 0)
      .y(d => d.y ?? 0);

    const resetScreen = () => {
      canvasContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvasContext.clearRect(0, 0, width, height);
      canvasContext.translate(transform.current.x, transform.current.y);
      canvasContext.scale(transform.current.k, transform.current.k);
    };

    const getHoverCluster = (hoveredId: string): Set<string> => {
      const ids = new Set<string>([hoveredId]);
      linkData.forEach(link => {
        const s = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source as string;
        const t = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target as string;
        if (s === hoveredId) ids.add(t);
        if (t === hoveredId) ids.add(s);
      });
      return ids;
    };

    const redraw = () => {
      resetScreen();

      const p = hoverProgress.current;
      const display = displayHoveredNode.current;

      const bgNodeOpacity = 1 - (1 - 0.15) * p;
      const bgLinkOpacity = 0.35 - (0.35 - 0.08) * p;

      drawLinks(canvasContext, linkData, bgLinkOpacity);
      drawNodes(canvasContext, nodeData, bgNodeOpacity);

      if (display && p > 0) {
        const clusterIds = getHoverCluster(display.id);
        const clusterNodes = nodeData.filter(n => clusterIds.has(n.id));

        drawConnectedNodes(canvasContext, display.id, nodeData, linkData);
        drawNodes(canvasContext, clusterNodes);

        const labelScale = Math.max(1, 4 / transform.current.k);
        const labelNodes = transform.current.k >= TEXT_FADE_START ? clusterNodes : [display];
        canvasContext.globalAlpha = p;
        drawNodesLabel(canvasContext, labelNodes, labelScale);
        canvasContext.globalAlpha = 1;
      }

      if (p < 0.01 && transform.current.k >= TEXT_FADE_START) {
        const alpha = Math.min(0.75, Math.max(transform.current.k - TEXT_FADE_START, 0) / 4);
        canvasContext.globalAlpha = alpha;
        drawNodesLabel(canvasContext, nodeData, 1);
        canvasContext.globalAlpha = 1;
      }
    };

    const animateTo = (target: number) => {
      if (hoverAnimFrame.current !== null) cancelAnimationFrame(hoverAnimFrame.current);

      const step = () => {
        const diff = target - hoverProgress.current;
        if (Math.abs(diff) < 0.01) {
          hoverProgress.current = target;
          if (target === 0) displayHoveredNode.current = null;
          redraw();
          hoverAnimFrame.current = null;
          return;
        }
        hoverProgress.current += diff * HOVER_EASE;
        redraw();
        hoverAnimFrame.current = requestAnimationFrame(step);
      };

      hoverAnimFrame.current = requestAnimationFrame(step);
    };

    animateToRef.current = animateTo;

    // Single mousemove handler — registered once, reads live quadTree
    canvas.on('mousemove', (e: MouseEvent) => {
      const x = (e.offsetX - transform.current.x) / transform.current.k;
      const y = (e.offsetY - transform.current.y) / transform.current.k;
      const candidate = quadTree.find(x, y, MAX_NODE_HOVER_RADIUS);
      const dx = x - (candidate?.x ?? 0);
      const dy = y - (candidate?.y ?? 0);
      const closestNode = candidate && Math.sqrt(dx * dx + dy * dy) <= nodeRadius(candidate)
        ? candidate
        : undefined;

      if (closestNode?.id === currentlyHoveredNode.current?.id) return;

      currentlyHoveredNode.current = closestNode ?? null;

      if (closestNode) {
        displayHoveredNode.current = closestNode;
        document.body.style.cursor = 'pointer';
        if (animateOutTimer.current) { clearTimeout(animateOutTimer.current); animateOutTimer.current = null; }
        animateTo(1);

        if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
        const canvasRect = canvas.node()!.getBoundingClientRect();
        const screenX = (closestNode.x ?? 0) * transform.current.k + transform.current.x + canvasRect.left;
        const screenY = (closestNode.y ?? 0) * transform.current.k + transform.current.y + canvasRect.top;
        setPreviewLoaded(false);
        setPreview({ href: `/${closestNode.id}`, x: screenX, y: screenY, key: ++previewKey.current });
      } else {
        document.body.style.cursor = '';
        if (animateOutTimer.current) clearTimeout(animateOutTimer.current);
        animateOutTimer.current = setTimeout(() => { animateTo(0); }, 120);
        hideTimer.current = setTimeout(() => { setPreview(null); }, 150);
      }
    });

    const tick = () => {
      // Rebuild quadtree with latest node positions each simulation step
      quadTree = d3.quadtree<GraphNode>()
        .x(d => d.x ?? 0)
        .y(d => d.y ?? 0)
        .addAll(nodeData);

      redraw();
    };

    canvas.call(
      d3.zoom<HTMLCanvasElement, unknown>()
        .scaleExtent([0.25, 6])
        .on('zoom', (e) => {
          transform.current = e.transform;
          if (pendingZoomFrame === null) {
            pendingZoomFrame = requestAnimationFrame(() => {
              pendingZoomFrame = null;
              redraw();
            });
          }
        }),
    );

    canvas.on('click', () => {
      if (!currentlyHoveredNode.current) return;
      router.push(`/${currentlyHoveredNode.current.id}`);
    });

    simulation.on('tick', tick);

    return () => {
      simulation.stop();
      if (hoverAnimFrame.current !== null) cancelAnimationFrame(hoverAnimFrame.current);
      if (hideTimer.current !== null) clearTimeout(hideTimer.current);
      if (animateOutTimer.current !== null) clearTimeout(animateOutTimer.current);
      document.body.style.cursor = '';
    };
  }, []);

  const PREVIEW_W = 420;
  const PREVIEW_H = 320;
  const previewUrl = preview
    ? (() => { const u = new URL(preview.href, window.location.href); u.searchParams.set('preview', '1'); return u.toString(); })()
    : null;
  const previewX = preview ? Math.min(preview.x - PREVIEW_W / 2, window.innerWidth - PREVIEW_W - 8) : 0;
  const previewY = preview
    ? (preview.y + 16 + PREVIEW_H > window.innerHeight ? preview.y - PREVIEW_H - 16 : preview.y + 16)
    : 0;

  return (
    <>
      <div
        id="graph-view"
        ref={graph}
        className="w-full h-full p-0"
      />

      {preview && previewUrl && (
        <div
          className="fixed z-50 bg-nord-0 rounded-lg overflow-hidden shadow-2xl border border-white/10 px-3 transition-opacity duration-150"
          style={{ left: previewX, top: previewY, width: PREVIEW_W, height: PREVIEW_H, opacity: previewLoaded ? 1 : 0 }}
          onMouseEnter={() => {
            if (animateOutTimer.current) { clearTimeout(animateOutTimer.current); animateOutTimer.current = null; }
            if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
          }}
          onMouseLeave={() => {
            animateToRef.current(0);
            hideTimer.current = setTimeout(() => { setPreview(null); }, 150);
          }}
        >
          <iframe
            ref={iframeRef}
            key={preview.key}
            src={previewUrl}
            className="w-full h-full bg-nord-0"
            style={{ overflow: 'hidden' }}
            sandbox="allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            onLoad={() => { iframeRef.current?.blur(); setPreviewLoaded(true); }}
          />
        </div>
      )}
    </>
  );
};

export default NodeGraph;
