import dayjs from 'dayjs'

export const useDayjs = () => {
  return useNuxtApp().$dayjs as typeof dayjs
}
