/* eslint-disable import/named */
import { Migration } from 'kysely'
import * as CreateInitTable from './migrations/20221922_create_init_table'

export const migrations: Record<string, Migration> = {
  '20220826_create_init_table': CreateInitTable,
}
