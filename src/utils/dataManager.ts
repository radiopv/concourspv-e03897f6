
import { v4 as uuidv4 } from 'uuid';

/**
 * Utility class for managing local data persistence
 * This handles writing and reading from localStorage
 */
export class DataManager {
  /**
   * Loads data from localStorage by key
   */
  static loadData<T>(key: string, defaultData: T[]): T[] {
    if (typeof window === 'undefined') return defaultData;
    
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultData;
    } catch (error) {
      console.error(`Error loading data for key: ${key}`, error);
      return defaultData;
    }
  }

  /**
   * Saves data to localStorage by key
   */
  static saveData<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving data for key: ${key}`, error);
    }
  }

  /**
   * Creates a new item with unique ID
   */
  static createItem<T extends { id?: string }>(data: Omit<T, 'id'>, collection: T[]): T {
    const newItem = {
      ...data,
      id: uuidv4(),
      created_at: new Date().toISOString()
    } as T;
    
    return newItem;
  }

  /**
   * Updates an existing item in a collection
   */
  static updateItem<T extends { id: string }>(
    id: string, 
    updates: Partial<T>, 
    collection: T[]
  ): [T | null, T[]] {
    const index = collection.findIndex(item => item.id === id);
    if (index === -1) return [null, collection];
    
    const updatedItem = { 
      ...collection[index], 
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const updatedCollection = [
      ...collection.slice(0, index),
      updatedItem,
      ...collection.slice(index + 1)
    ];
    
    return [updatedItem, updatedCollection];
  }

  /**
   * Deletes an item from a collection
   */
  static deleteItem<T extends { id: string }>(
    id: string, 
    collection: T[]
  ): T[] {
    return collection.filter(item => item.id !== id);
  }
}
