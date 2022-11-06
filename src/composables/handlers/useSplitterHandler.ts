import { Ref } from 'nuxt/dist/app/compat/capi'
import { SplitterResizeEndEvent } from 'primevue/splitter'

export const useSplitterHandler = (splitterRef: Ref) => {
  const counter = ref<number>(0)
  const timer = ref<NodeJS.Timer>()

  const blocker = ref<boolean>(false)

  const _invoke = () => {
    // ダブルクリック時、splitpanel を移動させるイベント

    try {
      blocker.value = true

      const screenW = document.documentElement.clientWidth
      const gutterSize = splitterRef.value.gutterSize ?? 0

      const gutter = splitterRef.value.$el.querySelector('.p-splitter-gutter')
      const { x } = gutter.getBoundingClientRect()

      const afterX = (x / screenW >= 0.9)
        ? screenW * 0.6 - (gutterSize / 2) // 6:4
        : screenW // 10:0
      gutter.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: 1 }))
      gutter.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: afterX, clientY: 1 }))
      gutter.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: afterX, clientY: 1 }))
    } finally {
      blocker.value = false
    }
  }

  ///

  const resizeend = (_event: SplitterResizeEndEvent) => {
    // _invoke() 実行用ブロッカー
    if (blocker.value) { return }

    // クリックカウンター
    counter.value++

    // ダブルクリックを超えていたら、実行してリセット
    if (counter.value >= 2) {
      _invoke()
      _clearTimer()
      return
    }

    // 一度でもクリックしたら、待機モードへ
    _createTimer()
  }

  const _createTimer = () => {
    timer.value && clearTimeout(timer.value)
    timer.value = setInterval(() => {
      _clearTimer()
    }, 500)
  }

  const _clearTimer = () => {
    counter.value = 0
    timer.value && clearTimeout(timer.value)
  }

  return {
    resizeend,
  }
}
