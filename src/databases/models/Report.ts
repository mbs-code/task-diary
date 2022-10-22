import { Dayjs } from 'dayjs'
import { useDayjs } from "~~/src/composables/useDayjs"

export type DBReport = {
  id: number
  text: string
  project_id?: number // FK
  status_id?: number // FK
  is_favorite: number // 0, 1
  start_at?: string // iso8601 UTC
  end_at?: string // iso8601 UTC
  created_at: string // iso8601 UTC
  updated_at: string // iso8601 UTC
}

export type Report = {
  id: number
  text: string
  projectId?: number
  statusId?: number
  isFavorite: boolean
  startAt?: Dayjs
  endAt?: Dayjs
  createdAt: Dayjs
  updatedAt: Dayjs
}

export type FormReport = {
  text: string
  projectId?: number
  statusId?: number
  isFavotite: boolean
  startAt?: Dayjs
  endAt?: Dayjs
}

export const formatReport = (db: DBReport): Report => {
  const dayjs = useDayjs()

  return {
    id: db.id,
    text: db.text,
    projectId: db.project_id,
    statusId: db.status_id,
    isFavorite: Boolean(db.is_favorite),
    startAt: db.start_at ? dayjs(db.start_at) : undefined,
    endAt: db.end_at ? dayjs(db.end_at) : undefined,
    createdAt: dayjs(db.created_at),
    updatedAt: dayjs(db.updated_at),
  }
}

export const parseReport = (form: FormReport): Partial<DBReport> => {
  const dayjs = useDayjs()

  // 簡易バリデ
  const text = form.text?.trim()
  if (!text) { throw new Error('text is empty') }

  return {
    text: form.text,
    project_id: form.projectId,
    status_id: form.statusId,
    is_favorite: form.isFavotite ? 1 : 0,
    start_at: form.startAt
      ? dayjs(form.startAt).toISOString()
      : null,
    end_at: form.startAt
      ? dayjs(form.startAt).toISOString()
      : null,
  }
}
