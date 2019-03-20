export function consumeList ({
  interval,
  list,
  onItem,
  onFinish,
  immediate = true
}) {
  if (list.length === 0) return onFinish()
  if (immediate) {
    onItem(list.shift())
    if (list.length === 0) return onFinish()
  }
  const timer = setInterval(() => {
    onItem(list.shift())
    if (list.length === 0) {
      clearInterval(timer)
      onFinish()
    }
  }, interval)
}
