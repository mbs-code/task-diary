import { useToast } from 'primevue/usetoast'

export const useNotify = () => {
  const toast = useToast()

  const success = (message: string, title?: string) => {
    toast.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000,
      group: 'br',
    })
  }

  const info = (message: string, title?: string) => {
    toast.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: 3000,
    })
  }

  const warn = (message: string, title?: string) => {
    toast.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: 5000,
    })
  }

  const error = (message: string, title?: string) => {
    toast.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 10000,
    })
  }

  const thrown = (err: unknown) => {
    error(err?.toString() ?? '不明なエラーが発生しました。')

    // eslint-disable-next-line no-console
    console.error(err)
  }

  return {
    success,
    info,
    warn,
    error,
    thrown,
  }
}
