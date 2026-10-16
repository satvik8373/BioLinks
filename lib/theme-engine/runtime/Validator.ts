/**
 * Runtime: Theme Validator Stage
 * 
 * Validates theme configurations against schema rules.
 */

import Ajv from 'ajv'
import schema from '../schemas/theme.schema.json'
import { BASE_THEMES } from '@/lib/baseThemes'

const validateSchema = new Ajv({ allErrors: true, strict: false }).compile(schema)

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export class ThemeValidator {
  public static validate(config: unknown): ValidationResult {
    const errors: string[] = []

    if (!validateSchema(config)) {
      errors.push(...(validateSchema.errors || []).map(error => `${error.instancePath || '/'} ${error.message}`))
    }
    if (config && typeof config === 'object' && 'extends' in config) {
      const baseId = (config as { extends: unknown }).extends
      if (typeof baseId === 'string' && !Object.prototype.hasOwnProperty.call(BASE_THEMES, baseId)) {
        errors.push(`Unknown base theme: ${baseId}`)
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}
