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
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import ConfirmDialog from 'primevue/confirmdialog'
import Calendar from 'primevue/calendar'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

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
  nuxtApp.vueApp.component('Accordion', Accordion)
  nuxtApp.vueApp.component('AccordionTab', AccordionTab)
  nuxtApp.vueApp.component('ConfirmDialog', ConfirmDialog)
  nuxtApp.vueApp.component('Calendar', Calendar)
  nuxtApp.vueApp.component('Splitter', Splitter)
  nuxtApp.vueApp.component('SplitterPanel', SplitterPanel)
})
