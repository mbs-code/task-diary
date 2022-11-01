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
      />
    </div>

    <!-- コンテンツ -->
    <div class="whitespace-pre-wrap break-words min-h-2rem">
      {{ report.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Report } from '~~/src/databases/models/Report'

defineProps<{
  report: Report,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'open:menu', event: MouseEvent, report: Report),
}>()
</script>
