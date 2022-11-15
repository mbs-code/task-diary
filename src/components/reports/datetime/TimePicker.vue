<template>
  <div class="flex items-center justify-center">
    <div class="flex items-center dropdown-time-picker">
      <div class="flex flex-col">
        <Button class="p-button-text" icon="pi pi-chevron-up" @click="onClickPrevHour" />
        <Dropdown
          v-model="hour"
          :options="hourLabels"
          option-label="label"
          option-value="value"
          class="w-4rem"
          dropdown-icon=""
        />
        <Button class="p-button-text" icon="pi pi-chevron-down" @click="onClickNextHour" />
      </div>

      <div>：</div>

      <div class="flex flex-col">
        <Button class="p-button-text" icon="pi pi-chevron-up" @click="onClickPrevMinute" />
        <Dropdown
          v-model="minute"
          :options="minuteLabels"
          option-label="label"
          option-value="value"
          class="w-4rem"
        />
        <Button class="p-button-text" icon="pi pi-chevron-down" @click="onClickNextMinute" />
      </div>

      <div>：</div>

      <div class="flex flex-col">
        <Button class="p-button-text" icon="pi pi-chevron-up" @click="onClickPrevSecond" />
        <Dropdown
          v-model="second"
          :options="secondLabels"
          option-label="label"
          option-value="value"
          class="w-4rem"
        />
        <Button class="p-button-text" icon="pi pi-chevron-down" @click="onClickNextSecond" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs'

const props = defineProps<{
  modelValue?: Dayjs,
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value?: Dayjs): void,
}>()

const hour = computed({
  get: () => String(props.modelValue?.hour() ?? 0),
  set: (val: string) => {
    const date = (props.modelValue ?? dayjs()).hour(Number(val))
    emit('update:modelValue', date)
  },
})

const minute = computed({
  get: () => String(props.modelValue?.minute() ?? 0),
  set: (val: string) => {
    const date = (props.modelValue ?? dayjs()).minute(Number(val))
    emit('update:modelValue', date)
  },
})

const second = computed({
  get: () => String(props.modelValue?.second() ?? 0),
  set: (val: string) => {
    const date = (props.modelValue ?? dayjs()).second(Number(val))
    emit('update:modelValue', date)
  },
})

///

const hourLabels = computed(() => {
  return [...new Array(24)].map((_, i) => ({ label: String(i).padStart(2, '0'), value: String(i) }))
})

const minuteLabels = computed(() => {
  return [...new Array(60)].map((_, i) => ({ label: String(i).padStart(2, '0'), value: String(i) }))
})

const secondLabels = computed(() => {
  return [...new Array(60)].map((_, i) => ({ label: String(i).padStart(2, '0'), value: String(i) }))
})

///

const onClickPrevHour = () => {
  hour.value = String(Math.min(Number(hour.value) - 1, 23))
}
const onClickNextHour = () => {
  hour.value = String(Math.max(Number(hour.value) + 1, 0))
}

const onClickPrevMinute = () => {
  minute.value = String(Math.min(Number(minute.value) - 1, 59))
}
const onClickNextMinute = () => {
  minute.value = String(Math.max(Number(minute.value) + 1, 0))
}

const onClickPrevSecond = () => {
  second.value = String(Math.min(Number(second.value) - 1, 59))
}
const onClickNextSecond = () => {
  second.value = String(Math.max(Number(second.value) + 1, 0))
}
</script>

<style lang="scss">
.dropdown-time-picker {
  .p-dropdown-label {
    justify-content: center;
  }
  .p-dropdown-trigger {
    display: none;
  }

  .p-button.p-button-icon-only {
    width: inherit;
  }
}
</style>
