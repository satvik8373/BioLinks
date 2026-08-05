/**
 * Theme Importer Utility
 * 
 * Parses & validates custom imported JSON themes.
 */

import { ThemeValidator } from '../runtime/Validator'

export class ThemeImporter {
  public static parseAndValidate(jsonString: string): { success: boolean; config?: any; error?: string } {
    try {
      const parsed = JSON.parse(jsonString)
      const validation = ThemeValidator.validate(parsed)

      if (!validation.valid) {
        return { success: false, error: validation.errors.join(', ') }
      }

      return { success: true, config: parsed }
    } catch (e: any) {
      return { success: false, error: `Invalid JSON format: ${e?.message || 'unknown error'}` }
    }
  }
}
