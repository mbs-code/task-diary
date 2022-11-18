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
          icon="pi pi-sync"
          @click="onReload"
        />

        <Button
          class="p-button-plain p-button-text !w-8 !h-8"
          icon="pi pi-box"
          @click="openProjectEditDialog"
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
          <ReportTimeline class="p-4" />
        </SplitterPanel>

        <SplitterPanel
          ref="todoRef"
          class="overflow-y-scroll"
        >
          <ReportTodoTray class="p-4" />
        </SplitterPanel>
      </Splitter>

      <ProjectEditDialog
        v-model:visible="showProjectEditDialog"
        @update:project="onInit"
      />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const notify = useNotify()

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
  try {
    reportService.timeline.clear()
    reportService.todo.clear()

    await reportService.timeline.fetchList()
    await reportService.todo.fetchList()

    // TLを最下部にスクロールする
    const tl = timelineRef.value.$el
    tl?.scrollTo(0, tl.scrollHeight)
  } catch (err) {
    notify.thrown(err)
  }
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

const showProjectEditDialog = ref<boolean>(false)
const openProjectEditDialog = () => {
  showProjectEditDialog.value = true
}

/// ////////////////////////////////////////
// デバッグ用

const onReload = () => {
  window.location.reload()
}

const onSeed = () => {
  console.log('seed')
  // const database = useDatabase()
  // await database.testSeed()

  // location.reload()
}

const onFresh = () => {
  console.log('fresh')
  // const database = useDatabase()
  // await database.dbWipe()

  // location.reload()
}
</script>
