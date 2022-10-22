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
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { StatusAPI } from '~~/src/apis/StatusAPI'

onMounted(async () => {
  console.log('init')
  const database = useDatabase()
  await database.dbWipe()

  const dayjs = useDayjs()

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

  const r1 = await ReportAPI.create({
    text: '本文',
    projectId: p1.id,
    statusId: s1.id,
    isFavotite: true,
    startAt: dayjs('2022-10-20 10:01:00'),
  })

  const reports = await ReportAPI.getAll({
    sorts: [['created_at', 'desc']],
    page: 1,
    limit: 2,
  })
  console.log(reports)
})
</script>
