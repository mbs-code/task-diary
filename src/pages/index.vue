<template>
  <div>
    <Button @click="openReportEditDialog">
      asd
    </Button>

    <div class="flex flex-col gap-2" style="width: 400px">
      <ReportCard
        v-for="(report, _) of reports"
        :key="_"
        :report="report"
        @open:menu="openCardMenu"
        @saved="replaceReport"
      />

      <ReportActionMenu ref="reportMenuRef" :report="selectedReport" />
    </div>

    <ReportEditDialog v-model:visible="showReportEditDialog" />
  </div>
</template>

<script setup lang="ts">
import { Report } from '~~/src/composables/types'

/// ////////////////////////////////////////
// メニュー系

const reportMenuRef = ref()
const selectedReport = ref<Report>()
const openCardMenu = (event: MouseEvent, report: Report) => {
  selectedReport.value = report
  reportMenuRef.value?.toggle(event)
}

/// ////////////////////////////////////////
// ダイアログ系

const showReportEditDialog = ref<boolean>(true) // false)
const openReportEditDialog = () => {
  showReportEditDialog.value = !showReportEditDialog.value
}

/// ////////////////////////////////////////

const reports = ref<Report[]>([
  {
    id: 1,
    text: 'サンプルテキストです\n・あいうえお\n・かきくけこ\n・さしすせそ',
    project: { id: 1, name: 'KK案件', label: 'K', color: 'green' },
    startAt: new Date('2022-10-19 10:12:33'),
    endAt: new Date('2022-10-19 12:01:00'),
  },
  {
    id: 2,
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt\n' +
      'quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!',
    project: { id: 2, name: '案件W', label: '😎' },
    startAt: new Date('2022-10-19 13:00:33'),
    endAt: null,
  },
  {
    id: 3,
    text: '',
    project: { id: 1, name: 'KK案件', label: 'K', color: 'green' },
    startAt: new Date('2022-10-20 10:12:33'),
    endAt: new Date('2022-10-20 11:01:00'),
  },
  {
    id: 4,
    text: 'aaaa\nbbbb\ncccc\ndddd\neeee\n',
    project: { id: 1, name: 'KK案件', label: 'K', color: 'green' },
    startAt: null,
    endAt: null,
  },
  {
    id: 5,
    text: 'aaaa\nbbbb\ncccc\ndddd\neeee\n',
    project: { id: 2, name: '案件W', label: '😎' },
    startAt: null,
    endAt: null,
  },
])

const replaceReport = (report: Report) => {
  // MOCK: 値を置き換える
  const index = reports.value.findIndex(r => r.id === report.id)
  if (index >= 0) {
    reports.value.splice(index, 1, report)
  }
}
</script>
