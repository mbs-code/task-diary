<template>
  <Menu ref="menuRef" :model="menuItems" :popup="true" />
</template>

<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'
import { Report } from '~~/src/composables/types'

const props = defineProps<{
  report?: Report,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  // (e: 'update:visible', visible: boolean),
  // (e: 'open:menu', event: MouseEvent, items: MenuItem[]),
  // (e: 'saved', report: Report),
}>()

/// ////////////////////////////////////////

const menuItems = ref<MenuItem[]>([
  {
    label: '編集',
    icon: 'pi pi-pencil',
    command: () => {
      console.log('edit')
    },
  },
  {
    label: '星をつける',
    icon: 'pi pi-star',
    command: () => {
      console.log('star')
    },
  },
  {
    label: '削除',
    icon: 'pi pi-trash',
    command: () => {
      console.log('delete')
    },
  },
])

/// ////////////////////////////////////////
// メニュー管理

const menuRef = ref()
const toggle = (event: MouseEvent) => {
  menuRef.value.toggle(event)
}

defineExpose({ toggle })
</script>
