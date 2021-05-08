import {$} from '@core/dom'
import {Emitter} from '@core/Emitter'
import {StoreSubscriber} from '@core/StoreSubscriber'
import {updateDate} from '@/redux/actions'
import {preventDefault} from '@core/utils'

export class Excel {
  constructor(options) {
    // this.$el = $(selector)
    this.components = options.components || []
    this.emitter = new Emitter()
    this.store = options.store
    this.subscriber = new StoreSubscriber(this.store)
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

      const componentOptions = {
        emitter: this.emitter,
        store: this.store
      }

      const component = new Component($el, componentOptions)
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

  init() {
    // this.$el.innerHTML = '<h1>Test</h1>'
    // afterbegin, afterend, beforebegin, beforeend
    // this.$el.insertAdjacentHTML('afterbegin', `<h1>Test</h1>`)
    // const node = document.createElement('h1')
    // node.textContent = 'Test'
    // this.$el.append(node)

    // console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', preventDefault)
    }
    this.store.dispatch(updateDate())
    this.subscriber.subscribeComponents(this.components)
    this.components.forEach(component => component.init())
  }

  destroy() {
    this.subscriber.unsubscribeFromStore()
    this.components.forEach(component => component.destroy())
    document.removeEventListener('contextmenu', preventDefault)
  }
}
