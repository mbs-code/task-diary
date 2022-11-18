<template>
  <div class="h-screen flex flex-col">
    <div
      v-if="hasHeader"
      class="flex items-center gap-2 px-4 py-1"
      :style="{ background: 'var(--cyan-900)' }"
    >
      <slot name="header" />
    </div>

    <!-- <div
      class="flex-grow overflow-y-scroll overflow-x-auto p-2"
      :style="{ background: 'var(--surface-ground)' }"
    > -->
    <slot />
    <!-- </div> -->

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup lang="ts">
const slots = useSlots()
const hasHeader = computed(() => Boolean(slots.header))
</script>
