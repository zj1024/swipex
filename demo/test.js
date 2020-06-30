import SwipeX from '../src/index'

// swipeX all config
const config = {
  // auto: 3000, // default: 0
  startSlide: 0, // default: 0
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

const prev = document.querySelector('#prev')
const next = document.querySelector('#next')

prev.addEventListener('click', () => {
  mySwipeX.prev()
})

next.addEventListener('click', () => {
  mySwipeX.next()
})
