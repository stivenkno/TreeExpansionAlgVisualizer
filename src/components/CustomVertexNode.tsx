import { Handle, Position, type NodeProps } from '@xyflow/react';
import { X } from 'lucide-react';
import { useGraphStore, type AppNode } from '../store/useGraphStore';

export function CustomVertexNode({ id, data, selected }: NodeProps<AppNode>) {
  const updateNodeLabel = useGraphStore((state) => state.updateNodeLabel);
  const removeNode = useGraphStore((state) => state.removeNode);
  const events = useGraphStore((state) => state.playback.events);
  const currentIndex = useGraphStore((state) => state.playback.currentStepIndex);

  // Check if node is visited up to current step
  let isVisited = false;
  if (currentIndex >= 0 && currentIndex < events.length) {
    for (let i = 0; i <= currentIndex; i++) {
      const event = events[i];
      if (
        event.type === 'NODE_VISITED' &&
        (event.sourceNodeId === id || event.targetNodeId === id)
      ) {
        isVisited = true;
      }
      if (
        event.type === 'ACCEPT_EDGE' &&
        (event.sourceNodeId === id || event.targetNodeId === id)
      ) {
        isVisited = true;
      }
    }
  }

  // Animation classes
  let nodeClass = 'custom-node';
  if (selected) nodeClass += ' selected';
  if (isVisited) nodeClass += ' visited'; // We can add custom CSS for visited state

  return (
    <div
      className={nodeClass}
      style={{
        boxShadow: isVisited ? '0 0 15px rgba(16, 185, 129, 0.6), inset 0 0 20px rgba(16, 185, 129, 0.4)' : undefined,
        borderColor: isVisited ? '#34d399' : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} id="top" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
      
      <button 
        className="node-delete-btn" 
        onClick={() => removeNode(id)}
        title="Eliminar Nodo"
      >
        <X size={12} strokeWidth={3} />
      </button>

      <input
        type="text"
        className="custom-node-input nodrag"
        value={data?.label}
        onChange={(e) => updateNodeLabel(id, e.target.value)}
        maxLength={3}
      />
    </div>
  );
}
