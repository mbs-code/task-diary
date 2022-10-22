/* eslint-disable import/named */
import {
  Kysely,
  Migration,
  Migrator
} from 'kysely'
import { TauriSqliteDialect } from './libs/TauriSqliteDialect'
import { BuildinMigrationProvider } from './libs/BuildinMigrationProvider'

import * as CreateInitTable from './migrations/20221922_create_init_table'
import { DBReport } from '~~/src/databases/models/Report'
import { DBProject } from '~~/src/databases/models/Project'
import { DBStatus } from '~~/src/databases/models/Status'

// tables
export interface Tables {
  projects: DBProject
  statuses: DBStatus
  reports: DBReport
}

// migrations
export const migrations: Record<string, Migration> = {
  '20220826_create_init_table': CreateInitTable,
}

// singleton connection
export class Database {
  static path = 'sqlite:./test.db'
  static debug = false
  static trace = false

  static #instance: Kysely<Tables>
  static #migrator: Migrator

  static getInstance () {
    if (!this.#instance) {
      const db = new Kysely<Tables>({
        dialect: new TauriSqliteDialect({
          path: this.path,
          debug: this.debug,
          trace: this.trace,
        })
      })

      const migrator = new Migrator({
        db,
        provider: new BuildinMigrationProvider()
      })

      this.#instance = db
      this.#migrator = migrator
    }

    return {
      db: this.#instance,
      migrator: this.#migrator
    }
  }

  static getDB () {
    const { db } = this.getInstance()
    return db
  }

  static async destroy () {
    const db = this.#instance
    if (db) {
      await db.destroy()
      this.#instance = null
      this.#migrator = null
    }
  }

  static async dbWipe () {
    const db = this.#instance

    // 全テーブルの削除
    const tables = await db.introspection.getTables()
    for (const table of tables) {
      await db.schema.dropTable(table.name).ifExists().execute()
    }
    await db.schema.dropTable('kysely_migration').ifExists().execute()
    await db.schema.dropTable('kysely_migration_lock').ifExists().execute()
  }
}
