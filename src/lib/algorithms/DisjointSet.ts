export class DisjointSet {
  private parent: Map<string, string>;
  private rank: Map<string, number>;

  constructor(nodes: string[]) {
    this.parent = new Map();
    this.rank = new Map();
    for (const node of nodes) {
      this.parent.set(node, node);
      this.rank.set(node, 0);
    }
  }

  find(x: string): string {
    if (this.parent.get(x) !== x) {
      // Path compression
      this.parent.set(x, this.find(this.parent.get(x)!));
    }
    return this.parent.get(x)!;
  }

  union(x: string, y: string): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return true; // Cycle detected
    }

    const rankX = this.rank.get(rootX)!;
    const rankY = this.rank.get(rootY)!;

    // Union by rank
    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }

    return false; // No cycle, successfully merged
  }
}
