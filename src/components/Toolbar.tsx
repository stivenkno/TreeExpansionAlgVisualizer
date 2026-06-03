import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { useGraphStore } from '../store/useGraphStore';
import { runKruskal } from '../lib/algorithms/kruskal';
import { runPrim } from '../lib/algorithms/prim';

export function Toolbar() {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const algorithm = useGraphStore((state) => state.algorithm);
  const setAlgorithm = useGraphStore((state) => state.setAlgorithm);
  const setPlaybackEvents = useGraphStore((state) => state.setPlaybackEvents);
  
  const playback = useGraphStore((state) => state.playback);
  const togglePlay = useGraphStore((state) => state.togglePlay);
  const nextStep = useGraphStore((state) => state.nextStep);
  const prevStep = useGraphStore((state) => state.prevStep);
  const resetPlayback = useGraphStore((state) => state.resetPlayback);

  const handleRun = () => {
    const nodeIds = nodes.map(n => n.id);
    const graphEdges = edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      weight: e.data?.weight || 1,
    }));

    let events = [];
    if (algorithm === 'KRUSKAL') {
      events = runKruskal(nodeIds, graphEdges);
    } else {
      events = runPrim(nodeIds, graphEdges);
    }
    
    setPlaybackEvents(events);
  };

  const isTimelineActive = playback.events.length > 0;

  return (
    <div className="glass-panel toolbar">
      <select 
        value={algorithm} 
        onChange={(e) => setAlgorithm(e.target.value as any)}
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '8px 12px',
          borderRadius: '6px',
          outline: 'none',
          fontFamily: 'inherit',
          fontWeight: 600,
        }}
      >
        <option value="KRUSKAL">Algoritmo de Kruskal</option>
        <option value="PRIM">Algoritmo de Prim</option>
      </select>

      {!isTimelineActive ? (
        <button className="btn btn-success" onClick={handleRun}>
          <Play size={16} /> Ejecutar Algoritmo
        </button>
      ) : (
        <>
          <button className="btn" onClick={prevStep} disabled={playback.currentStepIndex <= -1}>
            <SkipBack size={16} />
          </button>
          
          <button className="btn btn-success" onClick={togglePlay}>
            {playback.isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          <button className="btn" onClick={nextStep} disabled={playback.currentStepIndex >= playback.events.length - 1}>
            <SkipForward size={16} />
          </button>

          <button className="btn btn-danger" onClick={resetPlayback}>
            <RotateCcw size={16} /> Reiniciar
          </button>
        </>
      )}
    </div>
  );
}
