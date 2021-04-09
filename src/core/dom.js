class Dom {
  constructor(selector) {
    // this.$$listeners = {}
    this.$el = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector
  }

  html(html) {
    if (typeof html === 'string') {
      this.$el.innerHTML = html
      return this
    }
    return this.$el.outerHTML.trim()
  }

  text(text) {
    if (typeof text === 'string') {
      this.$el.textContent = text
      return this
    }
    if (this.$el.tagName.toLowerCase() === 'input') {
      return this.$el.value.trim()
    }
    return this.$el.textContent.trim()
  }

  clear() {
    this.html('')
    return this
  }

  on(eventType, callback) {
    // this.$$listeners[eventType] = callback
    this.$el.addEventListener(eventType, callback)
  }

  off(eventType, callback) {
    this.$el.removeEventListener(eventType, callback)
  }

  find(selector) {
    return $(this.$el.querySelector(selector))
  }

  append(node) {
    // console.log(node)
    if (node instanceof Dom) {
      node = node.$el
    }
    if (Element.prototype.append) {
      this.$el.append(node)
    } else {
      this.$el.appendChild(node)
    }
    return this
    // console.log(node)
    // console.log(node.$el)
    // this.$el.append(node.$el)
  }

  get data() {
    return this.$el.dataset
  }

  closest(selector) {
    return $(this.$el.closest(selector))
  }

  getCoords() {
    return this.$el.getBoundingClientRect()
  }

  findAll(selector) {
    return this.$el.querySelectorAll(selector)
  }

  css(styles = {}) {
    // for (const key in styles) {
    //   // eslint-disable-next-line
    //   if (styles.hasOwnProperty(key)) {
    //     console.log(key)
    //     console.log(styles[key])
    //   }
    // }
    Object.keys(styles).forEach(key => this.$el.style[key] = styles[key])
  }

  id(parse) {
    if (parse) {
      const parsed = this.id().split(':')
      return {
        row: +parsed[0],
        col: +parsed[1]
      }
    }
    return this.data.id
  }

  addClass(className) {
    this.$el.classList.add(className)
    return this
  }

  focus() {
    this.$el.focus()
    return this
  }

  removeClass(className) {
    this.$el.classList.remove(className)
    return this
  }
}
// $('div').html('<h1>Test</h1>').clear()

// event.target
export function $(selector) {
  return new Dom(selector)
}

$.create = (tagName, classes = '') => {
  const el = document.createElement(tagName)
  if (classes) {
    el.classList.add(classes)
  }
  return $(el)
}
