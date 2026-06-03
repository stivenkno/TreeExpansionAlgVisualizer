import { v4 as uuidv4 } from 'uuid';
import { MinHeap } from './MinHeap';
import type { AlgorithmEvent, GraphEdge } from '../types';

export function runPrim(nodes: string[], edges: GraphEdge[]): AlgorithmEvent[] {
  const events: AlgorithmEvent[] = [];
  if (nodes.length === 0) return events;

  // Build adjacency list
  const adjList: Map<string, GraphEdge[]> = new Map();
  for (const node of nodes) {
    adjList.set(node, []);
  }
  for (const edge of edges) {
    adjList.get(edge.source)?.push(edge);
    // Since it's an undirected graph, we add the edge to both nodes
    // but we need to create a reversed edge for the target node's list
    adjList.get(edge.target)?.push({
      id: edge.id,
      source: edge.target,
      target: edge.source,
      weight: edge.weight,
    });
  }

  const startNode = nodes[0];
  const visited = new Set<string>();
  const minHeap = new MinHeap<{ target: string; edgeId: string; source: string }>();

  let currentMstWeight = 0;

  // Initialize with start node
  visited.add(startNode);
  events.push({
    eventId: uuidv4(),
    type: 'NODE_VISITED',
    sourceNodeId: startNode,
    currentMstWeight,
    description: `Iniciando el algoritmo de Prim en el vértice ${startNode}. Añadiendo aristas adyacentes a la cola de prioridad.`,
  });

  // Push all edges from start node to heap
  const startEdges = adjList.get(startNode) || [];
  for (const edge of startEdges) {
    minHeap.push({ target: edge.target, edgeId: edge.id, source: edge.source }, edge.weight);
  }

  while (!minHeap.isEmpty() && visited.size < nodes.length) {
    const minEdge = minHeap.pop();
    if (!minEdge) break;
    
    const { item: { target, edgeId, source }, priority: weight } = minEdge;

    events.push({
      eventId: uuidv4(),
      type: 'EVALUATING_EDGE',
      edgeId,
      sourceNodeId: source,
      targetNodeId: target,
      currentMstWeight,
      description: `Se extrajo la arista mínima ${source}-${target} (peso: ${weight}) de la cola de prioridad. Comprobando si ${target} ha sido visitado.`,
    });

    if (visited.has(target)) {
      events.push({
        eventId: uuidv4(),
        type: 'REJECT_EDGE_CYCLE',
        edgeId,
        sourceNodeId: source,
        targetNodeId: target,
        currentMstWeight,
        description: `El vértice destino ${target} ya ha sido visitado. La arista crea un ciclo. Descartando.`,
      });
      continue;
    }

    // Accept edge
    visited.add(target);
    currentMstWeight += weight;
    events.push({
      eventId: uuidv4(),
      type: 'ACCEPT_EDGE',
      edgeId,
      sourceNodeId: source,
      targetNodeId: target,
      currentMstWeight,
      description: `El vértice ${target} no ha sido visitado. Arista ${source}-${target} aceptada en el MST. Se sumó ${weight} al peso total.`,
    });

    events.push({
      eventId: uuidv4(),
      type: 'NODE_VISITED',
      sourceNodeId: target,
      currentMstWeight,
      description: `Visitando el vértice ${target}. Añadiendo sus aristas adyacentes no visitadas a la cola de prioridad.`,
    });

    // Add new edges from the newly visited node
    const nextEdges = adjList.get(target) || [];
    for (const nextEdge of nextEdges) {
      if (!visited.has(nextEdge.target)) {
        minHeap.push({ target: nextEdge.target, edgeId: nextEdge.id, source: nextEdge.source }, nextEdge.weight);
      }
    }
  }

  events.push({
    eventId: uuidv4(),
    type: 'NODE_VISITED',
    currentMstWeight,
    description: `Algoritmo de Prim completado. Árbol de Expansión Mínima formado con peso total: ${currentMstWeight}.`,
  });

  return events;
}
