<template>
  <div class="flex flex-col gap-8">
    <!-- レポートリスト -->
    <div class="flex flex-col" style="width: 480px;">
      <template
        v-for="(report, _) of reports"
        :key="_"
      >
        <ReportCard
          class="flex-grow"
          :report="report"
          accordion
          tiny
          @open:menu="openCardMenu"
        />
        <!-- @saved="replaceReport" -->
      </template>
    </div>

    <Menu ref="cardMenuRef" :model="menuItems" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'
import { DayReport, Report } from '~~/src/composables/types'

const props = defineProps<{
  reports: Report[],
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
