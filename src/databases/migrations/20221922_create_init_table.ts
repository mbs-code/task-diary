import { Kysely } from 'kysely'

export async function up (db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('projects')
    .addColumn('id', 'integer', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .addColumn('color', 'text', col => col)
    .addColumn('icon', 'text', col => col)
    .addColumn('created_at', 'datetime', col => col.notNull())
    .addColumn('updated_at', 'datetime', col => col.notNull())
    .execute()

  await db.schema
    .createTable('statuses')
    .addColumn('id', 'integer', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .addColumn('color', 'text', col => col)
    .addColumn('created_at', 'datetime', col => col.notNull())
    .addColumn('updated_at', 'datetime', col => col.notNull())
    .execute()

  await db.schema
    .createTable('reports')
    .addColumn('id', 'integer', col => col.primaryKey())
    .addColumn('text', 'text', col => col.notNull())
    .addColumn('project_id', 'integer') // FK
    .addColumn('status_id', 'integer') // FK
    .addColumn('is_star', 'integer', col => col.notNull().defaultTo(0))
    .addColumn('start_at', 'datetime')
    .addColumn('end_at', 'datetime')
    .addColumn('created_at', 'datetime', col => col.notNull())
    .addColumn('updated_at', 'datetime', col => col.notNull())
    .execute()
}

export async function down (db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('reports').ifExists().execute()
  await db.schema.dropTable('statuses').ifExists().execute()
  await db.schema.dropTable('projects').ifExists().execute()
}
