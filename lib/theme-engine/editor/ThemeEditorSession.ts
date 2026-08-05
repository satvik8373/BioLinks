/**
 * Editor Layer: Theme Editor Session State Manager
 * 
 * Creates an isolated editor clone for live preview without mutating active runtime state.
 * Promotes editor changes to runtime state only on explicit save.
 */

import { ThemeHistory } from './ThemeHistory'

export class ThemeEditorSession {
  private baseTheme: any
  private activeEditorTheme: any
  private history: ThemeHistory

  constructor(initialTheme: any) {
    this.baseTheme = JSON.parse(JSON.stringify(initialTheme))
    this.activeEditorTheme = JSON.parse(JSON.stringify(initialTheme))
    this.history = new ThemeHistory()
    this.history.pushState(this.activeEditorTheme)
  }

  public updateOverride(pathKey: string, value: any): any {
    const keys = pathKey.split('.')
    let current = this.activeEditorTheme

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    this.history.pushState(this.activeEditorTheme)
    return this.getEditorTheme()
  }

  public getEditorTheme(): any {
    return JSON.parse(JSON.stringify(this.activeEditorTheme))
  }

  public undo(): any | null {
    const prev = this.history.undo(this.activeEditorTheme)
    if (prev) {
      this.activeEditorTheme = JSON.parse(JSON.stringify(prev))
    }
    return this.getEditorTheme()
  }

  public redo(): any | null {
    const next = this.history.redo(this.activeEditorTheme)
    if (next) {
      this.activeEditorTheme = JSON.parse(JSON.stringify(next))
    }
    return this.getEditorTheme()
  }

  public save(): any {
    this.baseTheme = JSON.parse(JSON.stringify(this.activeEditorTheme))
    return this.getEditorTheme()
  }
}
