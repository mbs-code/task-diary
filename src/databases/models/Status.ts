import { Dayjs } from 'dayjs'
import { useDayjs } from '~~/src/composables/useDayjs'
import { MetaColumns } from '~~/src/databases/Tables'

export type DBStatus = {
  id?: number
  name: string
  color: string | null
  created_at: string // iso8601 UTC
  updated_at: string // iso8601 UTC
}

export type Status = {
  id: number
  name: string
  color: string | null
  createdAt: Dayjs
  updatedAt: Dayjs
}

export type FormStatus = {
  name: string
  color?: string | null
}

export const formatStatus = (db: DBStatus): Status => {
  const dayjs = useDayjs()

  return {
    id: db.id as number,
    name: db.name,
    color: db.color,
    createdAt: dayjs(db.created_at),
    updatedAt: dayjs(db.updated_at),
  }
}

export const parseStatus = (form: FormStatus): Omit<DBStatus, MetaColumns> => {
  // 簡易バリデ
  const name = form.name?.trim()
  if (!name) { throw new Error('name is empty') }

  return {
    name: form.name,
    color: form.color ?? null,
  }
}
