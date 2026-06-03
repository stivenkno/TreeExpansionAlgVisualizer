import { useGraphStore } from '../store/useGraphStore';

export function InfoPanel() {
  const events = useGraphStore((state) => state.playback.events);
  const currentIndex = useGraphStore((state) => state.playback.currentStepIndex);
  
  if (events.length === 0 || currentIndex < 0) {
    return (
      <div className="glass-panel info-panel">
        <div className="info-panel-title">Modo Editor de Grafo</div>
        <div className="info-panel-text">
          Haz doble clic en el lienzo para añadir nodos. Arrastra entre nodos para conectarlos. Haz clic en el peso de las aristas para editarlos.
        </div>
      </div>
    );
  }

  const currentEvent = events[currentIndex];

  return (
    <div className="glass-panel info-panel">
      <div className="info-panel-title">
        <span>Paso {currentIndex + 1} de {events.length}</span>
        <span>Peso Total: {currentEvent.currentMstWeight}</span>
      </div>
      <div className="info-panel-text">
        {currentEvent.description}
      </div>
    </div>
  );
}
