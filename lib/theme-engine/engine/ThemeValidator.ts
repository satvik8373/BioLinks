/**
 * Single Responsibility: Theme Validator
 * 
 * Validates theme configurations against theme specifications.
 */

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export class ThemeValidator {
  public static validate(config: any): ValidationResult {
    const errors: string[] = []

    if (!config) {
      return { valid: false, errors: ['Theme config is null or undefined'] }
    }

    if (!config.id || typeof config.id !== 'string') {
      errors.push('Theme config must specify a valid string id')
    }

    if (!config.name || typeof config.name !== 'string') {
      errors.push('Theme config must specify a valid string name')
    }

    if (!config.extends || typeof config.extends !== 'string') {
      errors.push('Theme config must specify an extends base theme id')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}
