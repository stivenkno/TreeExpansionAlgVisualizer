import { useEffect, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import '@xyflow/react/dist/style.css';

import { useGraphStore } from './store/useGraphStore';
import { CustomVertexNode } from './components/CustomVertexNode';
import { CustomWeightedEdge } from './components/CustomWeightedEdge';
import { Toolbar } from './components/Toolbar';
import { InfoPanel } from './components/InfoPanel';

const nodeTypes = { vertex: CustomVertexNode };
const edgeTypes = { weighted: CustomWeightedEdge };

function Flow() {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const onNodesChange = useGraphStore((state) => state.onNodesChange);
  const onEdgesChange = useGraphStore((state) => state.onEdgesChange);
  const onConnect = useGraphStore((state) => state.onConnect);
  const addNode = useGraphStore((state) => state.addNode);
  
  const playback = useGraphStore((state) => state.playback);
  const nextStep = useGraphStore((state) => state.nextStep);
  
  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Auto-playback logic
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (playback.isPlaying) {
      timeoutId = setTimeout(() => {
        nextStep();
      }, playback.speedMs);
    }
    return () => clearTimeout(timeoutId);
  }, [playback.isPlaying, playback.currentStepIndex, playback.speedMs, nextStep]);

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      // Offset by half of the node's dimensions (60x60) so it drops perfectly centered on the cursor
      position.x -= 30;
      position.y -= 30;

      const newNode = {
        id: uuidv4(),
        type: 'vertex' as const,
        position,
        data: { label: String.fromCharCode(65 + (nodes.length % 26)) }, // A, B, C...
      };
      
      addNode(newNode);
    },
    [screenToFlowPosition, nodes.length, addNode]
  );

  return (
    <div className="app-container" ref={reactFlowWrapper}>
      <div className="bg-gradient-anim" />
      <button
        type="button"
        onClick={() => {
          window.location.href = "https://odd-ivory-gmlgyhrm.edgeone.app/";
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
      >
        Volver
      </button>
      <Toolbar />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background gap={24} size={1} color="rgba(255,255,255,0.05)" />
        <Controls />
      </ReactFlow>
      <InfoPanel />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
