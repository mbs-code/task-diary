/* eslint-disable import/named */
import { Kysely, Migrator } from 'kysely'
import { BuildinMigrationProvider } from '~~/src/databases/libs/BuildinMigrationProvider'
import { TauriSqliteDialect } from '~~/src/databases/libs/TauriSqliteDialect'
import { migrations } from '~~/src/databases/Migrations'
import { Tables } from '~~/src/databases/Tables'

export default defineNuxtPlugin((nuxtApp) => {
  const path = 'sqlite:./test.db'

  const db = new Kysely<Tables>({
    dialect: new TauriSqliteDialect({
      path,
      debug: false,
    })
  })

  const migrator = new Migrator({
    db,
    provider: new BuildinMigrationProvider(migrations)
  })

  nuxtApp.provide('db', db)
  nuxtApp.provide('migrator', migrator)
})
