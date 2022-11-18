import { InjectionKey, Ref } from 'nuxt/dist/app/compat/capi'
import { Report } from '~~/src/databases/models/Report'

export const useReportService = (
  mainRef: Ref,
  timelineRef: Ref,
  _todoRef: Ref,
) => {
  const timelineService = useTimelineService(timelineRef)
  const todoService = useTodoService()

  /** レポートをリストに追加・更新する */
  const updateList = (report: Report, base?: Partial<Report>) => {
    // 過去のレポートがあるなら一旦削除する
    if (base?.id) {
      if (base?.startAt) {
        timelineService.removeList(base)
      } else {
        todoService.removeList(base)
      }
    }

    // 新レポートを追加する
    if (report.startAt) {
      timelineService.replaceList(report)
    } else {
      todoService.replaceList(report)
    }

    // フォーカス
    nextTick(() => {
      const dom = timelineRef.value?.$el.querySelector(`[name=report-${report.id}]`)
      dom.scrollIntoView({ behavior: 'smooth' })
    })
  }

  /** レポートをリストから削除する */
  const removeList = (report: Report) => {
    // レポートを削除する
    if (report?.startAt) {
      timelineService.removeList(report)
    } else {
      todoService.removeList(report)
    }
  }

  return {
    timeline: timelineService,
    todo: todoService,

    updateList,
    removeList,
  }
}

export const ReportServiceKey:
  InjectionKey<ReturnType<typeof useReportService>> =
  Symbol('useReportService')
