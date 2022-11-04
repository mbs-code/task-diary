<template>
  <div>
    <Chip
      class="w-4rem"
      :label="dayjs?.format('HH:mm') ?? '--:--'"
    />
  </div>
</template>

<script setup lang="ts">
import { Dayjs } from 'dayjs'

defineProps<{ dayjs?: Dayjs }>()
</script>
