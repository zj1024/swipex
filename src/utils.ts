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
