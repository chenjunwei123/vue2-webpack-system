export function throttle (fn, wait) {
  // 这里利用闭包保存定时器
  let timer = null
  return function () {
    if (timer) return
    timer = setTimeout(() => {
      fn()
      timer = null
      console.log('只节流一次')
      // 无法删除定时器标识
      // clearTimeout(timer)
    }, wait)
  }
}
