<template>
  <div
    class="report-card-wrapper is-tiny"
    :class="{ 'has-star': report.isStar, 'is-shrink': isShrink }"
  >
    <!-- カード本体 -->
    <Card class="report-card">
      <!-- カードヘッダ -->
      <template #title>
        <Button
          v-if="accordion"
          :icon="isShrink ? 'pi pi-angle-right' : 'pi pi-angle-down'"
          class="p-button-plain p-button-rounded p-button-text"
          @click="toggleShrink"
        />

        <Avatar
          class="!w-6 !h-6"
          :label="report.project.label"
          :style="{ backgroundColor: report.project.color }"
        />

        <span>{{ report.project.name }}</span>

        <div class="flex-grow" />

        <template v-if="isEditMode">
          <Button
            icon="pi pi-save"
            class="p-button-rounded"
            @click="onSave"
          />
          <Button
            icon="pi pi-times"
            class="p-button-plain p-button-rounded p-button-text"
            @click="switchViewMode"
          />
        </template>

        <template v-else>
          <Button
            icon="pi pi-ellipsis-v"
            class="p-button-plain p-button-rounded p-button-text"
            @click="openMenu"
          />
        </template>
      </template>

      <!-- カードコンテンツ -->
      <template #content>
        <template v-if="isEditMode">
          <Textarea
            ref="textareaRef"
            v-model="text"
            class="w-full max-w-full min-w-full"
            auto-resize
            @keydown.esc.stop="switchViewMode"
            @keydown.ctrl.s.stop="onSave"
          />
        </template>

        <template v-else>
          <div
            class="whitespace-pre-wrap break-words min-h-2rem"
            @dblclick="switchEditMode"
          >
            {{ report.text }}
          </div>
        </template>
      </template>
    </Card>

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
  accordion?: boolean, // アコーディオンを使用する

}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'open:menu', event: MouseEvent, report: Report),
  (e: 'saved', report: Report),
}>()

/// ////////////////////////////////////////

const time = computed(() => {
  return props.report.startAt
    ? dateFormat(props.report.startAt, 'HH:mm')
    : undefined
})

/// ////////////////////////////////////////
// アコーディオン系

const isShrink = ref<boolean>(false)
const toggleShrink = () => {
  isShrink.value = !isShrink.value
}

/// ////////////////////////////////////////
// メニュー系

const openMenu = (event: MouseEvent) => {
  emit('open:menu', event, props.report)
}

/// ////////////////////////////////////////
// 簡易編集機能

const isEditMode = ref<boolean>(false)
const textareaRef = ref()

const text = ref<string>()
const switchEditMode = () => {
  text.value = props.report.text
  isEditMode.value = true
  nextTick(() => {
    textareaRef.value?.$el.focus()
  })
}

const switchViewMode = () => {
  isEditMode.value = false
}

const onSave = () => {
  const report = { ...props.report }
  report.text = (text.value ?? '').trim()
  emit('saved', report)

  switchViewMode()
}
</script>

<style lang="scss">
.report-card-wrapper {
  position: relative;

  // 星を付ける
  &.has-star {
    .report-card {
      border: solid 3px var(--yellow-700);
    }
    .p-card-body {
      padding: calc(1.5rem - 3px); // 囲い分引く
    }
  }

  // シュリンク時、本文を消す
  &.is-shrink {
    .p-card-content {
      display: none;
    }
  }

  .report-card {
    margin-left: 3rem;

    .p-card-title {
      @apply flex items-center gap-2;
      @apply m-0 pr-3;
    }

    .p-card-content {
      @apply pb-0;
    }
  }

  ///

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
