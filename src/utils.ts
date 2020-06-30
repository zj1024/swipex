// offload a functions execution
export function offloadFn(fn: any) {
  setTimeout(fn || function () {}, 0)
}

export function checkBrowser() {
  return {
    addEventListener: !!window.addEventListener,
    touch: 'ontouchstart' in window,
    transitions: document.body.style.transition !== undefined,
  }
}

// compatibility with rax framework
export function px2vw(px: number, clientWidth: number) {
  return `${(px * 100) / clientWidth}vw`
}

export function throttle(method: any, wait: number, { leading = true, trailing = true } = {}) {
  let timeout: any
  let result: any
  let methodPrevious = 0
  let throttledPrevious = 0
  let throttled = function (this: any, ...args: any) {
    let context = this
    return new Promise(resolve => {
      let now = new Date().getTime()
      let interval = now - throttledPrevious
      throttledPrevious = now
      if (leading === false && (!methodPrevious || interval > wait)) {
        methodPrevious = now
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
      }
      let remaining = wait - (now - methodPrevious)
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        methodPrevious = now
        result = method.apply(context, args)
        resolve(result)
        if (!timeout) context = args = null
      } else if (!timeout && trailing !== false) {
        timeout = setTimeout(() => {
          methodPrevious = leading === false ? 0 : new Date().getTime()
          timeout = null
          result = method.apply(context, args)
          resolve(result)
          if (!timeout) context = args = null
        }, remaining)
      }
    })
  }

  return throttled
}
