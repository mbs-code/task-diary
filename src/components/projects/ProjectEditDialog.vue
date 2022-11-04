<template>
  <Dialog
    v-model:visible="visible"
    class="p-dialog-maximized"
    modal
  >
    <template #header>
      <h3>プロジェクト編集</h3>
    </template>

    <DataTable
      v-model:editingRows="editingRows"
      :value="projects"
      edit-mode="row"
      data-key="id"
      responsive-layout="scroll"
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

      <Column>
        <template #header>
          <Button icon="pi pi-plus" class="p-button-rounded p-button-text p-button-plain" @click="onRowAdd" />
        </template>

        <template #body="{ data }">
          <template v-if="!isRowEdit(data)">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-plain" @click="onRowEdit(data)" />
          </template>

          <template v-else>
            <Button icon="pi pi-check" class="p-button-rounded p-button-text p-button-plain" @click="onRowEditSave(data)" />
            <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-plain" @click="onRowEditCancel(data)" />
          </template>
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { ProjectAPI } from '~~/src/apis/ProjectAPI'
import { FormProject, Project } from '~~/src/databases/models/Project'

const props = defineProps<{
  visible: boolean,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:visible', visible: boolean),
  (e: 'update:project', project: Project, old?: Project),
}>()

const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val),
})

const projectService = inject(ProjectServiceKey)

/// ////////////////////////////////////////

const projects = ref<Project[]>([])
const editingRows = ref<Project[]>([])

const init = () => {
  editingRows.value = []
  projects.value = [...projectService.projects.value]
}

watch(() => props.visible, (val) => {
  val && init()
})

/// ////////////////////////////////////////

const isRowEdit = (project: Project) => {
  return editingRows.value.some(row => row.id === project.id)
}

const onRowAdd = () => {
  // 新規rowがなければ追加
  const hasNewRow = projects.value.some(p => p.id === 0)
  if (!hasNewRow) {
    const newProject = {
      id: 0,
      name: '',
      createdAt: undefined,
      updatedAt: undefined,
    }
    projects.value.push(newProject)
    editingRows.value = [...editingRows.value, newProject]
  }
}

const onRowEdit = (project: Project) => {
  // 編集中に追加されていなければ追加
  const hasEditRow = editingRows.value.some(row => row.id === project.id)
  if (!hasEditRow) {
    editingRows.value = [...editingRows.value, project]
  }
}

const onRowEditCancel = (project: Project) => {
  // 同idを取り除く
  editingRows.value = editingRows.value.filter(row => row.id !== project.id)
  if (project.id === 0) {
    projects.value = projects.value.filter(p => p.id !== project.id)
  }
}

const onRowEditSave = async (project: Project) => {
  const params: FormProject = {
    name: project.name,
    color: project.color,
    icon: project.icon,
  }

  // upsert 処理
  const projectId = project?.id
  const updProject = projectId
    ? await ProjectAPI.update(projectId, params)
    : await ProjectAPI.create(params)

  // 画面更新
  projectService.fetch()
  init()

  const oldProject = editingRows.value.find(row => row.id === project.id)
  emit('update:project', updProject, oldProject)
}
</script>
