import { Dayjs } from 'dayjs'
import { useDayjs } from '~~/src/composables/useDayjs'
import { MetaColumns } from '~~/src/databases/Tables'

export type DBProject = {
  id?: number
  name: string // required
  color: string | null
  icon: string | null
  created_at: string // iso8601 UTC
  updated_at: string // iso8601 UTC
}

export type Project = {
  id: number
  name: string // required
  color?: string
  icon?: string
  createdAt: Dayjs
  updatedAt: Dayjs
}

export type FormProject = {
  name: string
  color?: string
  icon?: string
}

export const formatProject = (db: DBProject): Project => {
  const dayjs = useDayjs()

  return {
    id: db.id as number,
    name: db.name,
    color: db.color ?? undefined,
    icon: db.icon ?? undefined,
    createdAt: dayjs(db.created_at),
    updatedAt: dayjs(db.updated_at),
  }
}

export const parseProject = (form: FormProject): Omit<DBProject, MetaColumns> => {
  // 簡易バリデ
  const name = form.name?.trim()
  if (!name) { throw new Error('name is empty') }
  const icon = form.icon?.trim()
  if (icon && icon.length > 3) { throw new Error('length > 3 in icon') } // 二文字まで

  return {
    name: form.name,
    color: form.color ?? null,
    icon: form.icon ?? null,
  }
}

export const toLog = (project: Project) => {
  return `[${project.id}]「${project.name}」`
}
