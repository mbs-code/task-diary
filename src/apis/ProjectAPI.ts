import { SelectQueryBuilder } from 'kysely'
import { From } from 'kysely/dist/cjs/parser/table-parser'
import { useDatabase } from '~~/src/composables/useDatabase'
import { useDayjs } from '~~/src/composables/useDayjs'
import { DBProject, formatProject, FormProject, parseProject, Project } from '~~/src/databases/models/Project'
import { Tables } from '~~/src/databases/Tables'

export type SearchProject = {
  text?: string
  in?: number[] // id配列で取得
  page?: number
  limit?: number
  sorts?: [keyof DBProject, 'asc' | 'desc'][]
}

export class ProjectAPI {
  protected static getSearchQuery (search?: SearchProject) {
    const { db } = useDatabase()

    const query: SelectQueryBuilder<From<Tables, 'projects'>, 'projects', {}> = db
      .selectFrom('projects')
      .if(Boolean(search?.text), qb => qb.where('name', 'like', `%${search.text}%`))
      .if(Boolean(search?.in), qb => qb.where('id', 'in', search.in))

    // NOTE: page limit sorts など、countに影響しないものは実装しない
    return { db, query }
  }

  public static async count (search?: SearchProject) {
    const { db, query } = this.getSearchQuery(search)
    const { count } = await query
      .select([db.fn.count('id').as('count')])
      .executeTakeFirst()

    return Number(count)
  }

  public static async getAll (search?: SearchProject): Promise<Project[]> {
    const { query } = this.getSearchQuery(search)

    // 取得
    const dbProjects: DBProject[] = await query
      .selectAll()
      .if(Boolean(search?.page) && Boolean(search.limit), qb => qb.offset((search.page - 1) * search.limit))
      .if(Boolean(search?.limit), qb => qb.limit(search.limit))
      .if(Boolean(search?.sorts), qb => search.sorts.reduce(
        (qb2, sort) => qb2.orderBy(sort[0], sort[1]), qb),
      )
      .execute()

    return dbProjects.map(pj => formatProject(pj))
  }

  /// ////////////////////////////////////////

  public static async get (projectId: number): Promise<Project> {
    const { db } = useDatabase()

    // 取得
    const dbProject = await db
      .selectFrom('projects')
      .selectAll()
      .where('id', '=', projectId)
      .executeTakeFirstOrThrow()

    return formatProject(dbProject)
  }

  public static async create (form: FormProject): Promise<Project> {
    const { db } = useDatabase()
    const dayjs = useDayjs()

    const now = dayjs()
    const parse = parseProject(form)

    // 名前重複確認
    const { count } = await db
      .selectFrom('projects')
      .select([db.fn.count('id').as('count')])
      .where('name', '=', parse.name)
      .executeTakeFirst()
    if (count > 0) { throw new Error('duplicate name') }

    // 作成
    const { insertId } = await db
      .insertInto('projects')
      .values({
        ...parse,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .executeTakeFirst()

    return await this.get(Number(insertId))
  }

  public static async update (projectId: number, form: FormProject): Promise<Project> {
    const { db } = useDatabase()
    const dayjs = useDayjs()

    const now = dayjs()
    const parse = parseProject(form)

    // 名前重複確認
    const { count } = await db
      .selectFrom('projects')
      .select([db.fn.count('id').as('count')])
      .where('name', '=', parse.name)
      .where('id', '<>', projectId)
      .executeTakeFirst()
    if (count > 0) { throw new Error('duplicate name') }

    // 更新
    const { numUpdatedRows } = await db
      .updateTable('projects')
      .set({
        ...parse,
        updated_at: now.toISOString(),
      })
      .where('id', '=', projectId)
      .executeTakeFirst()

    if (Number(numUpdatedRows) === 0) {
      throw new Error('no result')
    }

    return await this.get(Number(projectId))
  }

  public static async remove (projectId: number): Promise<boolean> {
    const { db } = useDatabase()

    // FKで使われているか確認する
    const project = await this.get(projectId)
    const { count } = await db
      .selectFrom('reports')
      .select([db.fn.count('id').as('count')])
      .where('project_id', '=', project.id)
      .executeTakeFirst()
    if (count > 0) { throw new Error('this has relation') }

    // 削除
    const { numDeletedRows } = await db
      .deleteFrom('reports')
      .where('id', '=', projectId)
      .executeTakeFirst()

    if (Number(numDeletedRows) === 0) {
      throw new Error('no result')
    }

    return true
  }
}
