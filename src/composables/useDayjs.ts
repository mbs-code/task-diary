import dayjs from 'dayjs'

export { weekdaysShort } from 'dayjs/locale/ja'

export const useDayjs = () => {
  return useNuxtApp().$dayjs as typeof dayjs
}
