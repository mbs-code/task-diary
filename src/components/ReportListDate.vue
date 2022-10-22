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
const props = defineProps<{
  date?: Date,
}>()

const dayjs = useDayjs()
const dayParams = computed(() => {
  const date = dayjs(props.date)
  if (date) {
    return {
      yearMonth: date.format('YYYY-MM'),
      date: date.get('date'),
      weekOfDay: date.format('dd'),
    }
  }
  return undefined
})
</script>
