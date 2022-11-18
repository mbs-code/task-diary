<template>
  <div class="flex flex-col gap-1">
    <div class="flex gap-1">
      <Button class="p-button-text p-button-plain" label="<" @click="onClickPrevMonth" />
      <Button class="p-button-text p-button-plain w-12.25rem" :label="monthLabel" @click="onClickToday" />
      <Button class="p-button-text p-button-plain" label=">" @click="onClickNextMonth" />
    </div>

    <div class="flex gap-1">
      <div
        v-for="(week, _) of weekHeaders"
        :key="_"
        class="w-2.25rem h-1.5rem !p-0 text-center"
      >
        {{ week }}
      </div>
    </div>

    <div v-for="(weekItem, _) of monthItem" :key="_" class="flex gap-1">
      <Button
        v-for="(dateItem, __) of weekItem"
        :key="`${_}-${__}`"
        class="w-2.25rem h-2.25rem !p-0"
        v-bind="dateItem.bind"
        :label="dateItem.label"
        @click="onClickDay(dateItem)"
      />
    </div>
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

type DateItem = {
  date: Dayjs,
  label: string,
  // day: number,
  bind: { [key: string]: unknown },
  // hasBadge: boolean,
}

///

const dayjs = useDayjs()

const targetDate = ref<Dayjs>(dayjs()) // 表示している月の開始日
const startWod = ref<0 | 2 | 3 | 1 | 4 | 5 | 6>(0) // 週の開始曜日

watch(() => props.modelValue, () => {
  targetDate.value = (props.modelValue?.startOf('month') ?? dayjs()).startOf('month')
}, { immediate: true })

const startDate = computed(() => {
  // 左上の日を算出
  const targetWod = targetDate.value.day() // 曜日
  let add = targetWod - startWod.value // 基準曜日への加算日数
  if (add > 0) { add = add - 7 } // 曜日またぎ修正

  // 算出
  let start = targetDate.value.clone().add(add, 'day')

  // 終了日が 8日以降になる場合は一週間早める
  const end = start.add(7 * 6 - 1, 'day')
  if (end.date() >= 8) {
    start = start.add(-7, 'day')
  }

  return start
})

const monthLabel = computed(() => {
  const date = targetDate.value
  return `${date.year()}年${date.month() + 1}月`
})

const monthItem = computed(() => {
  // 左上ポインタ
  let ptr = startDate.value

  // 週 x 曜日 で回してカレンダーを生成
  const now = dayjs()
  const monthDates: DateItem[][] = []
  for (let w = 0; w < 6; w++) {
    const weekDates: DateItem[] = []
    for (let d = 0; d < 7; d++) {
      const classAry: string[] = []

      // 文字色
      if (ptr.isSame(targetDate.value, 'months')) {
        if (ptr.isSame(now, 'date')) {
          // 表示月で当日なら 青
          classAry.push('p-button-primary')
        } else {
          // 表示月で当日でないなら ホワイト
          classAry.push('p-button-plain')
        }
      } else {
        // 表示月でないなら グレー
        classAry.push('p-button-secondary')
      }

      // 背景色
      if (props.modelValue && ptr.isSame(props.modelValue, 'date')) {
        // 選択中なら 背景あり
      } else {
        // それ以外なら 背景なし
        classAry.push('p-button-text')
      }

      weekDates.push({
        date: ptr.clone(),
        label: String(ptr.date()),
        bind: {
          class: classAry,
        },
      })

      // 一日進める
      ptr = ptr.add(1, 'day')
    }
    monthDates.push(weekDates)
  }

  return monthDates
})

const weekHeaders = computed(() => {
  const weekdayMap = dayjs.Ls.ja.weekdaysShort

  return [...new Array(7)]
    .map((_, i) => {
      let idx = i - startWod.value
      if (idx < 0) { idx = 7 + idx }
      return idx
    })
    .map(i => weekdayMap?.at(i))
})

///

const onClickDay = (item: DateItem) => {
  const date = (props.modelValue ?? dayjs())
    .year(item.date.year())
    .month(item.date.month())
    .date(item.date.date())
  emit('update:modelValue', date)
}

const onClickToday = () => {
  emit('update:modelValue', dayjs())
}

const onClickPrevMonth = () => {
  targetDate.value = targetDate.value.add(-1, 'month').startOf('month')
}

const onClickNextMonth = () => {
  targetDate.value = targetDate.value.add(1, 'month').startOf('month')
}
</script>
