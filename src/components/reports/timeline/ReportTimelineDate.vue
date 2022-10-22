<template>
  <div class="flex flex-col items-center select-none">
    <template v-if="dayjs">
      <div class="text-sm">
        {{ dayjs?.format('YYYY-MM') }}
      </div>
      <div class="text-5xl mb-1">
        {{ dayjs?.get('date') }}
      </div>
      <div class="text-md">
        ({{ dayjs?.format('dd') }})
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
import { Dayjs } from 'dayjs'

defineProps<{ dayjs?: Dayjs }>()
</script>
