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
        <ReportCard
          v-for="(report, __) of dayReport.reports"
          :key="`${_}-${__}`"
          :report="report"
          accordion
          @open:menu="openCardMenu"
        />
        <!-- @saved="replaceReport" -->
      </div>
    </div>

    <ReportActionMenu ref="reportMenuRef" :report="selectedReport" />
  </div>
</template>

<script setup lang="ts">
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
// メニュー系

const reportMenuRef = ref()
const selectedReport = ref<Report>()
const openCardMenu = (event: MouseEvent, report: Report) => {
  selectedReport.value = report
  reportMenuRef.value?.toggle(event)
}
</script>
