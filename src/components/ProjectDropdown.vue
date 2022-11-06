<template>
  <Dropdown
    v-model="_value"
    :options="projectService?.projects.value"
    option-label="name"
    :keep-in-viewport="false"
    placeholder="未選択"
  >
    <template #value="slotProps">
      <template v-if="slotProps.value">
        <Avatar
          class="!w-6 !h-6"
          :label="slotProps.value.icon"
          :style="{ backgroundColor: slotProps.value.color }"
        />

        <span :class="titleClass">{{ slotProps.value.name }}</span>
      </template>
      <div v-else>
        {{ slotProps.placeholder }}
      </div>
    </template>

    <template #option="slotProps">
      <Avatar
        class="!w-6 !h-6"
        :label="slotProps.option.icon"
        :style="{ backgroundColor: slotProps.option.color }"
      />

      <span>{{ slotProps.option.name }}</span>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { Project } from '~~/src/databases/models/Project'

const props = defineProps<{
  modelValue?: Project,
  titleClass?: string,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', modelValue?: Project): void,
}>()

const _value = computed({
  get: () => props.modelValue,
  set: (value?: Project) => emit('update:modelValue', value),
})

const projectService = inject(ProjectServiceKey)
</script>
