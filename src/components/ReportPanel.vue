<template>
  <div class="report-card-wrapper" :class="{ 'has-star': report.isStar }">
    <!-- カード本体 -->
    <ReportCard class="report-card" :report="report" />

    <!-- 時間要素 -->
    <Chip class="report-card-time" :label="time" />

    <!-- ピン要素 -->
    <div v-if="report.isStar" class="report-card-pin">
      <i class="pi pi-star-fill" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { format as dateFormat } from 'date-fns'
import { Report } from '~~/src/composables/types'

const props = defineProps<{
  report: Report,
}>()

// // eslint-disable-next-line func-call-spacing
// const emit = defineEmits<{
//   (e: 'open:menu', event: MouseEvent, report: Report),
//   (e: 'saved', report: Report),
// }>()

/// ////////////////////////////////////////

const time = computed(() => {
  return props.report.startAt
    ? dateFormat(props.report.startAt, 'HH:mm')
    : undefined
})
</script>

<style lang="scss">
.report-card-wrapper {
  position: relative;

  &.has-star {
    .report-card {
      border: solid 3px var(--yellow-700);
    }
    .p-card-body {
      padding: calc(1.5rem - 3px); // 囲い分引く
    }
  }

  .report-card {
    margin-left: 3rem;
  }

  .report-card-time {
    position: absolute;
    top: 1.65rem;
    left: 0;
    background-color: var(--surface-200);
  }

  .report-card-pin {
    position: absolute;
    top: 0;
    right: 0;
    width: 2rem;
    height: 2rem;
    color: white;
    background-color: var(--yellow-700);
    border-top-right-radius: 4px;
    border-bottom-left-radius: 1rem;
    padding-top: 0.2rem;
    padding-left: 0.6rem;
  }
}
</style>
