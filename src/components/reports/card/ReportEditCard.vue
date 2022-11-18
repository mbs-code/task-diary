<template>
  <div
    name="report-edit"
    class="report-card-wrapper"
  >
    <!-- カード -->
    <Sheet
      class="report-card"
      @keydown.esc.stop="emit('close')"
    >
      <ReportEditSheet
        :report="report"
        @close="emit('close')"
      />
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Report } from '~~/src/databases/models/Report'

defineProps<{
  report?: Partial<Report>,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'close'): void,
}>()
</script>
