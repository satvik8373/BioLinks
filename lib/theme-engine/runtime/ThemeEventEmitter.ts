/**
 * Runtime: Theme Event Emitter Subsystem
 * 
 * Provides typed event subscription for plugins and system listeners:
 * - 'loaded'
 * - 'changed'
 * - 'preview'
 * - 'export'
 */

export type ThemeEventType = 'loaded' | 'changed' | 'preview' | 'export'
export type ThemeEventListener = (payload: any) => void

export class ThemeEventEmitter {
  private static instance: ThemeEventEmitter
  private listeners: Map<ThemeEventType, Set<ThemeEventListener>> = new Map()

  private constructor() {}

  public static getInstance(): ThemeEventEmitter {
    if (!ThemeEventEmitter.instance) {
      ThemeEventEmitter.instance = new ThemeEventEmitter()
    }
    return ThemeEventEmitter.instance
  }

  public on(event: ThemeEventType, listener: ThemeEventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
  }

  public off(event: ThemeEventType, listener: ThemeEventListener): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(listener)
    }
  }

  public emit(event: ThemeEventType, payload: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(listener => {
        try {
          listener(payload)
        } catch (e) {
          console.error(`Error in theme event listener for ${event}:`, e)
        }
      })
    }
  }
}
