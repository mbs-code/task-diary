<template>
  <div
    class="flex flex-col gap-4"
    @keydown.ctrl.s.stop="onSave"
    @keydown.ctrl.enter.stop="onSave"
    @keydown.alt.enter.stop="onSave"
  >
    <!-- 上部フォーム -->
    <div class="flex items-center gap-4">
      <!-- 左 -->
      <div class="flex-grow flex flex-col gap-2">
        <ProjectDropdown v-model="form.project" />
        <InputDatetime v-model="form.startAt" />
      </div>

      <!-- 右 -->
      <div class="min-w-4rem flex flex-col gap-2">
        <div class="flex gap-1">
          <Button
            :icon="form.isStar ? 'pi pi-star-fill' : 'pi pi-star'"
            class="p-button-rounded p-button-warning"
            :class="{ 'p-button-text': !form.isStar }"
            @click="form.isStar = !form.isStar"
          />
          <Button
            icon="pi pi-times"
            class="p-button-plain p-button-rounded p-button-text"
            @click="emit('close')"
          />
        </div>

        <div class="flex justify-end">
          <Button
            icon="pi pi-save"
            class="!w-full"
            @click="onSave"
          />
        </div>
      </div>
    </div>

    <!-- 下部フォーム -->
    <div class="min-h-3rem">
      <Textarea
        ref="textareaRef"
        v-model="form.text"
        class="w-full max-w-full min-w-full min-h-6rem"
        auto-resize
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Dayjs } from 'dayjs'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Project } from '~~/src/databases/models/Project'
import { FormReport, Report } from '~~/src/databases/models/Report'

const props = defineProps<{
  report?: Partial<Report>,
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

  // フォーカス（スクロール遅延込）
  setTimeout(() => {
    const textarea = textareaRef.value.$el
    if (textarea) {
      const len = textarea.value.length
      textarea.focus()
      textarea.setSelectionRange(len, len)
    }
  }, 300)
})

const form = reactive<{
  text: string
  project?: Project
  startAt?: Dayjs
  isStar: boolean
}>({
  text: '',
  project: undefined,
  startAt: undefined,
  isStar: false,
})

const onInit = () => {
  form.text = props.report?.text ?? ''
  form.project = props.report?.project ?? undefined
  form.startAt = props.report?.startAt
  form.isStar = props.report?.isStar ?? false
}

const onSave = async () => {
  const params: FormReport = {
    text: form.text,
    projectId: form.project?.id,
    startAt: form.startAt,
    isStar: form.isStar,

    statusId: props.report?.status?.id,
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
