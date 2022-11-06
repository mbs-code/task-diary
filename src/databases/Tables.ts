import { DBReport } from '~~/src/databases/models/Report'
import { DBProject } from '~~/src/databases/models/Project'
import { DBStatus } from '~~/src/databases/models/Status'

export type Tables = {
  projects: DBProject
  statuses: DBStatus
  reports: DBReport
}

export type MetaColumns = 'id' | 'created_at' | 'updated_at'
