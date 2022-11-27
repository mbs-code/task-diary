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
      <template v-for="(dateItem, __) of weekItem" :key="`${_}-${__}`">
        <Button
          class="w-2.25rem !p-0"
          :class="hasEvent ? 'h-3rem' : 'h-2.25rem'"
          v-bind="dateItem.bind"
          @click="onClickDay(dateItem)"
        >
          <div class="flex flex-col w-full self-start">
            <div>{{ dateItem.label }}</div>

            <div>
              <Badge
                v-if="dateItem.count > 0"
                class="!px-1 !m-0"
                severity="info"
                :value="dateItem.count"
              />
            </div>
          </div>
        </Button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Dayjs } from 'dayjs'

const props = defineProps<{
  modelValue?: Dayjs,
  events?: { date: Dayjs, count: number }[],
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value?: Dayjs): void,
  (e: 'change:range', start?: Dayjs, end?: Dayjs): void,
}>()

type DateItem = {
  date: Dayjs,
  label: string,
  bind: { [key: string]: unknown },
  count: number,
}

///

const dayjs = useDayjs()

const targetDate = ref<Dayjs>(dayjs()) // 表示している月の開始日
const startWod = ref<0 | 2 | 3 | 1 | 4 | 5 | 6>(0) // 週の開始曜日

watch(() => props.modelValue, () => {
  targetDate.value = (props.modelValue?.startOf('month') ?? dayjs()).startOf('month')
}, { immediate: true })

const hasEvent = computed(() => props.events !== undefined)

const startDate = computed(() => {
  // 左上の日を算出
  const targetWod = targetDate.value.day() // 曜日
  let delta = targetWod - startWod.value // 基準曜日への加算日数
  if (delta > 0) { delta = delta - 7 } // 曜日またぎ修正

  // 算出
  let start = targetDate.value.clone().subtract(delta, 'day')

  // 終了日が 8日以降になる場合は一週間早める
  let end = start.add(7 * 6 - 1, 'day')
  if (end.date() >= 8) {
    start = start.add(-7, 'day')
    end = end.add(-7, 'day')
  }

  emit('change:range', start.clone(), end.clone())
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

      // イベント
      const count = (props.events ?? [])
        .find(e => e.date.isSame(ptr, 'date'))?.count

      weekDates.push({
        date: ptr.clone(),
        label: String(ptr.date()),
        bind: { class: classAry },
        count: count ?? 0,
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
  targetDate.value = dayjs().startOf('month')
  emit('update:modelValue', dayjs())
}

const onClickPrevMonth = () => {
  targetDate.value = targetDate.value.add(-1, 'month').startOf('month')
}

const onClickNextMonth = () => {
  targetDate.value = targetDate.value.add(1, 'month').startOf('month')
}
</script>
