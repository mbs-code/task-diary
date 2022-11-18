<template>
  <div @click="openCalendarOverlay">
    <span class="w-full p-input-icon-left p-input-icon-right">
      <i class="pi pi-calendar" />

      <InputText
        type="text"
        class="w-full"
        :value="showValue"
        readonly
        placeholder="時刻"
      />

      <i
        v-if="showValue"
        class="pi pi-times cursor-pointer"
        @click="onDelete"
      />
    </span>

    <OverlayPanel
      ref="overlayRef"
      append-to="body"
      :show-close-icon="true"
    >
      <div class="flex">
        <DatePicker v-model="_value" class="w-full" />
        <Divider layout="vertical" />
        <TimePicker v-model="_value" class="w-full" />
      </div>
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
const openCalendarOverlay = (event: MouseEvent) => {
  overlayRef.value.toggle(event)
}
</script>
