# SwipeX.js

![MIT](https://img.shields.io/badge/license-MIT-green) ![SIZE](https://img.shields.io/badge/size-7.04%20kb-blue) ![VERSION](https://img.shields.io/badge/version-0.0.1-green)

Smoothly swiper support horizontal and vertical mode.

> 🎉 support rax framework

<img width="300" src="https://img.alicdn.com/tfs/TB1zpC_MeL2gK0jSZPhXXahvXXa-320-656.gif" alt="swipex demo gif">

[>>>>>>>>>> 「source code 」<<<<<<<<<<](https://github.com/zj1024/swipex/blob/master/demo/index.js)

[>>>>>>>>>> 「demo online 」<<<<<<<<<<](https://swipex.vercel.app/)

## Quick Start

```bash
$ npm install swipex
```

html:

```html
<style>
  .swipex {
    overflow: hidden;
    visibility: hidden;
  }
  .swipex-wrap {
    overflow: hidden;
  }
  .item {
    position: relative;
    float: left;
    width: 100%;
    height: 300px;
    background: #188eee;
  }
</style>

<div id="swipeX" class="swipex">
  <div class="swipex-wrap">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
  </div>
</div>
```

javascript:

```typescript
import swipeX from 'swipeX'

const container = document.getElementById('swipeX')
window.mySwipeX = SwipeX(container)
```

## Usage

Swipex.js is a javascript library, you can custom define className in html

```html
<div id="swipeX" class="swipex">
  <div class="swipex-wrap">
    <!-- this is your business logic  -->
    <div class="item">business logic</div>
  </div>
</div>
```

there is a few styles to your stylesheet

```css
.swipex {
  /* BFC */
  overflow: hidden;
  /* init solve splash screen */
  visibility: hidden;
}
.swipex-wrap {
  /* BFC to solve */
  overflow: hidden;
}
.item {
  position: relative;
  float: left;
}
```

## Docs

### options

| Param           | Description                                  | Type                             | Default value |
| --------------- | -------------------------------------------- | -------------------------------- | ------------- |
| auto            | auto slideshow(milliseconds)                 | number                           | 0             |
| startSlide      | start index position                         | number                           | 0             |
| speed           | transitions speed(milliseconds)              | number                           | 300           |
| continuous      | loop(infinite feel)                          | boolean                          | true          |
| direction       |                                              | horizontal,vertical              | horizontal    |
| stopPropagation |                                              | boolean                          | -             |
| disableScroll   | stop touches on this container               | boolean                          | -             |
| framework       | support [rax framework](https://rax.js.org/) | rax                              | -             |
| swiping         | swiping percentage (0-1)                     | (res: number) => void            | -             |
| callback        | slider change                                | (index: number, element) => void | -             |
| transitionEnd   | slider change (after callback )              | (index: number, element) => void | -             |

### SwipeX.method()

include:

- SwipeX.prev() slide to prev item
- SwipeX.next() slide to next item
- SwipeX.getPos() return current slide index
- SwipeX.getNumSlides() return total slide items
- SwipeX.slide(index: number, speed: number) slide to index item with custom speed (speed: milliseconds)
- SwipeX.disableScrolling(disableScroll: boolean) directly control scrolling (disableScroll: same as the config option )

## contribute

### clone

```bash
$ git clone https://github.com/zj1024/swipex.git
```

### local run

install dependencies

```bash
npm install
```

start

```bash
npm run start

# or you can run start:your-page
npm run start:other
```

## Tips:

1. swipe container use css: position: fixed window.resize will unexpected

2. width or height computed is slide item getBoundingClientRect()
