import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

export const useTodoService = () => {
  const notify = useNotify()

  const reports = ref<Report[]>([])
  const page = ref<number>(1)

  const fetchList = async () => {
    try {
      // TODO: 後で調整
      reports.value = await ReportAPI.getAll({
        onlyTodo: true,
        // limit: 5,
        // page: page.value,
        sorts: [['updated_at', 'desc']],
      })
    } catch (err) {
      notify.thrown(err)
    }
  }

  const replaceList = (report: Report) => {
    const idx = reports.value.findIndex(r => r.id === report.id)
    if (idx >= 0) {
      // あったら置き換える
      reports.value.splice(idx, 1, report)
    } else {
      // 無ければ適当に追加してソート
      reports.value.push(report)
      reports.value.sort((a, b) => a.updatedAt.isAfter(b.updatedAt) ? -1 : 1)
    }
  }

  const removeList = (report: Partial<Report>) => {
    const idx = reports.value.findIndex(r => r.id === report.id)
    if (idx >= 0) {
      // あったら消す
      reports.value.splice(idx, 1)
    }
  }

  const clear = () => {
    reports.value = []
    page.value = 1
  }

  return {
    reports,
    page,

    fetchList,

    replaceList,
    removeList,

    clear,
  }
}
