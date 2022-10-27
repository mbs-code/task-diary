import { useDatabase } from '~~/src/composables/useDatabase'
import { useDayjs } from '~~/src/composables/useDayjs'
import { DBStatus, formatStatus, FormStatus, parseStatus, Status } from '~~/src/databases/models/Status'

export type SearchStatus = {
  text?: string
  in?: number[] // id配列で取得
  page?: number
  limit?: number
  sorts?: [keyof DBStatus, 'asc' | 'desc'][]
}

export class StatusAPI {
  protected static getSearchQuery (search?: SearchStatus) {
    const { db } = useDatabase()

    const query = db
      .selectFrom('statuses')
      .if(Boolean(search?.text), qb => qb.where('name', 'like', `%${search.text}%`))
      .if(Boolean(search?.in), qb => qb.where('id', 'in', search.in))

    // NOTE: page limit sorts など、countに影響しないものは実装しない
    return { db, query }
  }

  public static async count (search?: SearchStatus) {
    const { db, query } = this.getSearchQuery(search)
    const { count } = await query
      .select([db.fn.count('id').as('count')])
      .executeTakeFirst()

    return Number(count)
  }

  public static async getAll (search?: SearchStatus): Promise<Status[]> {
    const { query } = this.getSearchQuery(search)

    // 取得
    const dbStatuses: DBStatus[] = await query
      .selectAll()
      .if(Boolean(search?.page) && Boolean(search.limit), qb => qb.offset((search.page - 1) * search.limit))
      .if(Boolean(search?.limit), qb => qb.limit(search.limit))
      .if(Boolean(search?.sorts), qb => search.sorts.reduce(
        (qb2, sort) => qb2.orderBy(sort[0], sort[1]), qb),
      )
      .execute()

    return dbStatuses.map(pj => formatStatus(pj))
  }

  /// ////////////////////////////////////////

  public static async get (statusId: number): Promise<Status> {
    const { db } = useDatabase()

    // 取得
    const dbTag = await db
      .selectFrom('statuses')
      .selectAll()
      .where('id', '=', statusId)
      .executeTakeFirstOrThrow()

    return formatStatus(dbTag)
  }

  public static async create (form: FormStatus): Promise<Status> {
    const { db } = useDatabase()
    const dayjs = useDayjs()

    const now = dayjs()
    const parse = parseStatus(form)

    // 名前重複確認
    const { count } = await db
      .selectFrom('statuses')
      .select([db.fn.count('id').as('count')])
      .where('name', '=', parse.name)
      .executeTakeFirst()
    if (count > 0) { throw new Error('duplicate name') }

    // 作成
    const { insertId } = await db
      .insertInto('statuses')
      .values({
        ...parse,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .executeTakeFirst()

    return await this.get(Number(insertId))
  }

  public static async update (statusId: number, form: FormStatus): Promise<Status> {
    const { db } = useDatabase()
    const dayjs = useDayjs()

    const now = dayjs()
    const parse = parseStatus(form)

    // 名前重複確認
    const { count } = await db
      .selectFrom('statuses')
      .select([db.fn.count('id').as('count')])
      .where('name', '=', parse.name)
      .where('id', '<>', statusId)
      .executeTakeFirst()
    if (count > 0) { throw new Error('duplicate name') }

    // 更新
    const { numUpdatedRows } = await db
      .updateTable('statuses')
      .set({
        ...parse,
        updated_at: now.toISOString(),
      })
      .where('id', '=', statusId)
      .executeTakeFirst()

    if (Number(numUpdatedRows) === 0) {
      throw new Error('no result')
    }

    return await this.get(Number(statusId))
  }

  public static async remove (statusId: number): Promise<boolean> {
    const { db } = useDatabase()

    // FKで使われているか確認する
    const status = await this.get(statusId)
    const { count } = await db
      .selectFrom('reports')
      .select([db.fn.count('id').as('count')])
      .where('status_id', '=', status.id)
      .executeTakeFirst()
    if (count > 0) { throw new Error('this has relation') }

    // 削除
    const { numDeletedRows } = await db
      .deleteFrom('reports')
      .where('id', '=', statusId)
      .executeTakeFirst()

    if (Number(numDeletedRows) === 0) {
      throw new Error('no result')
    }

    return true
  }
}
