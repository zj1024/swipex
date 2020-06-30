import SwipeX from '../src/index'

// swipeX all config
const config = {
  // auto: 3000, // default: 0
  startSlide: 1, // default: 0
  speed: 300, // default: 300
  continuous: true, // can slide loop, default true
  // disableScroll: true, // default : undefined
  stopPropagation: true, // default: undefined
  direction: 'horizontal', // support horizontal and vertical mode, default: 'horizontal'
  callback: (index, element) => {
    console.log('[swipeX config] callback >>> ', 'index', index, 'element', element) // slideIndex, slideElement
  },
  swiping: res => {
    console.log('[swipeX config] swiping res >>>', res) // 0 - 1
  },
  transitionEnd: (index, element) => {
    console.log('[swipeX config] transitionEnd >>>', 'index', index, 'element', element) // slideIndex, slideElement
  },
  // framework: 'rax', // use in rax framework, default: undefined
}

// init
const container = document.getElementById('swipeX')
window.mySwipeX = SwipeX(container, config)

console.log('[swipeX methods] >>> ', window.mySwipeX)

// Toggle btn function
const Toggle = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
}
const toggleBtn = document.querySelector('#toggle')

toggleBtn.addEventListener('click', () => {
  window.mySwipeX.kill()

  const isVertical = !!toggleBtn.innerText.match(Toggle.VERTICAL)

  window.mySwipeX = SwipeX(container, {
    ...config,
    direction: isVertical ? Toggle.HORIZONTAL : Toggle.VERTICAL,
  })

  if (isVertical) {
    toggleBtn.innerText = Toggle.HORIZONTAL
  } else {
    toggleBtn.innerText = Toggle.VERTICAL
  }
})
