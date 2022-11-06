<template>
  <div>
    <NuxtLayout name="default">
      <template #header>
        <div>Task Diary</div>

        <Button
          class="p-button-plain p-button-text !w-8 !h-8"
          icon="pi pi-hourglass"
          @click="onSeed"
        />

        <Button
          class="p-button-plain p-button-text !w-8 !h-8"
          icon="pi pi-circle"
          @click="onFresh"
        />

        <div class="flex-grow" name="padding" />

        <Button
          class="p-button-plain p-button-text !w-8 !h-8"
          icon="pi pi-file-edit"
          @click="openReportEditDialog(undefined)"
        />

        <Button
          class="p-button-plain p-button-text !w-8 !h-8"
          icon="pi pi-box"
          @click="openProjectEditDialog"
        />

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
        ref="splitterRef"
        :gutter-size="8"
        class="!bg-inherit !border-0"
        style="height: calc(100vh - 40px)"
        @resizeend="splitterHelper.resizeend"
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

      <ProjectEditDialog
        v-model:visible="showProjectEditDialog"
        @update:project="onInit"
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

const showTodoPanel = ref<boolean>(true)

const splitterRef = ref()
const timelineRef = ref()
const todoRef = ref()

const splitterHelper = useSplitterHandler(splitterRef)

/// ////////////////////////////////////////
// サービス系

const reportService = useReportService(splitterRef, timelineRef, todoRef)
const reportAction = useReportAction(reportService)

provide(ReportServiceKey, reportService)
provide(ReportActionKey, reportAction)

const projectService = useProjectService()
provide(ProjectServiceKey, projectService)

const onInit = async () => {
  reportService.timeline.clear()
  reportService.todo.clear()

  await reportService.timeline.fetchList()
  await reportService.todo.fetchList()

  const tl = timelineRef.value.$el
  tl?.scrollTo(0, tl.scrollHeight)
}

onMounted(() => {
  // 初回ロード
  onInit()

  // TL自動更新用
  useInfiniteScroll(
    () => timelineRef.value.$el,
    () => reportService.timeline.onLoadPrev(),
    { distance: 10, direction: 'top' },
  )
})

/// ////////////////////////////////////////
// ダイアログ系

const selectedReport = ref<Report>()
const showReportEditDialog = ref<boolean>(false)
const openReportEditDialog = (report?: Report) => {
  selectedReport.value = report
  showReportEditDialog.value = true
}

const showProjectEditDialog = ref<boolean>(false)
const openProjectEditDialog = () => {
  showProjectEditDialog.value = true
}

/// ////////////////////////////////////////
// デバッグ用

const onSeed = async () => {
  console.log('seed')
  const database = useDatabase()
  await database.testSeed()

  location.reload()
}

const onFresh = async () => {
  console.log('fresh')
  const database = useDatabase()
  await database.dbWipe()

  location.reload()
}
</script>
