<template>
  <div class="flex items-center gap-2">
    <Avatar
      class="!w-6 !h-6"
      :label="project.label"
      :style="{ backgroundColor: project.color }"
    />

    <span>{{ project.name }}</span>
  </div>
</template>

<script setup lang="ts">
import { Project } from '~~/src/composables/types'

defineProps<{
  project: Project,
}>()
</script>
