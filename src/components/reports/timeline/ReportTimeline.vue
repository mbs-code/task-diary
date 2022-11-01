<template>
  <div class="flex flex-col gap-8">
    <InfiniteLoading @infinite="reportService.timeline.onLoadPrev" />

    <div
      v-for="dayReport of reportService.timeline.dayReports.value"
      :key="dayReport.key"
      class="flex gap-2"
    >
      <div class="min-w-4rem">
        <ReportTimelineDate class="sticky top-0 py-2" :dayjs="dayReport.date" />
      </div>

      <div class="flex-grow">
        <div class="flex flex-col gap-4 py-2">
          <div
            v-for="report of dayReport.reports"
            :key="report.id"
            class="flex gap-2"
          >
            <div class="min-w-4rem">
              <ReportTimelineTime class="sticky top-2" :dayjs="report.startAt" />
            </div>

            <ReportCard
              class="flex-grow"
              :report="report"
              @open:menu="openCardMenu"
              @update:text="reportAction.onUpdateText"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="ml-9rem">
      <Button class="w-full p-button-outlined" icon="pi pi-pencil" label="新規作成" @click="onCreate" />
    </div>

    <Menu ref="cardMenuRef" :model="menuItems" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem'
import InfiniteLoading from 'v3-infinite-loading'
import { Report } from '~~/src/databases/models/Report'
import 'v3-infinite-loading/lib/style.css'

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'edit:report', report?: Report),
}>()

const reportService = inject(ReportServiceKey)
const reportAction = inject(ReportActionKey)

/// ////////////////////////////////////////

const dayjs = useDayjs()
const onCreate = () => {
  emit('edit:report', {
    id: 0,
    text: '',
    isStar: false,
    startAt: dayjs(),
    createdAt: undefined,
    updatedAt: undefined,
  })
}

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
        label: 'ToDoに移動',
        icon: 'pi pi-inbox',
        command: () => emit('edit:report', report),
      },
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
