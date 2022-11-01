<template>
  <div
    class="report-accordion-wrapper"
    :class="{ 'has-star': report.isStar }"
  >
    <Accordion>
      <AccordionTab>
        <!-- ヘッダ -->
        <template #header>
          <Avatar
            class="!w-6 !h-6"
            :label="report.project?.icon"
            :style="{ backgroundColor: report.project?.color }"
          />

          <span>{{ report.project?.name }}</span>

          <div class="flex-grow">
            - asd
          </div>

          <template v-if="isEditMode">
            <Button
              icon="pi pi-save"
              class="p-button-rounded"
              @click.stop="onSave"
            />
            <Button
              icon="pi pi-times"
              class="p-button-plain p-button-rounded p-button-text"
              @click.stop="switchViewMode"
            />
          </template>

          <template v-else>
            <Button
              icon="pi pi-ellipsis-v"
              class="p-button-plain p-button-rounded p-button-text"
              @click.stop="openMenu"
            />
          </template>

          <!-- ピン要素 -->
          <div v-if="report.isStar" class="report-accordion-pin">
            <i class="pi pi-star-fill" />
          </div>
        </template>

        <!-- コンテンツ -->
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
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { Report } from '~~/src/databases/models/Report'

const props = defineProps<{
  report: Report,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'open:menu', event: MouseEvent, report: Report),
}>()

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
  const newText = (text.value ?? '').trim()
  // emit('update:text', newText, props.report, switchViewMode)
}
</script>

<style lang="scss">
.report-accordion-wrapper {
  position: relative;
  min-width: 300px;

  .p-accordion {
    .p-accordion-header-link {
      @apply flex items-center gap-2;
      padding: 0.5rem 2rem 0.5rem 1.5rem;
    }

    .p-accordion-content {
      padding: 1.2rem;
    }
  }

  // 星をつける
  &.has-star {
    .p-accordion {
      border: solid 3px var(--yellow-700);
      border-radius: 6px;

      .p-accordion-header-link {
        padding: calc(0.5rem - 3px) calc(2rem - 3px) calc(0.5rem - 3px) calc(1.5rem - 3px); // 囲い分引く
      }
    }
  }

  // ピン要素
  .report-accordion-pin {
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
    margin-top: -0.1rem;
    margin-right: -0.1rem;
  }
}
</style>
