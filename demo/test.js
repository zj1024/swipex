import SwipeX from '../src/index'

let lastIndex = null

// init
const container = document.getElementById('swipeX')
window.mySwipeX = SwipeX(container, {
  debounce: true,
  direction: 'vertical',
  transitionEnd: index => {
    if (index === 3) {
      lastIndex = mySwipeX.getPos()
      window.mySwipeX.kill()
      console.log('kill')
      window.mySwipeX = SwipeX(container, {
        debounce: true,
        direction: 'vertical',
        continuous: false,
      })
      mySwipeX.slide(lastIndex, 0)
    }
  },
})
console.log(mySwipeX)
