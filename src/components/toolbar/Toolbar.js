import {createToolbar} from '@/components/toolbar/toolbar.template'
import {$} from '@core/dom'
import {ExcelStateComponent} from '@core/ExcelStateComponent'
import {defaultStyles} from '@/constants'

export class Toolbar extends ExcelStateComponent {
  static className = 'excel__toolbar'

  constructor($root, options) {
    super($root, {
      name: 'Toolbar',
      listeners: ['click'],
      subscribe: ['currentStyles'],
      ...options
    })
  }

  prepare() {
    this.initState(defaultStyles)
  }

  get template() {
    return createToolbar(this.state)
  }

  toHTML() {
    return this.template
  }

  storeChanged(changes) {
    this.setState(changes.currentStyles)
  }

  onClick(event) {
    // console.log(event.target)
    const $target = $(event.target)
    if ($target.data.type === 'button') {
      // console.log($target.text())
      // console.log($target.data.value)
      const value = JSON.parse($target.data.value)
      // console.log(value)

      this.$emit('toolbar:applyStyle', value)

      // const key = Object.keys(value)[0]
      // // console.log(key)
      // this.setState({[key]: value[key]})
      // // console.log(this.state)
    }
  }
}
