<template>
  <div class="flex flex-col gap-3">
    <!-- ヘッダ -->
    <div class="flex items-center gap-2 text-2xl">
      <Avatar
        class="!w-6 !h-6"
        :label="report.project?.icon"
        :style="{ backgroundColor: report.project?.color }"
      />

      <span>{{ report.project?.name }}</span>

      <div class="flex-grow" />

      <Button
        icon="pi pi-ellipsis-v"
        class="p-button-plain p-button-rounded p-button-text"
        @click="emit('open:menu', $event, report)"
        @mouseenter="openTimeOverlay"
      />
    </div>

    <!-- コンテンツ -->
    <div class="whitespace-pre-wrap break-words min-h-2rem">
      {{ report.text }}
    </div>

    <!-- レポート詳細パネル -->
    <OverlayPanel
      ref="overlayRef"
      append-to="body"
    >
      <div class="flex flex-col gap-0.5">
        <div>ID: {{ report.id }}</div>
        <div>文字数: {{ report.text?.length.toLocaleString() }} 文字</div>
        <div>開始日: {{ createdString(report.startAt) }}</div>
        <div>
          <Divider />
        </div>
        <div>作成日: {{ createdString(report.createdAt) }}</div>
        <div>更新日: {{ createdString(report.updatedAt) }}</div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script setup lang="ts">
import { Dayjs } from 'dayjs'
import { Report } from '~~/src/databases/models/Report'

defineProps<{
  report: Report,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'open:menu', event: MouseEvent, report: Report): void,
}>()

const dayjs = useDayjs()

///

const overlayRef = ref()
const openTimeOverlay = (event: MouseEvent) => {
  overlayRef.value.toggle(event)
}

const createdString = (date?: Dayjs) => {
  if (date) {
    const dateStr = date.format('YYYY-MM-DD HH:mm:ss')

    const diff = dayjs().diff(date)
    const human = dayjs.duration(diff).humanize()
    const way = diff > 0 ? '前' : '後'
    return `${dateStr} ( ${human}${way} )`
  }

  return '---'
}
</script>
