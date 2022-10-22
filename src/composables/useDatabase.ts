/* eslint-disable import/named */
import { Kysely, Migrator } from 'kysely'
import { Tables } from '~~/src/databases/Tables'

export const useDatabase = () => {
  const nuxtApp = useNuxtApp()

  const db = nuxtApp.$db as Kysely<Tables>
  const migrator = nuxtApp.$migrator as Migrator

  const migrateToLatest = async () => {
    // マイグレーション
    await migrator.migrateToLatest()
  }

  const dbWipe = async () => {
    // 全テーブルの削除
    const tables = await db.introspection.getTables()
    for (const table of tables) {
      await db.schema.dropTable(table.name).ifExists().execute()
    }
    await db.schema.dropTable('kysely_migration').ifExists().execute()
    await db.schema.dropTable('kysely_migration_lock').ifExists().execute()

    // マイグレーション
    await migrator.migrateToLatest()
  }

  return {
    db,
    migrator,
    migrateToLatest,
    dbWipe,
  }
}
