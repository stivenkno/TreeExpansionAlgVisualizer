export type HeapNode<T> = {
  item: T;
  priority: number;
};

export class MinHeap<T> {
  private heap: HeapNode<T>[];

  constructor() {
    this.heap = [];
  }

  private parent(i: number): number {
    return Math.floor((i - 1) / 2);
  }
  private left(i: number): number {
    return 2 * i + 1;
  }
  private right(i: number): number {
    return 2 * i + 2;
  }

  private swap(i: number, j: number) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  push(item: T, priority: number) {
    this.heap.push({ item, priority });
    this.siftUp(this.heap.length - 1);
  }

  pop(): HeapNode<T> | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.siftDown(0);
    return root;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private siftUp(i: number) {
    while (i > 0 && this.heap[this.parent(i)].priority > this.heap[i].priority) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  private siftDown(i: number) {
    let minIndex = i;
    const l = this.left(i);
    if (l < this.heap.length && this.heap[l].priority < this.heap[minIndex].priority) {
      minIndex = l;
    }
    const r = this.right(i);
    if (r < this.heap.length && this.heap[r].priority < this.heap[minIndex].priority) {
      minIndex = r;
    }
    if (i !== minIndex) {
      this.swap(i, minIndex);
      this.siftDown(minIndex);
    }
  }
}
