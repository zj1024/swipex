# SwipeX

![MIT](https://img.shields.io/badge/license-MIT-green) ![SIZE](https://img.shields.io/badge/size-7.04%20kb-blue) ![VERSION](https://img.shields.io/badge/version-0.0.1-green)

Smoothly swiper support horizontal and vertical mode.

> 🎉 support rax framework

<img width="300" src="https://img.alicdn.com/tfs/TB1zpC_MeL2gK0jSZPhXXahvXXa-320-656.gif" alt="swipex demo gif">

### [>>>>>>>>>> 「source code 」<<<<<<<<<<](https://github.com/zj1024/swipex/blob/master/demo/index.js)

### [>>>>>>>>>> 「demo online 」<<<<<<<<<<](https://swipex.vercel.app/)

## Get start

```bash
$ npm install swipex
```

```html
<style>
  html,
  body {
    margin: 0;
    width: 100%;
    height: 100%;
  }
  /* swipe-plus css */
  .swipe {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    visibility: hidden;
  }
  .swipe-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background: #f58390;
  }
  .swipe-wrap > div {
    width: 100%;
    height: 100%;
    float: left;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .swipe-wrap .item {
    background: #188eee;
    color: #fff;
  }
  .swipe-wrap .item:nth-child(2n) {
    background: pink;
    color: #fff;
  }
  /* functional css */
  .pagination {
    position: fixed;
    left: 0;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .pagination button {
    padding: 8px 15px;
  }
</style>

<div id="swipeX" class="swipe">
  <div class="swipe-wrap">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
  </div>
</div>
<section class="pagination">
  <button id="prev">prev</button>
  <button id="next">next</button>
</section>
```

```typescript
import swipeX from 'swipeX'

// init
const container = document.getElementById('swipeX')

window.mySwipeX = SwipeX(container, {
  // auto: 3000, // default: 0
  startSlide: 0, // default: 0
  speed: 300, // default: 300
  continuous: true, // can slide loop, default true
  // disableScroll: true, // default : undefined
  stopPropagation: true, // default: undefined
  direction: 'horizontal', // support horizontal and vertical mode, default: 'horizontal'
  swiping: res => {},
  callback: (index, element) => {},
  transitionEnd: (index, element) => {},
  // framework: 'rax', // use in rax framework, default: undefined
})

const prev = document.querySelector('#prev')
const next = document.querySelector('#next')

prev.addEventListener('click', () => {
  mySwipeX.prev()
})

next.addEventListener('click', () => {
  mySwipeX.next()
})
```

## DOCS



## build

swipex build

```
npm run build
```

docs build

```
npm run build:docs
```

Tips:

1. swipe container use css: position: fixed window.resize will unexpected

2. width or height computed is slide item getBoundingClientRect()
