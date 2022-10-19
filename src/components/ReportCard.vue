<template>
  <div class="relative">
    <Chip
      class="absolute top-[1.6rem] left-0"
      :label="time"
      :style="{ background: 'var(--surface-200)' }"
    />

    <Card class="ml-3rem" @dblclick="switchEditMode">
      <template #title>
        <Avatar
          class="!w-6 !h-6"
          :label="report.project.label"
          :style="{ backgroundColor: report.project.color }"
        />

        <span>{{ report.project.name }}</span>

        <div class="flex-grow" />

        <Button
          type="button"
          icon="pi pi-ellipsis-v"
          class="p-button-plain p-button-rounded p-button-text"
          @click.stop="openMenu"
        />
      </template>

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
          <div class="whitespace-pre-wrap break-words">
            {{ report.text }}
          </div>
        </template>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { format as dateFormat } from 'date-fns'
import { MenuItem } from 'primevue/menuitem'
import Textarea from 'primevue/textarea'
import { Report } from '~~/src/composables/types'

const props = defineProps<{
  report: Report,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'open:menu', event: MouseEvent, items: MenuItem[]),
  (e: 'saved', report: Report),
}>()

/// ////////////////////////////////////////
// メニュー系

const menuItems = ref<MenuItem[]>([
  { label: '編集', icon: 'pi pi-pencil', command: () => console.log('edit') },
  { label: '星をつける', icon: 'pi pi-star', command: () => console.log('star') },
  { label: '削除', icon: 'pi pi-trash', command: () => console.log('delete') },
])

const openMenu = (event: MouseEvent) => {
  emit('open:menu', event, menuItems.value)
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
