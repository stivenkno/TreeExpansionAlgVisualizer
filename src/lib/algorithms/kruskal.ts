import { v4 as uuidv4 } from 'uuid';
import { DisjointSet } from './DisjointSet';
import type { AlgorithmEvent, GraphEdge } from '../types';

export function runKruskal(nodes: string[], edges: GraphEdge[]): AlgorithmEvent[] {
  const events: AlgorithmEvent[] = [];
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const dsu = new DisjointSet(nodes);
  
  let currentMstWeight = 0;
  let edgesAccepted = 0;

  for (const edge of sortedEdges) {
    events.push({
      eventId: uuidv4(),
      type: 'EVALUATING_EDGE',
      edgeId: edge.id,
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
      currentMstWeight,
      description: `Evaluando la arista ${edge.source}-${edge.target} con peso ${edge.weight}. Comprobando si hay ciclos en el Conjunto Disjunto.`,
    });

    const hasCycle = dsu.union(edge.source, edge.target);

    if (hasCycle) {
      events.push({
        eventId: uuidv4(),
        type: 'REJECT_EDGE_CYCLE',
        edgeId: edge.id,
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        currentMstWeight,
        description: `¡Ciclo detectado! Añadir la arista ${edge.source}-${edge.target} formaría un ciclo. Descartando arista.`,
      });
    } else {
      currentMstWeight += edge.weight;
      edgesAccepted++;
      events.push({
        eventId: uuidv4(),
        type: 'ACCEPT_EDGE',
        edgeId: edge.id,
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        currentMstWeight,
        description: `No se forma ningún ciclo. Arista ${edge.source}-${edge.target} aceptada. Se sumó ${edge.weight} al peso total.`,
      });
      
      if (edgesAccepted === nodes.length - 1) {
        break;
      }
    }
  }

  events.push({
    eventId: uuidv4(),
    type: 'NODE_VISITED',
    currentMstWeight,
    description: `Algoritmo de Kruskal completado. Árbol de Expansión Mínima formado con peso total: ${currentMstWeight}.`,
  });

  return events;
}
