<template>
  <div class="flex flex-col gap-1">
    <template v-for="report of todoService.reports.value" :key="report.id">
      <ReportTodoAccordion
        :report="report"
        @open:menu="openCardMenu"
        @update:text="onUpdateText"
      />
    </template>

    <Menu ref="cardMenuRef" :model="menuItems" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

// const props = defineProps<{
//   dayReports: DayReport,
// }>()

// eslint-disable-next-line func-call-spacing
// const emit = defineEmits<{
//   (e: 'update:report', report: Report),
// }>()

/// ////////////////////////////////////////
// データ

const todoService = useTodoService()
onMounted(() => todoService.fetchList())

/// ////////////////////////////////////////
// メニュー系

const cardMenuRef = ref()
const selectedReport = ref<Report>()
const openCardMenu = (event: MouseEvent, report: Report) => {
  selectedReport.value = report
  cardMenuRef.value?.toggle(event)
}

const onUpdateText = async (text: string, report: Report, onDone: () => void) => {
  const form = {
    ...report,
    text,
  }
  const updReport = await ReportAPI.update(report.id, form)
  todoService.replaceList(updReport)

  onDone()
}

///

const onToggleStar = async () => {
  const form = {
    ...selectedReport.value,
    isStar: !selectedReport.value.isStar,
  }
  const updReport = await ReportAPI.update(selectedReport.value.id, form)
  todoService.replaceList(updReport)
}

const confirm = useConfirm()
const onDelete = () => {
  const text = selectedReport.value.text.slice(0, 20).replace(/\r?\n/g, ' ')
  confirm.require({
    // eslint-disable-next-line no-irregular-whitespace
    message: `「${text}...」\n  のレポートを削除しますか？`,
    header: '削除の確認',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await ReportAPI.remove(selectedReport.value.id)
      todoService.replaceList(selectedReport.value)
    },
  })
}

const menuItems = computed<MenuItem[]>(() => {
  if (selectedReport.value) {
    const isStar = selectedReport.value.isStar
    return [
      {
        label: '編集',
        icon: 'pi pi-pencil',
        command: () => {
          window.alert('edit')
        },
      },
      {
        label: isStar ? '星を外す' : '星をつける',
        icon: isStar ? 'pi pi-star' : 'pi pi-star-fill',
        command: onToggleStar,
      },
      {
        separator: true,
      },
      {
        label: '削除',
        icon: 'pi pi-trash',
        class: 'menu-delete',
        command: onDelete,
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
