import { Dayjs } from 'dayjs'
import { useDayjs } from '~~/src/composables/useDayjs'
import { Project } from '~~/src/databases/models/Project'
import { Status } from '~~/src/databases/models/Status'
import { MetaColumns } from '~~/src/databases/Tables'

export type DBReport = {
  id?: number
  text: string // required
  project_id: number | null // FK
  status_id: number | null // FK
  is_star: number // 0, 1
  start_at: string | null // iso8601 UTC
  end_at: string | null // iso8601 UTC
  created_at: string // iso8601 UTC
  updated_at: string // iso8601 UTC
}

export type Report = {
  id: number
  text: string // required
  projectId?: number
  statusId?: number
  isStar: boolean
  startAt?: Dayjs
  endAt?: Dayjs
  createdAt: Dayjs
  updatedAt: Dayjs

  project?: Project // relation
  status?: Status // relation
}

export type FormReport = {
  text: string
  projectId?: number
  statusId?: number
  isStar: boolean
  startAt?: Dayjs
  endAt?: Dayjs
}

export const formatReport = (db: DBReport): Report => {
  const dayjs = useDayjs()

  return {
    id: db.id as number,
    text: db.text,
    projectId: db.project_id ?? undefined,
    statusId: db.status_id ?? undefined,
    isStar: Boolean(db.is_star),
    startAt: db.start_at
      ? dayjs(db.start_at)
      : undefined,
    endAt: db.end_at
      ? dayjs(db.end_at)
      : undefined,
    createdAt: dayjs(db.created_at),
    updatedAt: dayjs(db.updated_at),
  }
}

export const parseReport = (form: FormReport): Omit<DBReport, MetaColumns> => {
  const dayjs = useDayjs()

  // 簡易バリデ
  const text = form.text?.trim()
  if (!text) { throw new Error('text is empty') }

  return {
    text: form.text,
    project_id: form.projectId ?? null,
    status_id: form.statusId ?? null,
    is_star: form.isStar ? 1 : 0,
    start_at: form.startAt
      ? dayjs(form.startAt).toISOString()
      : null,
    end_at: form.endAt
      ? dayjs(form.endAt).toISOString()
      : null,
  }
}

export const toLog = (report: Report) => {
  const text = report.text.slice(0, 10).replace(/\r?\n/g, ' ')
  return `[${report.id}]「${text}...」`
}
