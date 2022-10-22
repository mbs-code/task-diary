<template>
  <div class="flex flex-col gap-8">
    <div
      v-for="(dayReport, _) of dayReports"
      :key="_"
      class="flex gap-2"
    >
      <div class="w-6rem">
        <ReportTimelineDate class="sticky top-0 py-2" :dayjs="dayReport.date" />
      </div>

      <div class="flex flex-col gap-4 py-2" style="width: 480px;">
        <div
          v-for="(report, __) of dayReport.reports"
          :key="`${_}-${__}`"
          class="flex gap-2"
        >
          <div class="w-4rem">
            <ReportTimelineTime class="sticky top-2" :dayjs="report.startAt" />
          </div>

          <ReportCard
            class="flex-grow"
            :report="report"
          />
          <!-- @open:menu="openCardMenu" -->
          <!-- @saved="replaceReport" -->
        </div>
      </div>
    </div>

    <!-- <Menu ref="cardMenuRef" :model="menuItems" :popup="true" /> -->
  </div>
</template>

<script setup lang="ts">
// import { MenuItem } from 'primevue/menuitem'
// import { DayReport, Report } from '~~/src/composables/types'

import { Dayjs } from 'dayjs'
import { ReportAPI, SearchReport } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

export type DayReport = { date: Dayjs, reports: Report[] }

// const props = defineProps<{
//   dayReports: DayReport,
// }>()

// // // eslint-disable-next-line func-call-spacing
// // const emit = defineEmits<{
// //   (e: 'open:menu', event: MouseEvent, report: Report),
// //   (e: 'saved', report: Report),
// // }>()

/// ////////////////////////////////////////
// データ

const dayjs = useDayjs()

// const reports = ref<Report[]>([])
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

  // 時系列でソートする
  const sortReports = chunkReports.reverse()

  // 代入していく
  for (const report of sortReports) {
    const date = report?.startAt.clone().startOf('date')
    const target = dayReports.value.find(dr => dr.date.isSame(date, 'date'))

    if (target) {
      // 存在する場合、追加してソートする
      target.reports.push(report)
      target.reports.sort((a, b) => a.startAt.isAfter(b.startAt) ? 1 : -1)
    } else {
      // しない場合は新規に作成、ソートする
      dayReports.value.push({ date, reports: [report] })
      dayReports.value.sort((a, b) => a.date.isAfter(b.date) ? 1 : -1)
    }
  }
}

onMounted(async () => await fetchReports())

// const dayjs = useDayjs()
// const formatReportAt = (report: Report) => {
//   return report.startAt
//     ? dayjs(report.startAt).format('HH:mm')
//     : undefined
// }

// /// ////////////////////////////////////////
// // メニュー系

// const cardMenuRef = ref()
// const selectedReport = ref<Report>()
// const openCardMenu = (event: MouseEvent, report: Report) => {
//   selectedReport.value = report
//   cardMenuRef.value?.toggle(event)
// }

// const menuItems = ref<MenuItem[]>([
//   {
//     label: '編集',
//     icon: 'pi pi-pencil',
//     command: () => {
//       window.alert('edit')
//     },
//   },
//   {
//     label: '星をつける',
//     icon: 'pi pi-star',
//     command: () => {
//       window.alert('star')
//     },
//   },
//   {
//     label: '削除',
//     icon: 'pi pi-trash',
//     command: () => {
//       window.alert('delet')
//     },
//   },
// ])
</script>
