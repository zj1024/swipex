import { EDirection, EBox, EOffset, EPosition, EFramework } from './common/enum'
import { offloadFn, checkBrowser, px2vw } from './utils'

interface IOptions {
  auto?: number | undefined
  startSlide?: number
  speed?: number
  widthOfSiblingSlidePreview?: number
  continuous?: boolean
  disableScroll?: boolean
  stopPropagation?: boolean
  direction?: EDirection
  swiping?: (res: number) => void
  callback?: (index: number, element: Element) => void
  transitionEnd?: (index: number, element: Element) => void
  framework?: 'rax'
}

const SwipeX = (container: HTMLElement, defaultOptions: IOptions = {}) => {
  if (!container) {
    throw new Error('Target container is not a DOM element')
  }

  // support rax framework
  let isRax = false
  if (defaultOptions.framework === EFramework.RAX) {
    isRax = true
  }

  // 检查浏览器能力
  const browser = checkBrowser()
  const options = { ...defaultOptions } || {}
  const element = <HTMLElement>container.children[0] // 包裹的元素 item-wrapper
  const { speed = 300, widthOfSiblingSlidePreview = 0, auto = 0 } = options
  const isVertical = options.direction === EDirection.VERTICAL

  /**
   * slides 所有滚动元素
   * slidePos 所有滚动元素对应位置
   * distance 距离
   * index 当前下标
   * continuous 相当于loop
   */
  let slides: HTMLCollection
  let slidePos: number[]
  let distance: number
  let index = options.startSlide || 0
  let continuous: boolean = (options.continuous = defaultOptions.continuous || true)
  // setup auto slideshow
  let delay = auto || 0
  let interval: NodeJS.Timeout

  let setDistance: (value: number) => string

  // 设置全局的常量用来区分方向相关值
  const DIRECTION_BOX: EBox = isVertical ? EBox.HEIGHT : EBox.WIDTH
  const DIRECTION_OFFSET: EOffset = isVertical ? EOffset.OFFSET_HEIGHT : EOffset.OFFSET_WIDTH
  const DIRECTION_POSITION: EPosition = isVertical ? EPosition.TOP : EPosition.LEFT

  function setup() {
    // 判断rax环境设置距离
    let clientWidth = document.documentElement.getBoundingClientRect().width
    setDistance = (value: number) => (isRax ? px2vw(value, clientWidth) : `${value}px`)

    // 每次重新setup设置初始值
    slides = element.children
    slidePos = new Array(slides.length)
    distance =
      Math.round(container.getBoundingClientRect()[DIRECTION_BOX] || container[DIRECTION_OFFSET]) -
      widthOfSiblingSlidePreview * 2
    // 如果元素小于3个，强行不能loop
    continuous = slides.length < 3 ? false : (options.continuous as boolean)
    element.style[DIRECTION_BOX] = setDistance(slides.length * distance)

    // stack elements
    let pos = slides.length

    while (pos--) {
      const slide = <HTMLElement>slides[pos]
      slide.style[DIRECTION_BOX] = setDistance(distance)
      slide.style[isVertical ? 'width' : 'height'] = '100%'
      slide.setAttribute('data-index', `${pos}`)

      if (browser.transitions) {
        // 元素设置位置
        slide.style[DIRECTION_POSITION] = setDistance(pos * -distance + widthOfSiblingSlidePreview)
        let dist = 0
        if (index > pos) {
          dist = -distance
        } else {
          if (index < pos) {
            dist = distance
          } else {
            dist = 0
          }
        }

        move(pos, dist, 0)
      }
    }

    // reposition elements before and after index
    if (continuous && browser.transitions) {
      move(circle(index - 1), -distance, 0)
      move(circle(index + 1), distance, 0)
    }

    if (!browser.transitions) {
      element.style[DIRECTION_POSITION] = setDistance(
        index * -distance + widthOfSiblingSlidePreview,
      )
    }
    container.style.visibility = 'visible'
  }

  function prev() {
    if (continuous) {
      slide(index - 1)
    } else if (index) {
      slide(index - 1)
    }
  }

  function next() {
    if (continuous) {
      slide(index + 1)
    } else if (index < slides.length - 1) {
      slide(index + 1)
    }
  }

  function circle(index: number) {
    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length
  }

  function slide(to: number, slideSpeed?: number) {
    // do nothing if already on requested slide
    if (index == to) return

    if (browser.transitions) {
      let direction = Math.abs(index - to) / (index - to) // 1: backward, -1: forward

      // get the actual position of the slide
      if (continuous) {
        const natural_direction = direction
        direction = -slidePos[circle(to)] / distance

        // if going forward but to < index, use to = slides.length + to
        // if going backward but to > index, use to = -slides.length + to
        if (direction !== natural_direction) to = -direction * slides.length + to
      }

      let diff = Math.abs(index - to) - 1

      // move all the slides between index and to in the right direction
      while (diff--) move(circle((to > index ? to : index) - diff - 1), distance * direction, 0)

      to = circle(to)

      move(index, distance * direction, slideSpeed || speed)
      move(to, 0, slideSpeed || speed)

      if (continuous) move(circle(to - direction), -(distance * direction), 0) // we need to get the next in place
    } else {
      to = circle(to)
      animate(index * -distance, to * -distance, slideSpeed || speed)
    }

    index = to

    offloadFn(options.callback && options.callback(index, slides[index]))
  }

  function move(index: number, dist: number, speed: number) {
    translate(index, dist, speed)
    slidePos[index] = dist
  }

  function translate(index: number, dist: number, speed: number) {
    const slide = slides[index]
    const style = slide && (slide as HTMLElement).style

    if (!style) return

    style.transitionDuration = speed + 'ms'

    const translateValue = isVertical ? `0, ${setDistance(dist)}, 0` : `${setDistance(dist)}, 0, 0`
    style.transform = `translate3d(${translateValue})`
  }

  function animate(from: number, to: number, speed: number | undefined) {
    // if not an animation, just reposition
    if (!speed) {
      element.style[DIRECTION_POSITION] = setDistance(to)
      return
    }

    let startTime = Number(new Date())

    let timer = setInterval(function () {
      let timeElap = Number(new Date()) - startTime

      if (timeElap > speed) {
        element.style[DIRECTION_POSITION] = `${to}px`

        if (delay) begin()

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index])

        clearInterval(timer)
        return
      }

      element.style[DIRECTION_POSITION] = setDistance(
        (to - from) * (Math.floor((timeElap / speed) * 100) / 100) + from,
      )
    }, 0)
  }

  function begin() {
    clearTimeout(interval)
    interval = setTimeout(next, delay)
  }

  function stop() {
    delay = auto || 0
    clearTimeout(interval)
  }

  // setup initial vars
  let start: { x: number; y: number; time?: number }
  let delta: { x: number; y: number }
  let isScrolling: boolean | undefined

  // setup event capturing
  const events = {
    handleEvent: function (event: Event & TouchEvent) {
      switch (event.type) {
        case 'touchstart':
          this.start(event)
          break
        case 'touchmove':
          this.move(event)
          break
        case 'touchend':
          offloadFn(this.end())
          break
        case 'transitionend':
          offloadFn(this.transitionEnd(event))
          break
        case 'resize':
          offloadFn(setup)
          break
      }

      options.stopPropagation && event.stopPropagation()
    },

    start: function (event: TouchEvent) {
      // 触摸相关数据
      const touches = event.touches[0]

      // measure start values
      start = {
        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date(),
      }

      // used for testing first move event
      isScrolling = undefined

      // reset delta and end measurements
      delta = {} as any

      // attach touchmove and touchend listeners
      element.addEventListener('touchmove', this, {
        capture: false,
        passive: true,
      })
      element.addEventListener('touchend', this, {
        capture: false,
        passive: true,
      })
    },

    move: function (event: TouchEvent) {
      // ensure swiping with one touch and not pinching
      if (event.touches.length > 1) return

      if (options.disableScroll) return

      const touches = event.touches[0]

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y,
      }

      // determine if scrolling test has run - one time test
      if (typeof isScrolling == 'undefined') {
        if (isVertical) {
          isScrolling = !!(isScrolling || Math.abs(delta.y) < Math.abs(delta.x))
        } else {
          isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y))
        }
      }

      // if user is not trying to scroll vertically
      // 如果用户想要横向 || 纵向滑动
      if (!isScrolling) {
        // prevent native scrolling
        // event.preventDefault()

        // stop slideshow
        stop()

        // increase resistance if first or last slide
        const deltaValue = isVertical ? delta.y : delta.x

        if (continuous) {
          // we don't add resistance at the end
          translate(circle(index - 1), deltaValue + slidePos[circle(index - 1)], 0)
          translate(index, deltaValue + slidePos[index], 0)
          translate(circle(index + 1), deltaValue + slidePos[circle(index + 1)], 0)
        } else {
          // 没有loop情况下滑动
          if (isVertical) {
            delta.y =
              deltaValue /
              ((!index && deltaValue > 0) || // if first slide and sliding left
              (index == slides.length - 1 && // or if last slide and sliding right
                deltaValue < 0) // and if sliding at all
                ? Math.abs(deltaValue) / distance + 1 // determine resistance level
                : 1) // no resistance if false
          } else {
            delta.x =
              deltaValue /
              ((!index && deltaValue > 0) || // if first slide and sliding left
              (index == slides.length - 1 && // or if last slide and sliding right
                deltaValue < 0) // and if sliding at all
                ? Math.abs(deltaValue) / distance + 1 // determine resistance level
                : 1) // no resistance if false
          }

          // translate 1:1
          translate(index - 1, deltaValue + slidePos[index - 1], 0)
          translate(index, deltaValue + slidePos[index], 0)
          translate(index + 1, deltaValue + slidePos[index + 1], 0)
        }
        options.swiping && options.swiping(-deltaValue / distance)
      }
    },
    end: function () {
      const deltaValue = isVertical ? delta.y : delta.x
      // measure duration
      let duration = Number(new Date()) - (start.time as number)

      // FIXME: width / 2 now I use 3 to test
      // 用来检测是否可滑动
      // determine if slide attempt triggers next/prev slide
      let isValidSlide =
        (duration < 250 && // if slide duration is less than 250ms
          Math.abs(deltaValue) > 20) || // and if slide amt is greater than 20px
        Math.abs(deltaValue) > distance / 3 // or if slide amt is greater than half the width

      // determine if slide attempt is past start and end

      // 为了检测是否跳跃滑动
      let isPastBounds =
        (!index && deltaValue > 0) || // if first slide and slide amt is greater than 0
        (index == slides.length - 1 && deltaValue < 0) // or if last slide and slide amt is less than 0

      if (continuous) isPastBounds = false

      // determine direction of swipe (true:right, false:left)
      let direction = deltaValue < 0

      // if not scrolling vertically
      if (!isScrolling) {
        if (isValidSlide && !isPastBounds) {
          // 正向滑动
          if (direction) {
            if (continuous) {
              // we need to get the next in this direction in place

              move(circle(index - 1), -distance, 0)
              move(circle(index + 2), distance, 0)
            } else {
              move(index - 1, -distance, 0)
            }

            move(index, slidePos[index] - distance, speed)
            move(circle(index + 1), slidePos[circle(index + 1)] - distance, speed)
            index = circle(index + 1)
          } else {
            // 反向滑动
            if (continuous) {
              // we need to get the next in this direction in place

              move(circle(index + 1), distance, 0)
              move(circle(index - 2), -distance, 0)
            } else {
              move(index + 1, distance, 0)
            }

            move(index, slidePos[index] + distance, speed)
            move(circle(index - 1), slidePos[circle(index - 1)] + distance, speed)
            index = circle(index - 1)
          }

          options.callback && options.callback(index, slides[index])
        } else {
          if (continuous) {
            move(circle(index - 1), -distance, speed)
            move(index, 0, speed)
            move(circle(index + 1), distance, speed)
          } else {
            move(index - 1, -distance, speed)
            move(index, 0, speed)
            move(index + 1, distance, speed)
          }
        }
      }

      // kill touchmove and touchend event listeners until touchstart called again
      element.removeEventListener('touchmove', events, false)
      element.removeEventListener('touchend', events, false)
      element.removeEventListener('touchforcechange', function () {}, false)
    },

    transitionEnd: function (event: Event) {
      if (parseInt((event as any).target.getAttribute('data-index'), 10) === index) {
        if (delay) begin()

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index])
      }
    },
  }

  // trigger setup
  setup()

  // start auto slideshow if applicable
  if (delay) begin()

  // add event listeners
  if (browser.addEventListener) {
    // set touchstart event on element
    if (browser.touch) {
      element.addEventListener('touchstart', events, {
        passive: true,
      })
      element.addEventListener('touchforcechange', function () {}, false)
    }

    if (browser.transitions) {
      element.addEventListener('transitionend', events, false)
    }

    // set resize event on window
    window.addEventListener('resize', events, false)
  } else {
    window.onresize = function () {
      setup()
    } // to play nice with old IE
  }

  // expose the Swipe API
  return {
    setup: function () {
      setup()
    },
    slide: function (to: number, speed: number) {
      // cancel slideshow
      stop()
      slide(to, speed)
    },
    prev: function () {
      // cancel slideshow
      stop()
      prev()
    },
    next: function () {
      // cancel slideshow
      stop()
      next()
    },
    stop: function () {
      // cancel slideshow
      stop()
    },
    getPos: function () {
      // return current index position
      return index
    },
    getNumSlides: function () {
      // return total number of slides
      return slides.length
    },
    kill: function () {
      // cancel slideshow
      stop()
      element.style[DIRECTION_BOX] = ''
      element.style[DIRECTION_POSITION] = ''

      // reset slides
      let pos = slides.length
      while (pos--) {
        const slide = <HTMLElement>slides[pos]
        slide.style[DIRECTION_BOX] = ''
        slide.style[DIRECTION_POSITION] = ''

        if (browser.transitions) translate(pos, 0, 0)
      }

      // removed event listeners
      if (browser.addEventListener) {
        // remove current event listeners
        element.removeEventListener('touchstart', events, false)
        element.removeEventListener('transitionend', events, false)
        window.removeEventListener('resize', events, false)
      } else {
        window.onresize = null
      }
    },
  }
}

export default SwipeX
