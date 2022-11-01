<template>
  <Dialog
    v-model:visible="visible"
    class="w-[600px]"
    modal
    maximizable
  >
    <template #header>
      <h3>プロジェクト編集</h3>
    </template>

    <DataTable
      v-model:editingRows="editingRows"
      :value="projectService.projects.value"
      edit-mode="row"
      data-key="id"
      responsive-layout="scroll"
      @row-edit-save="onRowEditSave"
    >
      <Column field="id" header="ID">
        <!-- <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template> -->
      </Column>

      <Column field="name" header="プロジェクト名">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>

      <Column field="icon" header="アイコン">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>

      <Column field="color" header="色">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>

      <Column :row-editor="true" style="width:10%; min-width:8rem" body-style="text-align:center" />
      <!--
        v-model:editingRows="editingRows"
      @row-edit-save="onRowEditSave" -->
      <!-- <Column field="code" header="Code" style="width:20%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" autofocus />
        </template>
      </Column>
      <Column field="name" header="Name" style="width:20%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="inventoryStatus" header="Status" style="width:20%">
        <template #editor="{ data, field }">
          <Dropdown v-model="data[field]" :options="statuses" option-label="label" option-value="value" placeholder="Select a Status">
            <template #option="slotProps">
              <span :class="'product-badge status-' + slotProps.option.value.toLowerCase()">{{ slotProps.option.label }}</span>
            </template>
          </Dropdown>
        </template>
        <template #body="slotProps">
          {{ getStatusLabel(slotProps.data.inventoryStatus) }}
        </template>
      </Column>
      <Column field="price" header="Price" style="width:20%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column :row-editor="true" style="width:10%; min-width:8rem" body-style="text-align:center" /> -->
    </DataTable>
  </Dialog>
</template>

<script setup lang="ts">
import { DataTableRowEditSaveEvent } from 'primevue/datatable'
import { inject } from 'vue'
import { ProjectAPI } from '~~/src/apis/ProjectAPI'
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { FormProject, Project } from '~~/src/databases/models/Project'
import { FormReport, Report } from '~~/src/databases/models/Report'
import { Status } from '~~/src/databases/models/Status'

const props = defineProps<{
  visible: boolean,
  // report?: Report,
  // projects: Project[],
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:visible', visible: boolean),
  // (e: 'update:report', report: Report, oldReport?: Report),
}>()

const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val),
})

const projectService = inject(ProjectServiceKey)

/// ////////////////////////////////////////

const editingRows = ref([])

const onRowEditSave = async (event: DataTableRowEditSaveEvent) => {
  const data = event.data as Project
  const newData = event.newData as Project

  const params: FormProject = {
    name: newData.name,
    color: newData.color,
    icon: newData.icon,
  }

  // upsert 処理
  const projectId = data?.id
  const _updProject = projectId
    ? await ProjectAPI.update(projectId, params)
    : await ProjectAPI.create(params)

  // 画面更新
  projectService.fetch()
}
</script>
