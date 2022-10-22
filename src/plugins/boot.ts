import { Database } from '~~/src/databases/Database'

export default defineNuxtPlugin(async (_nuxtApp) => {
  // migrate db
  // const { migrator } = Database.getInstance()
  // await Database.dbWipe()
  // await migrator.migrateToLatest()
})
