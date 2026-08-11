/**
 * Editor Layer: Theme History State Manager
 * 
 * Manages undo/redo stacks for live theme customization in the BioLinks Editor.
 */

export class ThemeHistory {
  private undoStack: any[] = []
  private redoStack: any[] = []
  private maxDepth: number = 50

  public pushState(state: any): void {
    this.undoStack.push(structuredClone(state))
    if (this.undoStack.length > this.maxDepth) {
      this.undoStack.shift()
    }
    this.redoStack = []
  }

  public undo(currentState: any): any | null {
    if (this.undoStack.length === 0) return null
    this.redoStack.push(structuredClone(currentState))
    return this.undoStack.pop()
  }

  public redo(currentState: any): any | null {
    if (this.redoStack.length === 0) return null
    this.undoStack.push(structuredClone(currentState))
    return this.redoStack.pop()
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0
  }

  public clear(): void {
    this.undoStack = []
    this.redoStack = []
  }
}
