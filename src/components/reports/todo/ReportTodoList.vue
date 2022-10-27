<template>
  <div class="flex flex-col gap-1">
    <template v-for="report of todoService.reports.value" :key="report.id">
      <ReportTodoAccordion
        :report="report"
        @open:menu="openCardMenu"
        @update:text="reportAction.onUpdateText"
      />
    </template>

    <Menu ref="cardMenuRef" :model="menuItems" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'
import { Report } from '~~/src/databases/models/Report'

const props = defineProps<{
  todoService: ReturnType<typeof useTodoService>,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'edit:report', report: Report),
}>()

const reportAction = useReportAction(props.todoService)
onMounted(() => props.todoService.fetchList())

/// ////////////////////////////////////////
// メニュー系

const cardMenuRef = ref()
const selectedReport = ref<Report>()
const openCardMenu = (event: MouseEvent, report: Report) => {
  selectedReport.value = report
  cardMenuRef.value?.toggle(event)
}

const menuItems = computed<MenuItem[]>(() => {
  const report = selectedReport.value
  if (report) {
    const isStar = selectedReport.value.isStar
    return [
      {
        label: '編集',
        icon: 'pi pi-pencil',
        command: () => emit('edit:report', report),
      },
      {
        label: isStar ? '星を外す' : '星をつける',
        icon: isStar ? 'pi pi-star' : 'pi pi-star-fill',
        command: () => reportAction.onToggleStar(report),
      },
      {
        separator: true,
      },
      {
        label: '削除',
        icon: 'pi pi-trash',
        class: 'menu-delete',
        command: () => reportAction.onDelete(report),
      },
    ]
  }

  return []
})
</script>

<style lang="scss">
.menu-delete {
  .p-menuitem-icon,
  .p-menuitem-text {
    color: var(--red-500) !important;
  }
}

.p-confirm-dialog {
  .p-confirm-dialog-message {
    white-space: pre;
    line-break: anywhere;
  }
}
</style>
