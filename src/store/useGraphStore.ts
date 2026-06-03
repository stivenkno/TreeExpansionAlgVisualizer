import { create } from 'zustand';
import {
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type { AlgorithmEvent, AlgorithmType } from '../lib/types';

export type NodeData = {
  label: string;
};

export type EdgeData = {
  weight: number;
};

export type AppNode = Node<NodeData, 'vertex'>;
export type AppEdge = Edge<EdgeData, 'weighted'>;

export type PlaybackState = {
  events: AlgorithmEvent[];
  currentStepIndex: number;
  isPlaying: boolean;
  speedMs: number;
};

type GraphStoreState = {
  nodes: AppNode[];
  edges: AppEdge[];
  algorithm: AlgorithmType;
  playback: PlaybackState;
  
  // Actions
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange<AppEdge>;
  onConnect: OnConnect;
  addNode: (node: AppNode) => void;
  removeNode: (id: string) => void;
  updateNodeLabel: (id: string, label: string) => void;
  updateEdgeWeight: (id: string, weight: number) => void;
  setAlgorithm: (algo: AlgorithmType) => void;
  
  // Playback Actions
  setPlaybackEvents: (events: AlgorithmEvent[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetPlayback: () => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: number) => void;
};

export const useGraphStore = create<GraphStoreState>((set, get) => ({
  nodes: [],
  edges: [],
  algorithm: 'KRUSKAL',
  playback: {
    events: [],
    currentStepIndex: -1,
    isPlaying: false,
    speedMs: 1000,
  },

  onNodesChange: (changes: NodeChange<AppNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes: EdgeChange<AppEdge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    // Default weight is 1
    const newEdge = { ...connection, type: 'weighted', data: { weight: 1 } };
    set({
      edges: addEdge(newEdge, get().edges) as AppEdge[],
    });
  },

  addNode: (node: AppNode) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  removeNode: (id: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
    });
  },

  updateNodeLabel: (id: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, label } };
        }
        return node;
      }),
    });
  },

  updateEdgeWeight: (id: string, weight: number) => {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === id) {
          return { ...edge, data: { ...edge.data, weight } };
        }
        return edge;
      }),
    });
  },

  setAlgorithm: (algorithm: AlgorithmType) => {
    set({ algorithm });
    get().resetPlayback();
  },

  setPlaybackEvents: (events: AlgorithmEvent[]) => {
    set({
      playback: {
        ...get().playback,
        events,
        currentStepIndex: -1,
        isPlaying: true, // Auto-start
      },
    });
  },

  nextStep: () => {
    const { playback } = get();
    if (playback.currentStepIndex < playback.events.length - 1) {
      set({
        playback: {
          ...playback,
          currentStepIndex: playback.currentStepIndex + 1,
        },
      });
    } else {
      set({
        playback: {
          ...playback,
          isPlaying: false,
        },
      });
    }
  },

  prevStep: () => {
    const { playback } = get();
    if (playback.currentStepIndex > -1) {
      set({
        playback: {
          ...playback,
          currentStepIndex: playback.currentStepIndex - 1,
        },
      });
    }
  },

  resetPlayback: () => {
    set({
      playback: {
        ...get().playback,
        events: [],
        currentStepIndex: -1,
        isPlaying: false,
      },
    });
  },

  togglePlay: () => {
    const { playback } = get();
    // If finished, restart
    if (playback.currentStepIndex >= playback.events.length - 1 && !playback.isPlaying) {
      set({
        playback: {
          ...playback,
          currentStepIndex: -1,
          isPlaying: true,
        },
      });
    } else {
      set({
        playback: {
          ...playback,
          isPlaying: !playback.isPlaying,
        },
      });
    }
  },

  setPlaybackSpeed: (speedMs: number) => {
    set({
      playback: {
        ...get().playback,
        speedMs,
      },
    });
  },
}));
