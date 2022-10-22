<template>
  <div class="p-8">
    <Button>
      asd
    </Button>
    <!-- <NuxtWelcome /> -->
  </div>
</template>

<script setup lang="ts">
import { ProjectAPI } from '~~/src/apis/ProjectAPI'
import { StatusAPI } from '~~/src/apis/StatusAPI'
import { Database } from '~~/src/databases/Database'

onMounted(async () => {
  console.log('init')
  const { migrator } = Database.getInstance()
  await Database.dbWipe()
  await migrator.migrateToLatest()

  const p1 = await ProjectAPI.create({
    name: '案件A',
    color: '#96245c',
    icon: 'A',
  })
  const p2 = await ProjectAPI.create({
    name: '案件B',
    color: '#168d6a',
    icon: 'B',
  })
  const p3 = await ProjectAPI.create({
    name: 'ZXC案件',
  })
  const p4 = await ProjectAPI.create({
    name: 'Tips',
  })

  const projects = await ProjectAPI.getAll({
    sorts: [['created_at', 'desc']],
    page: 2,
    limit: 2,
  })
  console.log(projects)

  const s1 = await StatusAPI.create({
    name: '重要',
    color: '#dc3545',
  })
  const s2 = await StatusAPI.create({
    name: '待ち',
    color: '#8dd0ff',
  })
  const s3 = await StatusAPI.create({
    name: '保留',
    color: '#fec89a',
  })
  const statuses = await StatusAPI.getAll({
    sorts: [['created_at', 'desc']],
    page: 2,
    limit: 2,
  })
  console.log(statuses)
  console.log(await StatusAPI.count({
    sorts: [['created_at', 'desc']],
    page: 2,
    limit: 2,
  }))
})
</script>
