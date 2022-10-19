<template>
  <div class="report-card-wrapper">
    <!-- カード本体 -->
    <Card class="report-card" :class="{ 'has-star': report.isStar }">
      <!-- カードヘッダ -->
      <template #title>
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
            class="whitespace-pre-wrap break-words min-h-4"
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
import Textarea from 'primevue/textarea'
import { Report } from '~~/src/composables/types'

const props = defineProps<{
  report: Report,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'open:menu', event: MouseEvent, report: Report),
  (e: 'saved', report: Report),
}>()

/// ////////////////////////////////////////
// メニュー系

const openMenu = (event: MouseEvent) => {
  emit('open:menu', event, props.report)
}

/// ////////////////////////////////////////

const time = computed(() => {
  return props.report.startAt
    ? dateFormat(props.report.startAt, 'HH:mm')
    : undefined
})

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

  .report-card {
    margin-left: 3rem;

    &.has-star {
      border: solid 3px var(--yellow-700);
    }
  }

  .report-card-time {
    position: absolute;
    top: 1.6rem;
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
