<template>
  <Dialog
    v-model:visible="visible"
    class="p-dialog-maximized"
    content-class="!p-0"
    modal
  >
    <template #header>
      <h3>プロジェクト編集</h3>
    </template>

    <DataTable
      v-model:editingRows="editingRows"
      class="p-datatable-sm"
      :value="projects"
      edit-mode="row"
      data-key="id"
      responsive-layout="scroll"
      scrollable
      scroll-height="calc(100vh - 52px)"
    >
      <Column field="id" header="ID" header-class="justify-center w-4rem max-w-4rem" body-class="justify-center w-4rem max-w-4rem" />

      <Column field="name" header="プロジェクト名" body-class="min-w-10rem">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" class="w-full" />
        </template>
      </Column>

      <Column field="icon" header="アイコン" body-class="min-w-10rem">
        <template #body="{ data }">
          <Avatar
            class="!w-6 !h-6 mr-2"
            :label="data?.icon"
            :style="{ backgroundColor: data?.color }"
          />

          <span>{{ data?.color || '---' }}</span>
        </template>

        <template #editor="{ data, field }">
          <InputText v-model="data[field]" class="mr-4 w-full" placeholder="文字列" />

          <ColorPicker v-model="data['color']" class="mx-2" @change="data['color'] = '#' + data['color']" />
          <InputText v-model="data['color']" class="w-6rem" placeholder="色" />
        </template>
      </Column>

      <Column header-class="justify-center w-8rem max-w-8rem" body-class="justify-center w-8rem max-w-8rem">
        <template #header>
          <Button icon="pi pi-plus" class="p-button-rounded p-button-text p-button-plain" @click="onRowAdd()" />
        </template>

        <template #body="{ data }">
          <template v-if="!isRowEdit(data)">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-plain" @click="onRowEdit(data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-plain" @click="onRowDelete(data)" />
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
import { FormProject, Project, toLog } from '~~/src/databases/models/Project'

const props = defineProps<{
  visible: boolean,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void,
  (e: 'update:project'): void,
}>()

const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val),
})

const projectService = inject(ProjectServiceKey)

const notify = useNotify()
const confirm = useConfirm()

/// ////////////////////////////////////////

const projects = ref<Partial<Project>[]>([])
const editingRows = ref<Partial<Project>[]>([])

const onInit = () => {
  editingRows.value = []
  projects.value = [...(projectService?.projects.value ?? [])]
}

watch(() => props.visible, (val) => {
  val && onInit()
})

/// ////////////////////////////////////////

const isRowEdit = (project: Project) => {
  return editingRows.value.some(row => row.id === project.id)
}

const onRowAdd = () => {
  // 新規rowがなければ追加
  const hasNewRow = projects.value.some(p => p.id === 0)
  if (!hasNewRow) {
    const newProject = { id: 0 }
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
  try {
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

    // データの置き換え
    await projectService?.fetch()
    onInit()

    // 更新通知
    const method = projectId ? '更新' : '作成'
    notify.success(`${toLog(updProject)}を${method}しました。`)
    emit('update:project')
  } catch (err) {
    notify.thrown(err)
  }
}

const onRowDelete = (project: Project) => {
  confirm.require({
    // eslint-disable-next-line no-irregular-whitespace
    message: `「${project.name}...」\n  のプロジェクトを削除しますか？`,
    header: '削除の確認',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        // delete 処理
        await ProjectAPI.remove(project.id)

        // データの置き換え
        await projectService?.fetch()
        onInit()

        // 更新通知
        notify.success(`${toLog(project)}を削除しました。`)
        emit('update:project')
      } catch (err) {
        notify.thrown(err)
      }
    },
  })
}
</script>
