import SwipeX from '../src/index'

// init
const container = document.getElementById('swipeX')
window.mySwipeX = SwipeX(container, {
  debounce: true,
})
console.log(mySwipeX)
