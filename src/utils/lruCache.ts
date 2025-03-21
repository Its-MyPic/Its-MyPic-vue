/**
 * LRU (Least Recently Used) 快取實現
 */
export class LRUCache<K extends string | number, V> {
  private cache: Map<K, V>;
  private readonly capacity: number;

  /**
   * 建立一個新的 LRU 快取實例
   * @param capacity 快取容量，必須為正整數
   */
  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error('Cache capacity must be greater than 0');
    }
    this.cache = new Map();
    this.capacity = capacity;
  }

  /**
   * 檢查鍵是否存在於快取中
   * @param key 要檢查的鍵
   * @returns 是否存在
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * 從快取中獲取值
   * @param key 要獲取的鍵
   * @returns 對應的值，如果不存在則返回 undefined
   */
  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (item) {
      // 移動到最後以標記為最近使用
      this.cache.delete(key);
      this.cache.set(key, item);
      return item;
    }
    return undefined;
  }

  /**
   * 在快取中設置鍵值對
   * @param key 要設置的鍵
   * @param value 要設置的值
   */
  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      // 如果已存在，先刪除以更新訪問順序
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 移除最舊的項目
      const firstKey = this.cache.keys().next();
      if (!firstKey.done) {
        this.cache.delete(firstKey.value);
      }
    }
    this.cache.set(key, value);
  }

  /**
   * 清空快取
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 獲取當前快取大小
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * 獲取快取容量
   */
  get maxSize(): number {
    return this.capacity;
  }

  /**
   * 獲取所有鍵的迭代器
   */
  keys(): IterableIterator<K> {
    return this.cache.keys();
  }

  /**
   * 獲取所有值的迭代器
   */
  values(): IterableIterator<V> {
    return this.cache.values();
  }

  /**
   * 獲取所有項目的迭代器
   */
  entries(): IterableIterator<[K, V]> {
    return this.cache.entries();
  }
}
