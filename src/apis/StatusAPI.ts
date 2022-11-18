import { SelectQueryBuilder } from 'kysely'
import { From } from 'kysely/dist/cjs/parser/table-parser'
import { useDatabase } from '~~/src/composables/useDatabase'
import { useDayjs } from '~~/src/composables/useDayjs'
import { DBStatus, formatStatus, FormStatus, parseStatus, Status } from '~~/src/databases/models/Status'
import { Tables } from '~~/src/databases/Tables'

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

    const query: SelectQueryBuilder<From<Tables, 'statuses'>, 'statuses', {}> = db
      .selectFrom('statuses')
      .if(Boolean(search?.text), qb => qb.where('name', 'like', `%${search?.text ?? ''}%`))
      .if(Boolean(search?.in), qb => qb.where('id', 'in', search?.in ?? []))

    // NOTE: page limit sorts など、countに影響しないものは実装しない
    return { db, query }
  }

  public static async count (search?: SearchStatus) {
    const { db, query } = this.getSearchQuery(search)
    const { count } = await query
      .select([db.fn.count('id').as('count')])
      .executeTakeFirst() as { count: bigint }

    return Number(count)
  }

  public static async getAll (search?: SearchStatus): Promise<Status[]> {
    const { query } = this.getSearchQuery(search)

    // 取得
    const dbStatuses: DBStatus[] = await query
      .selectAll()
      .if(Boolean(search?.page) && Boolean(search?.limit), qb =>
        qb.offset(((search?.page ?? 0) - 1) * (search?.limit ?? 0)),
      )
      .if(Boolean(search?.limit), qb => qb.limit(search?.limit ?? 0))
      .if(Boolean(search?.sorts), qb => (search?.sorts ?? []).reduce(
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
      .executeTakeFirst()
    if (!dbTag) { throw new Error(`取得に失敗しました。(s${statusId})`) }

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
      .executeTakeFirst() as { count: bigint }
    if (count > 0) { throw new Error('この名称は既に使われています。') }

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
      .executeTakeFirst() as { count: bigint }
    if (count > 0) { throw new Error('この名称は既に使われています。') }

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
      throw new Error(`更新に失敗しました。(s${statusId})`)
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
      .executeTakeFirst() as { count: bigint }
    if (count > 0) { throw new Error('使用されているため、削除できません。') }

    // 削除
    const { numDeletedRows } = await db
      .deleteFrom('reports')
      .where('id', '=', statusId)
      .executeTakeFirst()

    if (Number(numDeletedRows) === 0) {
      throw new Error(`削除に失敗しました。(s${statusId})`)
    }

    return true
  }
}
