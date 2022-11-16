<template>
  <div
    ref="cardRef"
    :name="`report-${report.id}`"
    class="report-card-wrapper"
    :class="{ 'has-star': report.isStar }"
  >
    <!-- カード -->
    <Sheet
      class="report-card"
      @dblclick="switchEditMode"
      @keydown.esc.stop="switchViewMode"
    >
      <ReportEditSheet
        v-if="isEditMode"
        :report="report"
        @close="switchViewMode"
        @open:menu="openMenu"
      />

      <ReportShowSheet
        v-else
        :report="report"
        @open:menu="openMenu"
      />
    </Sheet>

    <!-- ピン要素 -->
    <div v-if="report.isStar" class="report-card-pin">
      <i class="pi pi-star-fill" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Report } from '~~/src/databases/models/Report'

const props = defineProps<{
  report: Report,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'open:menu', event: MouseEvent, report: Report): void,
}>()

/// ////////////////////////////////////////
// メニュー系

const openMenu = (event: MouseEvent) => {
  emit('open:menu', event, props.report)
}

/// ////////////////////////////////////////
// モード切り替え

const isEditMode = ref<boolean>(false)
const cardRef = ref()

const switchEditMode = () => {
  isEditMode.value = true

  // フォーカス
  nextTick(() => {
    const dom = cardRef.value
    dom.scrollIntoView({ behavior: 'smooth' })
  })
}

const switchViewMode = () => {
  isEditMode.value = false

  // フォーカス
  nextTick(() => {
    const dom = cardRef.value
    dom.scrollIntoView({ behavior: 'smooth' })
  })
}
</script>

<style lang="scss">
.report-card-wrapper {
  position: relative;
  min-width: 300px;

  // 星を付ける
  &.has-star {
    .report-card {
      border: solid 3px var(--yellow-700);
    }

    .p-card-body {
      padding: calc(1.5rem - 3px); // 囲い分引く
    }
  }

  // ピン要素
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
