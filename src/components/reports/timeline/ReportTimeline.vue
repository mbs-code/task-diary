<template>
  <div class="flex flex-col gap-8">
    <!-- タイムライン -->
    <div
      v-for="dayReport of timeline?.dayReports.value"
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
            />
          </div>
        </div>
      </div>
    </div>

    <!-- インライン編集カード -->
    <div ref="editCardRef" class="ml-9rem">
      <ReportEditCard
        v-if="showEditCard"
        :report="defaultReport"
        class="flex-grow"
        @close="closeEditCard"
      />

      <Button
        v-else
        class="w-full p-button-outlined"
        icon="pi pi-pencil"
        label="新規作成"
        @click="openEditCard"
      />
    </div>

    <Menu ref="cardMenuRef" :model="menuItems" :popup="true" />
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
const timeline = computed(() => reportService?.timeline)

/// ////////////////////////////////////////

const dayjs = useDayjs()

const showEditCard = ref<boolean>(false)
const defaultReport = ref<Partial<Report>>()
const editCardRef = ref()
const openEditCard = () => {
  defaultReport.value = {
    text: '',
    startAt: dayjs(),
  }
  showEditCard.value = true

  // フォーカス
  nextTick(() => {
    const dom = editCardRef.value
    dom.scrollIntoView({ behavior: 'smooth' })
  })
}

const closeEditCard = () => {
  showEditCard.value = false
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
    const isStar = report.isStar
    return [
      {
        label: 'ToDoに移動',
        icon: 'pi pi-inbox',
        command: () => reportAction?.onSwitchTodo(report),
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
