<template>
  <div>
    <NuxtLayout name="default">
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
        <div class="basis-1/2 overflow-y-scroll" style="height: calc(100vh - 40px)">
          <ReportTimeline class="p-4" />
        </div>

        <div class="basis-1/2 overflow-y-scroll" style="height: calc(100vh - 40px)">
          <ReportTodoList class="p-4" />
        </div>
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
