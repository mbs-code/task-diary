import { Dayjs } from 'dayjs'
import { Ref } from 'nuxt/dist/app/compat/capi'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

export type DayReport = { key: string, date: Dayjs, reports: Report[] }

type InfiniteState = {
  loaded: () => void
  complete: () => void
  error: () => void
}

export const useTimelineService = (timelineRef: Ref<HTMLDivElement>) => {
  const dayReports = ref<DayReport[]>([])
  const oldestStartAt = ref<Dayjs>() // 取得した範囲で一番古い情報
  const oldestIds = ref<number[]>([]) // 上の該当ID

  const onLoadPrev = async ($state: InfiniteState) => {
    // 前の要素を取ってくる
    console.log('prev')
    const cnt = await fetchList()
    if (cnt > 0) {
      $state.loaded()
    } else {
      $state.complete()
    }
  }

  const onLoadNext = () => {
    // 次の要素を取ってくる
    console.log('next')
  }

  const fetchList = async () => {
    // TODO: 自動スクロール対応
    // 最新のデータを取得
    const chunkReports = await ReportAPI.getAll({
      onlyTask: true,
      limit: 5,
      until: oldestStartAt.value,
      notin: oldestIds.value.length ? oldestIds.value : undefined,
      sorts: [['start_at', 'desc']],
    })

    // 差分取得用コード
    for (const report of chunkReports) {
      // 保持情報より古いなら追加
      if (!oldestStartAt.value) {
        // 保持日時が無ければ追加
        oldestStartAt.value = report.startAt
        oldestIds.value = [report.id]
      } else if (report.startAt && oldestStartAt.value.isAfter(report.startAt)) {
        // レポートの日時が古ければ更新
        oldestStartAt.value = report.startAt
        oldestIds.value = [report.id]
      } else if (report.startAt && oldestStartAt.value.isSame(report.startAt)) {
        // レポートの日時が同じならば追記
        oldestIds.value.push(report.id)
      }

      // dayReport に追加していく
      replaceList(report)
    }

    return chunkReports.length
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
    timelineRef,

    dayReports,

    onLoadPrev,
    onLoadNext,
    fetchList,

    replaceList,
    removeList,
  }
}
