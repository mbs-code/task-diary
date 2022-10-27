import { Dayjs } from 'dayjs'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

export type DayReport = { key: string, date: Dayjs, reports: Report[] }

export const useTimelineService = () => {
  const dayReports = ref<DayReport[]>([])
  const page = ref<number>(1)

  const fetchList = async () => {
    // TODO: 自動スクロール対応
    // 最新のデータを取得
    const chunkReports = await ReportAPI.getAll({
      onlyTask: true,
      limit: 5,
      page: page.value,
      sorts: [['start_at', 'desc']],
    })

    // dayReport に追加していく
    for (const report of chunkReports) {
      replaceList(report)
    }
  }

  const replaceList = (report: Report) => {
    // 日付で探索する
    const baseDate = report.startAt.clone().startOf('date')
    const targetDay = dayReports.value.find(dr => dr.date.isSame(baseDate, 'date'))

    if (targetDay) {
      // 日付が作成済みなら
      const ownIdIdx = targetDay.reports.findIndex(r => r.id === report.id)
      if (ownIdIdx >= 0) {
        // 自身のIDがある場合置き換え
        targetDay.reports.splice(ownIdIdx, 1, report)
      } else {
        // ない場合は追加してソートする
        targetDay.reports.push(report)
        targetDay.reports.sort((a, b) => a.startAt.isAfter(b.startAt) ? 1 : -1) // 日付順
      }
    } else {
      // 日付が無いならば、新規に作成してソート
      dayReports.value.push({ key: baseDate.toISOString(), date: baseDate, reports: [report] })
      dayReports.value.sort((a, b) => a.date.isAfter(b.date) ? 1 : -1)
    }
  }

  const removeList = (report: Report) => {
    // 日付で探索する
    const baseDate = report?.startAt.clone().startOf('date')
    const targetDayIndex = dayReports.value.findIndex(dr => dr.date.isSame(baseDate, 'date'))

    if (targetDayIndex >= 0) {
      const targetDay = dayReports.value.at(targetDayIndex)

      // 日付が作成済みなら
      const ownIdIdx = targetDay.reports.findIndex(r => r.id === report.id)
      if (ownIdIdx >= 0) {
        // 自身のIDがある場合削除
        targetDay.reports.splice(ownIdIdx, 1)

        // もし配列が空になれば削除
        if (targetDay.reports.length === 0) {
          dayReports.value.splice(targetDayIndex, 1)
        }
      }
    }
  }

  return {
    dayReports,
    page,

    fetchList,

    replaceList,
    removeList,
  }
}
