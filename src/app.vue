<template>
  <div class="p-8">
    <Button>
      asd
    </Button>

    <pre>{{ reports }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ReportAPI } from '~~/src/apis/ReportAPI'
import { Report } from '~~/src/databases/models/Report'

const reports = ref<Report[]>([])

onMounted(async () => {
  console.log('init')
  const database = useDatabase()
  await database.testSeed()

  reports.value = await ReportAPI.getAll()
})
</script>
