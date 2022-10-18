<template>
  <div>
    <Button @click="openReportEditDialog">
      asd
    </Button>

    <ReportCard :report="report" style="margin: 40px; width: 400px" />

    <ReportEditDialog v-model:visible="showReportEditDialog" />
  </div>
</template>

<script setup lang="ts">
import { Report } from '~~/src/composables/types'

const showReportEditDialog = ref<boolean>(true) // false)
const openReportEditDialog = () => {
  showReportEditDialog.value = !showReportEditDialog.value
}

const report = ref<Report>({
  id: 1,
  text: 'サンプルテキストです\n・あいうえお\n・かきくけこ\n・さしすせそ',
  project: { id: 1, name: 'KK案件', label: 'K', color: 'green' },
  startAt: new Date('2022-10-19 10:12:33'),
  endAt: new Date('2022-10-19 12:01:00'),
})
</script>
