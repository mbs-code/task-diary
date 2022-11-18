import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report, toLog } from '~~/src/databases/models/Report'

export const useReportAction = (service: ReturnType<typeof useReportService>) => {
  const notify = useNotify()
  const confirm = useConfirm()
  const dayjs = useDayjs()

  /** TODO 要素にする */
  const onSwitchTodo = async (report: Report, copy = false) => {
    try {
      const form = {
        ...report,
        startAt: undefined,
      }

      // update 処理
      if (copy) {
        const crtReport = await ReportAPI.create(form)
        service.updateList(crtReport)
      } else {
        const updReport = await ReportAPI.update(report.id, form)
        service.updateList(updReport, report)
      }

      // 更新通知
      const method = copy ? '作成' : '更新'
      notify.success(`${toLog(report)}を${method}しました。`)
    } catch (err) {
      notify.thrown(err)
    }
  }

  /** タスク要素にする */
  const onSwitchTask = async (report: Report, copy = false) => {
    try {
      const form = {
        ...report,
        startAt: dayjs(),
      }

      // update 処理
      if (copy) {
        const crtReport = await ReportAPI.create(form)
        service.updateList(crtReport)
      } else {
        const updReport = await ReportAPI.update(report.id, form)
        service.updateList(updReport, report)
      }

      // 更新通知
      const method = copy ? '作成' : '更新'
      notify.success(`${toLog(report)}を${method}しました。`)
    } catch (err) {
      notify.thrown(err)
    }
  }

  /** 星をトグルする */
  const onToggleStar = async (report: Report) => {
    try {
      const form = {
        ...report,
        isStar: !report.isStar,
      }

      // update 処理
      const updReport = await ReportAPI.update(report.id, form)
      service.updateList(updReport, report)

      // 更新通知
      notify.success(`${toLog(report)}を更新しました。`)
    } catch (err) {
      notify.thrown(err)
    }
  }

  /** レポートの削除 */
  const onDelete = (report: Report): Promise<void> => {
    return new Promise((resolve) => {
      // 表示は20文字までとする
      const text = report.text.slice(0, 20).replace(/\r?\n/g, ' ')

      confirm.require({
        // eslint-disable-next-line no-irregular-whitespace
        message: `「${text}...」\n  のレポートを削除しますか？`,
        header: '削除の確認',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-danger',
        accept: async () => {
          try {
            // delete 処理
            await ReportAPI.remove(report.id)
            service.removeList(report)

            // 更新通知
            notify.success(`${toLog(report)}を削除しました。`)
            resolve()
          } catch (err) {
            notify.thrown(err)
          }
        },
        reject: () => resolve(),
        onHide: () => resolve(),
      })
    })
  }

  return {
    onSwitchTodo,
    onSwitchTask,
    onToggleStar,

    onDelete,
  }
}

export const ReportActionKey:
  InjectionKey<ReturnType<typeof useReportAction>> =
  Symbol('useReportAction')
