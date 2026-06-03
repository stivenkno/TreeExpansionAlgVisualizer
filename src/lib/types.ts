export type AlgorithmEvent = {
  eventId: string;
  type: 'EVALUATING_EDGE' | 'ACCEPT_EDGE' | 'REJECT_EDGE_CYCLE' | 'NODE_VISITED';
  edgeId?: string;
  sourceNodeId?: string;
  targetNodeId?: string;
  currentMstWeight: number;
  description: string;
};

export type AlgorithmType = 'KRUSKAL' | 'PRIM';

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  weight: number;
};
