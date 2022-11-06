<template>
  <div
    class="flex flex-col gap-3"
    @keydown.ctrl.s.stop="onSave"
    @keydown.ctrl.enter.stop="onSave"
    @keydown.alt.enter.stop="onSave"
  >
    <!-- ヘッダ -->
    <div class="flex items-center gap-2 text-2xl">
      <ProjectDropdown
        v-model="form.project"
        class="flex-grow"
        title-class="text-2xl"
      />

      <div class="w-2" />

      <Button
        icon="pi pi-save"
        class="p-button-rounded"
        @click="onSave"
      />

      <Button
        icon="pi pi-times"
        class="p-button-plain p-button-rounded p-button-text"
        @click="emit('close')"
      />
    </div>

    <!-- コンテンツ -->
    <div class="min-h-3rem">
      <Textarea
        ref="textareaRef"
        v-model="form.text"
        class="w-full max-w-full min-w-full"
        auto-resize
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Project } from '~~/src/databases/models/Project'
import { FormReport, Report } from '~~/src/databases/models/Report'

const props = defineProps<{
  report: Report,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'open:menu', event: MouseEvent, report: Report): void,
  (e: 'close'): void,
}>()

const reportService = inject(ReportServiceKey)

/// ////////////////////////////////////////

const textareaRef = ref()
onMounted(() => {
  onInit()

  // フォーカス
  nextTick(() => {
    const textarea = textareaRef.value.$el
    if (textarea) {
      const len = textarea.value.length
      textarea.focus()
      textarea.setSelectionRange(len, len)
    }
  })
})

const form = reactive<{
  text: string
  project?: Project
}>({
  text: '',
  project: undefined,
})

const onInit = () => {
  form.text = props.report?.text ?? ''
  form.project = props.report?.project ?? undefined
}

const onSave = async () => {
  const params: FormReport = {
    text: form.text,
    projectId: form.project?.id,
    statusId: props.report.status?.id,
    isStar: props.report.isStar,
    startAt: props.report.startAt,
  }

  // upsert 処理
  const reportId = props.report?.id
  const updReport = reportId
    ? await ReportAPI.update(reportId, params)
    : await ReportAPI.create(params)

  // データの置き換え
  reportService?.updateList(updReport)

  emit('close')
}
</script>
