<template>
  <Dialog
    v-model:visible="visible"
    class="w-[600px]"
    modal
  >
    <template #header>
      <h3>{{ isEdit ? "編集" : '新規作成' }}</h3>
    </template>

    <div class="flex flex-col gap-2">
      <div class="p-inputgroup">
        <Dropdown
          v-model="form.project"
          :options="projects"
          option-label="name"
          :keep-in-viewport="false"
          placeholder="未選択"
        >
          <template #value="slotProps">
            <template v-if="slotProps.value">
              <Avatar
                class="!w-6 !h-6"
                :label="slotProps.value.icon"
                :style="{ backgroundColor: slotProps.value.color }"
              />

              <span>{{ slotProps.value.name }}</span>
            </template>
            <div v-else>
              {{ slotProps.placeholder }}
            </div>
          </template>

          <template #option="slotProps">
            <Avatar
              class="!w-6 !h-6"
              :label="slotProps.option.icon"
              :style="{ backgroundColor: slotProps.option.color }"
            />

            <span>{{ slotProps.option.name }}</span>
          </template>
        </Dropdown>

        <Button
          icon="pi pi-times"
          class="p-button-text p-button-plain"
          @click="form.project = undefined"
        />
      </div>

      <div class="p-inputgroup">
        <Button
          icon="pi pi-calendar"
          class="p-button-outlined"
          @click="form.startAt = new Date()"
        />

        <Calendar
          v-model="form.startAt"
          date-format="yy-mm-dd"
          hide-on-date-time-select
          show-time
          show-seconds
          show-button-bar
          show-clear
          placeholder="開始時刻"
        />

        <Button
          icon="pi pi-times"
          class="p-button-text p-button-plain"
          @click="form.startAt = undefined"
        />
      </div>

      <Textarea v-model="form.text" class="max-w-full" rows="5" />
    </div>

    <template #footer>
      <Button
        icon="pi pi-replay"
        class="p-button-plain p-button-text p-button-rounded"
        @click="onInit"
      />

      <div class="flex-grow" name="padding" />

      <Button
        icon="pi pi-save"
        label="保存"
        class="p-button-success"
        @click="onSave"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Project } from '~~/src/databases/models/Project'
import { FormReport, Report } from '~~/src/databases/models/Report'
import { Status } from '~~/src/databases/models/Status'

const props = defineProps<{
  visible: boolean,
  report?: Report,
  projects: Project[],
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:visible', visible: boolean),
  (e: 'update:report', report: Report, oldReport?: Report),
}>()

const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val),
})

watch(() => props.visible, (val) => {
  if (val) { onInit() }
})

/// ////////////////////////////////////////

const dayjs = useDayjs()

const isEdit = computed(() => Boolean(props.report?.id))

const form = reactive<{
  text: string
  project?: Project
  status?: Status
  isStar: boolean
  startAt?: Date
}>({
  text: '',
  project: undefined,
  status: undefined,
  isStar: false,
  startAt: undefined,
})

const onInit = () => {
  form.text = props.report?.text ?? ''
  form.project = props.report?.project ?? undefined
  form.status = props.report?.status ?? undefined
  form.isStar = props.report?.isStar ?? false
  form.startAt = props.report?.startAt?.toDate() ?? undefined
}

const onSave = async () => {
  const params: FormReport = {
    text: form.text,
    projectId: form.project?.id,
    statusId: form.status?.id,
    isStar: form.isStar,
    startAt: form.startAt ? dayjs(form.startAt) : undefined,
  }

  // upsert 処理
  const reportId = props.report?.id
  const updReport = reportId
    ? await ReportAPI.update(reportId, params)
    : await ReportAPI.create(params)

  emit('update:report', updReport, props.report)
  visible.value = false
}
</script>
