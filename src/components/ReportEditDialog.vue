<template>
  <Dialog
    v-model:visible="visible"
    class="w-[400px]"
    :close-on-escape="false"
  >
    <template #header>
      <h3>新規作成</h3>
    </template>

    <div class="flex flex-col gap-2">
      <Dropdown
        v-model="selectedProject"
        :options="projects"
        option-label="name"
        :show-clear="true"
        :keep-in-viewport="false"
        placeholder="未選択"
      >
        <template #value="slotProps">
          <ProjectLabel v-if="slotProps.value" :project="slotProps.value" />
          <div v-else>
            {{ slotProps.placeholder }}
          </div>
        </template>

        <template #option="slotProps">
          <ProjectLabel :project="slotProps.option" />
        </template>
      </Dropdown>

      <Textarea v-model="text" class="max-w-full" rows="5" />
    </div>

    <template #footer>
      <Button icon="pi pi-trash" class="p-button-plain p-button-text p-button-rounded" />
      <div class="flex-grow" name="padding" />
      <Button icon="pi pi-inbox" label="TODO" class="p-button-success p-button-text" />
      <Button icon="pi pi-clock" label="開始" class="p-button-success" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Project } from '~~/src/composables/types'

const props = defineProps<{
  visible: boolean,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:visible', visible: boolean),
}>()

const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val),
})

/// ////////////////////////////////////////

const selectedProject = ref<Project>()

const projects = ref<Project[]>([
  { id: 1, name: '案件A', label: '😀', color: 'red' },
  { id: 2, name: '案件B' },
  { id: 3, name: 'ZZZタスク', label: 'ZZ', color: 'green' },
])

const text = ref<string>()
</script>
