<template>
  <div>
    <Button @click="openReportEditDialog">
      asd
    </Button>

    <ReportEditDialog v-model:visible="showReportEditDialog" />
  </div>
</template>

<script setup lang="ts">
const showReportEditDialog = ref<boolean>(true) // false)
const openReportEditDialog = () => {
  showReportEditDialog.value = !showReportEditDialog.value
}
</script>
