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
        <div ref="timelineRef" class="basis-1/2 overflow-y-scroll" style="height: calc(100vh - 40px)">
          <ReportTimeline
            class="p-4"
            @edit:report="openReportEditDialog"
          />
        </div>

        <div ref="todoRef" class="basis-1/2 overflow-y-scroll" style="height: calc(100vh - 40px)">
          <ReportTodoList
            class="p-4"
            @edit:report="openReportEditDialog"
          />
        </div>
      </div>

      <ReportEditDialog
        v-model:visible="showReportEditDialog"
        :report="selectedReport"
        :projects="projects"
        @update:report="reportService.updateList"
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

const timelineRef = ref<HTMLDivElement>()
const todoRef = ref<HTMLDivElement>()
const reportService = useReportService(timelineRef, todoRef)
const reportAction = useReportAction(reportService)

provide(ReportServiceKey, reportService)
provide(ReportActionKey, reportAction)

onMounted(async () => {
  await reportService.timeline.fetchList()
  await reportService.todo.fetchList()

  const tl = reportService.timeline.timelineRef.value
  tl?.scrollTo(0, tl.scrollHeight)
})

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
