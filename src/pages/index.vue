<template>
  <div>
    <NuxtLayout name="default">
      <template #header>
        <div>Task Diary</div>
        <div class="flex-grow" name="padding" />

        <Button
          class="p-button-plain p-button-text !w-8 !h-8"
          icon="pi pi-file-edit"
          @click="openReportEditDialog()"
        />

        <Button
          class="p-button-plain p-button-text !w-8 !h-8"
          icon="pi pi-hourglass"
          @click="onSeed"
        />
      </template>

      <div class="flex">
        <div class="basis-1/2 overflow-y-scroll" style="height: calc(100vh - 40px)">
          <ReportTimeline
            :timeline-service="timelineService"
            class="p-4"
            @edit:report="openReportEditDialog"
          />
        </div>

        <div class="basis-1/2 overflow-y-scroll" style="height: calc(100vh - 40px)">
          <ReportTodoList
            :todo-service="todoService"
            class="p-4"
            @edit:report="openReportEditDialog"
          />
        </div>
      </div>

      <ReportEditDialog
        v-model:visible="showReportEditDialog"
        :report="selectedReport"
        :projects="projects"
        @update:report="onUpsertReport"
      />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ProjectAPI } from '~~/src/apis/ProjectAPI'
import { Project } from '~~/src/databases/models/Project'
import { Report } from '~~/src/databases/models/Report'

definePageMeta({ layout: false })

const projects = ref<Project[]>([])
onMounted(async () => {
  projects.value = await ProjectAPI.getAll()
})

/// ////////////////////////////////////////
// サービス系

const timelineService = useTimelineService()
const todoService = useTodoService()

const onUpsertReport = (report: Report, oldReport?: Report) => {
  // 過去のレポートがあるなら一旦削除する
  if (oldReport) {
    if (oldReport?.startAt) {
      timelineService.removeList(oldReport)
    } else {
      todoService.removeList(oldReport)
    }
  }

  // 新レポートを追加する
  if (report.startAt) {
    timelineService.replaceList(report)
  } else {
    todoService.replaceList(report)
  }
}

/// ////////////////////////////////////////
// ダイアログ系

const selectedReport = ref<Report>()
const showReportEditDialog = ref<boolean>(false)
const openReportEditDialog = (report?: Report) => {
  selectedReport.value = report
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
