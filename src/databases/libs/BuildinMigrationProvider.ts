import {
  Migration,
  MigrationProvider,
} from 'kysely'

export class BuildinMigrationProvider implements MigrationProvider {
  private migrations: Record<string, Migration>

  constructor (migrations: Record<string, Migration>) {
    this.migrations = migrations
  }

  // eslint-disable-next-line require-await
  async getMigrations (): Promise<Record<string, Migration>> {
    return this.migrations
  }
}
