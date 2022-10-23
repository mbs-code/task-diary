<template>
  <div class="flex flex-col gap-8">
    <div
      v-for="dayReport of dayReports"
      :key="dayReport.key"
      class="flex gap-2"
    >
      <div class="min-w-4rem">
        <ReportTimelineDate class="sticky top-0 py-2" :dayjs="dayReport.date" />
      </div>

      <div class="flex-grow">
        <div class="flex flex-col gap-4 py-2">
          <div
            v-for="report of dayReport.reports"
            :key="report.id"
            class="flex gap-2"
          >
            <div class="min-w-4rem">
              <ReportTimelineTime class="sticky top-2" :dayjs="report.startAt" />
            </div>

            <ReportCard
              class="flex-grow"
              :report="report"
              @open:menu="openCardMenu"
              @update:text="onUpdateText"
            />
          </div>
        </div>
      </div>
    </div>

    <Menu ref="cardMenuRef" :model="menuItems" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { Dayjs } from 'dayjs'
import { MenuItem } from 'primevue/menuitem'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

export type DayReport = { key: string, date: Dayjs, reports: Report[] }

// const props = defineProps<{
//   dayReports: DayReport,
// }>()

// eslint-disable-next-line func-call-spacing
// const emit = defineEmits<{
//   (e: 'update:report', report: Report),
// }>()

/// ////////////////////////////////////////
// データ

const dayReports = ref<DayReport[]>([])
const page = ref<number>(1)

const fetchReports = async () => {
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
    appendDayReport(report)
  }
}

onMounted(async () => await fetchReports())

///

const appendDayReport = (report: Report) => {
  // 日付で探索する
  const baseDate = report?.startAt.clone().startOf('date')
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

const removeDayReport = (report: Report) => {
  // 日付で探索する
  const baseDate = report?.startAt.clone().startOf('date')
  const targetDay = dayReports.value.find(dr => dr.date.isSame(baseDate, 'date'))

  if (targetDay) {
    // 日付が作成済みなら
    const ownIdIdx = targetDay.reports.findIndex(r => r.id === report.id)
    if (ownIdIdx >= 0) {
      // 自身のIDがある場合削除
      targetDay.reports.splice(ownIdIdx, 1)
    }
  }
}

/// ////////////////////////////////////////
// メニュー系

const cardMenuRef = ref()
const selectedReport = ref<Report>()
const openCardMenu = (event: MouseEvent, report: Report) => {
  selectedReport.value = report
  cardMenuRef.value?.toggle(event)
}

const onUpdateText = async (text: string, report: Report, onDone: () => void) => {
  const form = {
    ...report,
    text,
  }
  const updReport = await ReportAPI.update(report.id, form)
  appendDayReport(updReport)

  onDone()
}

///

const onToggleStar = async () => {
  const form = {
    ...selectedReport.value,
    isStar: !selectedReport.value.isStar,
  }
  const updReport = await ReportAPI.update(selectedReport.value.id, form)
  appendDayReport(updReport)
}

const confirm = useConfirm()
const onDelete = () => {
  const text = selectedReport.value.text.slice(0, 20).replace(/\r?\n/g, ' ')
  confirm.require({
    // eslint-disable-next-line no-irregular-whitespace
    message: `「${text}...」\n　のレポートを削除しますか？`,
    header: '削除の確認',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await ReportAPI.remove(selectedReport.value.id)
      removeDayReport(selectedReport.value)
    },
  })
}

const menuItems = computed<MenuItem[]>(() => {
  if (selectedReport.value) {
    const isStar = selectedReport.value.isStar
    return [
      {
        label: '編集',
        icon: 'pi pi-pencil',
        command: () => {
          window.alert('edit')
        },
      },
      {
        label: isStar ? '星を外す' : '星をつける',
        icon: isStar ? 'pi pi-star' : 'pi pi-star-fill',
        command: onToggleStar,
      },
      {
        separator: true,
      },
      {
        label: '削除',
        icon: 'pi pi-trash',
        class: 'menu-delete',
        command: onDelete,
      },
    ]
  }

  return []
})
</script>

<style lang="scss">
.menu-delete {
  .p-menuitem-icon,
  .p-menuitem-text {
    color: var(--red-500) !important;
  }
}

.p-confirm-dialog {
  .p-confirm-dialog-message {
    white-space: pre;
    line-break: anywhere;
  }
}
</style>
