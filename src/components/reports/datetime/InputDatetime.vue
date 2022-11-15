<template>
  <div>
    <span class="p-input-icon-right">
      <InputText type="text" :value="showValue" readonly @click="openCalendarDialog" />
      <i
        v-if="showValue"
        class="pi pi-times cursor-pointer"
        @click="onDelete"
      />
    </span>

    <OverlayPanel
      id="overlay_panel"
      ref="overlayRef"
      append-to="body"
      :show-close-icon="true"
      style="width: 450px"
      :breakpoints="{'960px': '75vw'}"
    >
      <DatePicker v-model="_value" />
    </OverlayPanel>
  </div>
</template>

<script setup lang="ts">
import { Dayjs } from 'dayjs'

const props = defineProps<{
  modelValue?: Dayjs,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value?: Dayjs): void,
}>()

const _value = computed({
  get: () => props.modelValue,
  set: (value?: Dayjs) => emit('update:modelValue', value),
})

const showValue = computed(() => {
  return _value.value?.format('YYYY-MM-DD HH:mm:ss')
})

const onDelete = () => emit('update:modelValue', undefined)

///

const overlayRef = ref()
const openCalendarDialog = (event: MouseEvent) => {
  overlayRef.value.toggle(event)
}
</script>
