import { InjectionKey, Ref } from 'nuxt/dist/app/compat/capi'
import { Report } from '~~/src/databases/models/Report'

export const useReportService = (
  timelineRef: Ref<HTMLDivElement>,
  todoRef: Ref<HTMLDivElement>,
) => {
  const timelineService = useTimelineService(timelineRef)
  const todoService = useTodoService(todoRef)

  /** レポートを表示・更新する */
  const updateList = (report: Report, oldReport?: Report) => {
    // 過去のレポートがあるなら一旦削除する
    if (oldReport) {
      if (oldReport?.startAt) {
        timelineService.removeList(oldReport)
      } else {
        todoService.removeList(oldReport)
      }
    }

    // 新レポートを追加する
    if (report.startAt) {
      timelineService.replaceList(report)
    } else {
      todoService.replaceList(report)
    }
  }

  return {
    timeline: timelineService,
    todo: todoService,

    updateList,
  }
}

export const ReportServiceKey:
  InjectionKey<ReturnType<typeof useReportService>> =
  Symbol('useReportService')
