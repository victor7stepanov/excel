import {$} from '@core/dom'

export class Excel {
  constructor(selector, options) {
    this.$el = $(selector)
    this.components = options.components || []
  }

  getRoot() {
    // const $root = document.createElement('div')
    const $root = $.create('div', 'excel')
    // $root.textContent = 'test'
    // $root.style.fontSize = '5rem'
    // $root.classList.add('excel')

    this.components = this.components.map(Component => {
      // const $el = document.createElement('div')
      // $el.classList.add(Component.className)
      const $el = $.create('div', Component.className)
      const component = new Component($el)
      // debug
      // if (component.name) {
      //   window['c' + component.name] = component
      // }
      // console.log(component.toHTML())
      // $el.innerHTML = component.toHTML()
      $el.html(component.toHTML())
      $root.append($el)
      // $root.insertAdjacentHTML('beforeend', component.toHTML())
      return component
    })

    return $root
  }

  render() {
    // this.$el.innerHTML = '<h1>Test</h1>'
    // afterbegin, afterend, beforebegin, beforeend
    // this.$el.insertAdjacentHTML('afterbegin', `<h1>Test</h1>`)
    // const node = document.createElement('h1')
    // node.textContent = 'Test'
    // this.$el.append(node)
    this.$el.append(this.getRoot())

    this.components.forEach(component => component.init())
  }
}
