<template>
  <div>
    <NuxtLayout>
      <template #header>
        <div>Task Diary</div>
        <div class="flex-grow" name="padding" />
        <Button
          class="p-button-plain p-button-text !w-8 !h-8"
          icon="pi pi-file-edit"
          @click="openReportEditDialog"
        />
      </template>

      <div class="flex">
        <ReportList :day-reports="dayReports" />
        <ReportTodoList :reports="dayReports.at(0).reports" />
      </div>

      <ReportEditDialog v-model:visible="showReportEditDialog" />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { DayReport } from '~~/src/composables/types'

/// ////////////////////////////////////////
// ダイアログ系

const showReportEditDialog = ref<boolean>(false)
const openReportEditDialog = () => {
  showReportEditDialog.value = !showReportEditDialog.value
}

/// ////////////////////////////////////////

const dayReports = ref<DayReport>([
  {
    date: new Date('2022-10-19 00:00:00'),
    reports: [
      {
        id: 1,
        text: 'サンプルテキストです\n・あいうえお\n・かきくけこ\n・さしすせそ',
        project: { id: 1, name: 'KK案件', label: 'K', color: 'green' },
        startAt: new Date('2022-10-19 10:12:33'),
        endAt: new Date('2022-10-19 12:01:00'),
        isStar: true,
      },
      {
        id: 2,
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt\n' +
        'quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!',
        project: { id: 2, name: '案件W', label: '😎' },
        startAt: new Date('2022-10-19 13:00:33'),
        endAt: null,
        isStar: false,
      },
    ],
  },
  {
    date: new Date('2022-10-20 00:00:00'),
    reports: [
      {
        id: 3,
        text: '',
        project: { id: 1, name: 'KK案件', label: 'K', color: 'green' },
        startAt: new Date('2022-10-20 10:12:33'),
        endAt: new Date('2022-10-20 11:01:00'),
        isStar: false,
      },
    ],
  },
  {
    date: undefined,
    reports: [
      {
        id: 4,
        text: 'aaaa\nbbbb\ncccc\ndddd\neeee\n',
        project: { id: 1, name: 'KK案件', label: 'K', color: 'green' },
        startAt: null,
        endAt: null,
        isStar: false,
      },
      {
        id: 5,
        text: 'aaaa\nbbbb\ncccc\ndddd\neeee\n',
        project: { id: 2, name: '案件W', label: '😎' },
        startAt: null,
        endAt: null,
        isStar: true,
      },
    ],
  },
])

// const replaceReport = (report: Report) => {
//   // MOCK: 値を置き換える
//   const index = reports.value.findIndex(r => r.id === report.id)
//   if (index >= 0) {
//     reports.value.splice(index, 1, report)
//   }
// }
</script>
