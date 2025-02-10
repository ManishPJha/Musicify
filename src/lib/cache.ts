import { Song } from "./data";

// LRU Cache implementation for recently played songs
export class LRUCache {
  private capacity: number;
  private cache: Map<string, Song>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: string): Song | undefined {
    if (!this.cache.has(key)) return undefined;

    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: string, value: Song): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  getRecent(): Song[] {
    return Array.from(this.cache.values()).reverse();
  }
}
