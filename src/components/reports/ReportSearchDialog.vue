<template>
  <Dialog
    v-model:visible="_visible"
    class="w-500px"
    modal
  >
    <template #header>
      <h3>タスク検索</h3>
    </template>

    <div class="flex">
      <div>
        <DatePicker :events="monthlyReports" @change:range="onChangeRange" />
      </div>
      <div>
        <ProjectDropdown v-model="form.project" @change="fetchReport" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dayjs } from 'dayjs'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Project } from '~~/src/databases/models/Project'
import { Report } from '~~/src/databases/models/Report'

const props = defineProps<{
  visible: boolean,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void,
}>()

const _visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
})

///

const dayjs = useDayjs()

const reports = ref<Report[]>([])

const monthlyReports = computed(() => {
  const items: { date: Dayjs, count: number }[] = []

  for (const report of reports.value) {
    // 対象の日付を検索
    let item = items.find(i => i.date.isSame(report.startAt, 'date'))
    if (!item) {
      item = {
        date: report.startAt?.clone().startOf('date') ?? dayjs(),
        count: 0,
      }
      items.push(item)
    }

    // カウントを追加
    item.count++
  }

  return items
})

///

const form = reactive<{
  project?: Project,
  start?: Dayjs,
  end?: Dayjs,
}>({})

const fetchReport = async () => {
  reports.value = await ReportAPI.getAll({
    projectId: form.project?.id,
    since: form.start,
    until: form.end,
    sorts: [['start_at', 'asc']],
  })
}

onMounted(async () => await fetchReport())

///

const onChangeRange = async (start?: Dayjs, end?: Dayjs) => {
  form.start = start
  form.end = end

  await fetchReport()
}
</script>
