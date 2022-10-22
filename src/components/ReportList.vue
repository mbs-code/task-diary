<template>
  <div class="flex flex-col gap-8">
    <div
      v-for="(dayReport, _) of dayReports"
      :key="_"
      class="flex gap-2"
    >
      <!-- 日付カラム -->
      <ReportListDate class="sticky top-0 h-full py-2" :date="dayReport.date" />

      <!-- レポートリスト -->
      <div class="flex flex-col gap-4 py-2" style="width: 480px;">
        <div
          v-for="(report, __) of dayReport.reports"
          :key="`${_}-${__}`"
          class="flex gap-2"
        >
          <div>
            <Chip class="sticky top-2 w-4rem h-2rem" :label="formatReportAt(report) " />
          </div>

          <ReportCard
            class="flex-grow"
            :report="report"
            @open:menu="openCardMenu"
          />
        <!-- @saved="replaceReport" -->
        </div>
      </div>
    </div>

    <Menu ref="cardMenuRef" :model="menuItems" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'
import { DayReport, Report } from '~~/src/composables/types'

const props = defineProps<{
  dayReports: DayReport,
}>()

// // eslint-disable-next-line func-call-spacing
// const emit = defineEmits<{
//   (e: 'open:menu', event: MouseEvent, report: Report),
//   (e: 'saved', report: Report),
// }>()

/// ////////////////////////////////////////

const dayjs = useDayjs()
const formatReportAt = (report: Report) => {
  return report.startAt
    ? dayjs(report.startAt).format('HH:mm')
    : undefined
}

/// ////////////////////////////////////////
// メニュー系

const cardMenuRef = ref()
const selectedReport = ref<Report>()
const openCardMenu = (event: MouseEvent, report: Report) => {
  selectedReport.value = report
  cardMenuRef.value?.toggle(event)
}

const menuItems = ref<MenuItem[]>([
  {
    label: '編集',
    icon: 'pi pi-pencil',
    command: () => {
      window.alert('edit')
    },
  },
  {
    label: '星をつける',
    icon: 'pi pi-star',
    command: () => {
      window.alert('star')
    },
  },
  {
    label: '削除',
    icon: 'pi pi-trash',
    command: () => {
      window.alert('delet')
    },
  },
])
</script>
