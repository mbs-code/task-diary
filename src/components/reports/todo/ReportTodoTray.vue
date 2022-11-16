<template>
  <div class="flex flex-col gap-4">
    <template v-for="report of todo?.reports.value" :key="report.id">
      <ReportCard
        :report="report"
        @open:menu="openCardMenu"
      />
    </template>

    <Menu ref="cardMenuRef" class="report-card-menu" :model="menuItems" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'
import { Report } from '~~/src/databases/models/Report'

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'edit:report', report?: Partial<Report>): void,
}>()

const reportService = inject(ReportServiceKey)
const reportAction = inject(ReportActionKey)
const todo = computed(() => reportService?.todo)

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
    const isStar = report.isStar
    return [
      {
        label: 'タスクに移動',
        icon: 'pi pi-inbox',
        command: () => reportAction?.onSwitchTask(report),
      },
      {
        label: 'コピーをタスクに作成',
        icon: 'pi pi-inbox',
        command: () => reportAction?.onSwitchTask(report, true),
      },
      {
        label: '編集',
        icon: 'pi pi-pencil',
        command: () => emit('edit:report', report),
      },
      {
        label: isStar ? '星を外す' : '星をつける',
        icon: isStar ? 'pi pi-star' : 'pi pi-star-fill',
        command: () => reportAction?.onToggleStar(report),
      },
      {
        separator: true,
      },
      {
        label: '削除',
        icon: 'pi pi-trash',
        class: 'menu-delete',
        command: () => reportAction?.onDelete(report),
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
