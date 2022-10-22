export type Project = {
  id: number
  name: string
  label?: string
  color?: string
}

export type Report = {
  id: number
  text: string
  project: Project
  startAt?: Date
  endAt?: Date
  isStar: boolean
}

export type DayReport = { date?: Date, reports: Report[] }[]
