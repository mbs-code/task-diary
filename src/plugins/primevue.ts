import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Avatar from 'primevue/avatar'
import Card from 'primevue/card'
import Chip from 'primevue/chip'
import Menu from 'primevue/menu'
import ConfirmDialog from 'primevue/confirmdialog'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true })
  nuxtApp.vueApp.use(ConfirmationService)

  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('Textarea', Textarea)
  nuxtApp.vueApp.component('Dropdown', Dropdown)
  nuxtApp.vueApp.component('Avatar', Avatar)
  nuxtApp.vueApp.component('Card', Card)
  nuxtApp.vueApp.component('Chip', Chip)
  nuxtApp.vueApp.component('Menu', Menu)
  nuxtApp.vueApp.component('ConfirmDialog', ConfirmDialog)
})
