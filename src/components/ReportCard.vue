<template>
  <div class="relative">
    <Chip
      class="absolute top-[1.6rem] left-0"
      :label="time"
      :style="{ background: 'var(--surface-200)' }"
    />

    <Card class="ml-3rem">
      <template #title>
        <ProjectLabel :project="report.project" />
      </template>

      <template #content>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
        quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { format as dateFormat } from 'date-fns'
import { Report } from '~~/src/composables/types'

const props = defineProps<{
  report: Report,
}>()

const time = computed(() => {
  return props.report.startAt
    ? dateFormat(props.report.startAt, 'HH:mm')
    : undefined
})
</script>
