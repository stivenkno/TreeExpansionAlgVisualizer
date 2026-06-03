import {
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
  BaseEdge,
} from '@xyflow/react';
import { useGraphStore, type AppEdge } from '../store/useGraphStore';

export function CustomWeightedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<AppEdge>) {
  const updateEdgeWeight = useGraphStore((state) => state.updateEdgeWeight);
  const events = useGraphStore((state) => state.playback.events);
  const currentIndex = useGraphStore((state) => state.playback.currentStepIndex);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Check state of the edge up to current step
  let edgeState: 'DEFAULT' | 'EVALUATING' | 'ACCEPTED' | 'REJECTED' = 'DEFAULT';

  if (currentIndex >= 0 && currentIndex < events.length) {
    for (let i = 0; i <= currentIndex; i++) {
      const event = events[i];
      if (event.edgeId === id) {
        if (event.type === 'EVALUATING_EDGE') edgeState = 'EVALUATING';
        if (event.type === 'ACCEPT_EDGE') edgeState = 'ACCEPTED';
        if (event.type === 'REJECT_EDGE_CYCLE') edgeState = 'REJECTED';
      }
    }
  }

  let strokeColor = '#64748b'; // Slate 500
  let strokeWidth = 2;
  let labelColor = '#cbd5e1'; // Slate 300

  switch (edgeState) {
    case 'EVALUATING':
      strokeColor = '#f59e0b'; // Amber 500
      strokeWidth = 4;
      labelColor = '#fbbf24';
      break;
    case 'ACCEPTED':
      strokeColor = '#10b981'; // Emerald 500
      strokeWidth = 4;
      labelColor = '#34d399';
      break;
    case 'REJECTED':
      strokeColor = '#ef4444'; // Red 500
      strokeWidth = 1;
      labelColor = '#fca5a5';
      break;
    default:
      break;
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        id={id}
        style={{
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          transition: 'all 0.3s ease',
          opacity: edgeState === 'REJECTED' ? 0.3 : 1,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="edge-label-container nodrag nopan nowheel"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            borderColor: strokeColor,
            opacity: edgeState === 'REJECTED' ? 0.3 : 1,
          }}
        >
          <input
            type="number"
            value={data?.weight || 0}
            className="edge-label-input"
            style={{ color: labelColor }}
            onChange={(e) => updateEdgeWeight(id, Number(e.target.value))}
            min={1}
            max={999}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
