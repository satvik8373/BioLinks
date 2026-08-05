/**
 * Runtime: Theme Migration Engine
 * 
 * Migrates older theme schema versions to the latest schema version.
 */

export class ThemeMigration {
  public static CURRENT_VERSION = '1.0.0'

  public static migrate(rawConfig: any): any {
    if (!rawConfig) return rawConfig
    const migrated = { ...rawConfig }

    // Version check & future migration steps
    if (!migrated.version) {
      migrated.version = '1.0.0'
    }

    // Migration rule: ensure palette object/string is normalized
    if (migrated.colors && !migrated.palette) {
      migrated.palette = migrated.colors
    }

    return migrated
  }
}
