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

        <Button
          class="p-button-plain p-button-text !w-8 !h-8"
          icon="pi pi-hourglass"
          @click="onSeed"
        />
      </template>

      <div class="flex">
        <ReportTimeline />
        <!-- <ReportList :day-reports="dayReports" />
        <ReportTodoList :reports="dayReports.at(0).reports" /> -->
      </div>

      <ReportEditDialog v-model:visible="showReportEditDialog" />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

/// ////////////////////////////////////////
// ダイアログ系

const showReportEditDialog = ref<boolean>(false)
const openReportEditDialog = () => {
  showReportEditDialog.value = !showReportEditDialog.value
}

/// ////////////////////////////////////////
// デバッグ用シード

const onSeed = async () => {
  console.log('seed')
  const database = useDatabase()
  await database.testSeed()
}
</script>
