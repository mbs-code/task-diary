/* eslint-disable import/no-named-as-default-member */
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/ja'

export default defineNuxtPlugin((nuxtApp) => {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Tokyo')
  dayjs.locale('ja')

  nuxtApp.provide('dayjs', dayjs)
})
