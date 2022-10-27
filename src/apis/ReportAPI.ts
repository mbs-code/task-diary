import { Dayjs } from 'dayjs'
import { SelectQueryBuilder } from 'kysely'
import { From } from 'kysely/dist/cjs/parser/table-parser'
import { ProjectAPI } from '~~/src/apis/ProjectAPI'
import { StatusAPI } from '~~/src/apis/StatusAPI'
import { useDatabase } from '~~/src/composables/useDatabase'
import { useDayjs } from '~~/src/composables/useDayjs'
import { DBReport, formatReport, FormReport, parseReport, Report } from '~~/src/databases/models/Report'
import { Tables } from '~~/src/databases/Tables'

export type SearchReport = {
  text?: string
  onlyTask?: boolean // タスク要素
  onlyTodo?: boolean // TO-DO要素
  in?: number[] // id配列で取得
  page?: number
  limit?: number
  sorts?: [keyof DBReport, 'asc' | 'desc'][]
}

export class ReportAPI {
  protected static getSearchQuery (search?: SearchReport) {
    const { db } = useDatabase()

    const query: SelectQueryBuilder<From<Tables, 'reports'>, 'reports', {}> = db
      .selectFrom('reports')
      .if(Boolean(search?.text), qb => qb.where('text', 'like', `%${search.text}%`))
      .if(Boolean(search?.onlyTask), qb => qb.where('start_at', 'is not', null))
      .if(Boolean(search?.onlyTodo), qb => qb.where('start_at', 'is', null))
      .if(Boolean(search?.in), qb => qb.where('id', 'in', search.in))

    // NOTE: page limit sorts など、countに影響しないものは実装しない
    return { db, query }
  }

  public static async count (search?: SearchReport) {
    const { db, query } = this.getSearchQuery(search)
    const { count } = await query
      .select([db.fn.count('id').as('count')])
      .executeTakeFirst()

    return Number(count)
  }

  public static async getAll (search?: SearchReport): Promise<Report[]> {
    const { query } = this.getSearchQuery(search)

    // 取得
    const dbReports: DBReport[] = await query
      .selectAll()
      .if(Boolean(search?.page) && Boolean(search.limit), qb => qb.offset((search.page - 1) * search.limit))
      .if(Boolean(search?.limit), qb => qb.limit(search.limit))
      .if(Boolean(search?.sorts), qb => search.sorts.reduce(
        (qb2, sort) => qb2.orderBy(sort[0], sort[1]), qb),
      )
      .execute()

    const reports = dbReports.map(pj => formatReport(pj))

    // リレーション紐づけ
    const projectIds = reports
      .map(r => r.projectId)
      .filter((x, i, self) => x && self.indexOf(x) === i)
    const projects = await ProjectAPI.getAll({ in: projectIds })

    const statusIds = reports
      .map(r => r.statusId)
      .filter((x, i, self) => x && self.indexOf(x) === i)
    const statuses = await StatusAPI.getAll({ in: statusIds })

    return reports.map(report => ({
      ...report,
      project: report.projectId
        ? projects.find(p => p.id === report.projectId)
        : undefined,
      status: report.statusId
        ? statuses.find(p => p.id === report.statusId)
        : undefined,
    }))
  }

  /// ////////////////////////////////////////

  public static async get (reportId: number): Promise<Report> {
    const { db } = useDatabase()

    // 取得
    const dbReport = await db
      .selectFrom('reports')
      .selectAll()
      .where('id', '=', reportId)
      .executeTakeFirstOrThrow()

    const report = formatReport(dbReport)

    // リレーション紐づけ
    return {
      ...report,
      project: report.projectId
        ? await ProjectAPI.get(report.projectId)
        : undefined,
      status: report.statusId
        ? await StatusAPI.get(report.statusId)
        : undefined,
    }
  }

  public static async create (form: FormReport): Promise<Report> {
    const { db } = useDatabase()
    const dayjs = useDayjs()

    const now = dayjs()
    const parse = parseReport(form)

    // 作成
    const { insertId } = await db
      .insertInto('reports')
      .values({
        ...parse,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .executeTakeFirst()

    return await this.get(Number(insertId))
  }

  public static async update (reportId: number, form: FormReport): Promise<Report> {
    const { db } = useDatabase()
    const dayjs = useDayjs()

    const now = dayjs()
    const parse = parseReport(form)

    // 更新
    const { numUpdatedRows } = await db
      .updateTable('reports')
      .set({
        ...parse,
        updated_at: now.toISOString(),
      })
      .where('id', '=', reportId)
      .executeTakeFirst()

    if (Number(numUpdatedRows) === 0) {
      throw new Error('no result')
    }

    return await this.get(Number(reportId))
  }

  public static async remove (reportId: number): Promise<boolean> {
    const { db } = useDatabase()

    // 削除
    const { numDeletedRows } = await db
      .deleteFrom('reports')
      .where('id', '=', reportId)
      .executeTakeFirst()

    if (Number(numDeletedRows) === 0) {
      throw new Error('no result')
    }

    return true
  }
}
