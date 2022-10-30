import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

export const useReportAction = (service: ReturnType<typeof useReportService>) => {
  const confirm = useConfirm()
  const dayjs = useDayjs()

  /** テキストのみ更新する */
  const onUpdateText = async (text: string, report: Report, onDone?: () => void) => {
    const form = {
      ...report,
      text,
    }
    const updReport = await ReportAPI.update(report.id, form)
    service.updateList(updReport)

    onDone && onDone()
  }

  /** 星をトグルする */
  const onToggleStar = async (report: Report) => {
    const form = {
      ...report,
      isStar: !report.isStar,
    }
    const updReport = await ReportAPI.update(report.id, form)
    service.updateList(updReport)
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
          await ReportAPI.remove(report.id)
          service.updateList(report)

          resolve()
        },
        reject: () => resolve(),
        onHide: () => resolve(),
      })
    })
  }

  return {
    onUpdateText,
    onToggleStar,

    onDelete,
  }
}

export const ReportActionKey:
  InjectionKey<ReturnType<typeof useReportAction>> =
  Symbol('useReportAction')
