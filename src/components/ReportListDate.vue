<template>
  <div class="flex flex-col items-center w-4rem select-none">
    <template v-if="dayParams">
      <div class="text-sm">
        {{ dayParams.yearMonth }}
      </div>
      <div class="text-5xl mb-1">
        {{ dayParams.date }}
      </div>
      <div class="text-md">
        ({{ dayParams.weekOfDay }})
      </div>
    </template>

    <template v-else>
      <div class="text-4xl">
        --
      </div>
      <div class="text-md mb-1">
        (未指定)
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable import/no-duplicates */
import { getDate, getDay, format } from 'date-fns'
import { ja } from 'date-fns/locale'

const props = defineProps<{
  date?: Date,
}>()

const dayParams = computed(() => {
  const date = props.date
  if (date) {
    return {
      yearMonth: format(date, 'yyyy-MM'),
      date: getDate(date),
      weekOfDay: ja.localize.day(getDay(date), { width: 'short' }),
    }
  }
  return undefined
})
</script>
