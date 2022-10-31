import { InjectionKey } from 'nuxt/dist/app/compat/capi'
import { ProjectAPI } from '~~/src/apis/ProjectAPI'
import { Project } from '~~/src/databases/models/Project'

export const useProjectService = () => {
  const projects = ref<Project[]>([])

  const fetch = async () => {
    projects.value = await ProjectAPI.getAll({
      sorts: [['id', 'asc']],
    })
  }

  onMounted(async () => {
    await fetch()
  })

  return {
    projects,

    fetch,
  }
}

export const ProjectServiceKey:
  InjectionKey<ReturnType<typeof useProjectService>> =
  Symbol('useProjectService')
