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
            accordion
            tiny
            @open:menu="openCardMenu"
          />
        <!-- @saved="replaceReport" -->
        </div>
      </div>
    </div>

    <ReportActionMenu ref="reportMenuRef" :report="selectedReport" />
  </div>
</template>

<script setup lang="ts">
import { format as dateFormat } from 'date-fns'
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

const formatReportAt = (report: Report) => {
  return report.startAt
    ? dateFormat(report.startAt, 'HH:mm')
    : undefined
}

/// ////////////////////////////////////////
// メニュー系

const reportMenuRef = ref()
const selectedReport = ref<Report>()
const openCardMenu = (event: MouseEvent, report: Report) => {
  selectedReport.value = report
  reportMenuRef.value?.toggle(event)
}
</script>
