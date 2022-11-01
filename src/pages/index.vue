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

        <div class="w-1" name="padding" />

        <Button
          v-if="!showTodoPanel"
          class="p-button-plain p-button-text !w-8 !h-8"
          icon="pi pi-caret-left"
          @click="showTodoPanel = true"
        />

        <Button
          v-if="showTodoPanel"
          class="p-button-plain p-button-text !w-8 !h-8"
          icon="pi pi-caret-right"
          @click="showTodoPanel = false"
        />
      </template>

      <Splitter
        ref="mainRef"
        :gutter-size="6"
        class="!bg-inherit !border-0 bg"
        style="height: calc(100vh - 40px)"
      >
        <SplitterPanel
          ref="timelineRef"
          class="min-w-200px overflow-y-scroll"
        >
          <ReportTimeline
            class="p-4"
            @edit:report="openReportEditDialog"
          />
        </SplitterPanel>

        <SplitterPanel
          v-if="showTodoPanel"
          ref="todoRef"
          class="overflow-y-scroll"
        >
          <ReportTodoTray
            class="p-4"
            @edit:report="openReportEditDialog"
          />
        </SplitterPanel>
      </Splitter>

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
import Splitter from 'primevue/splitter'
import { ProjectAPI } from '~~/src/apis/ProjectAPI'
import { Project } from '~~/src/databases/models/Project'
import { Report } from '~~/src/databases/models/Report'

definePageMeta({ layout: false })

const projects = ref<Project[]>([])
onMounted(async () => {
  projects.value = await ProjectAPI.getAll()
})

const showTodoPanel = ref<boolean>(true)

/// ////////////////////////////////////////
// サービス系

const mainRef = ref()
const timelineRef = ref()
const todoRef = ref()
const reportService = useReportService(mainRef, timelineRef, todoRef)
const reportAction = useReportAction(reportService)

provide(ReportServiceKey, reportService)
provide(ReportActionKey, reportAction)

onMounted(async () => {
  await reportService.timeline.fetchList()
  await reportService.todo.fetchList()

  const tl = timelineRef.value.$el
  tl?.scrollTo(0, tl.scrollHeight)
})

const projectService = useProjectService()
provide(ProjectServiceKey, projectService)

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
