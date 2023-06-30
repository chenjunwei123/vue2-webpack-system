export function antiShake (fn, wait, timeid) {
  if (timeid !== null) {
    clearTimeout(timeid)
  }
  timeid = setTimeout(() => {
    fn()
    console.log('防抖只执行了一次哦！')
  }, wait)
  return timeid
}
