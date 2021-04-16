import {ExcelComponent} from '@core/ExcelComponent'
import {$} from '@core/dom'
import {createTable} from '@/components/table/table.template'
import {resizeHandler} from '@/components/table/table.resize'
import {isCell, matrix, nextSelector, shouldResize} from './table.functions'
import {TableSelection} from '@/components/table/TableSelection'
import * as actions from '@/redux/actions'
import {defaultStyles} from '@/constants'
import {parse} from '@core/parse'

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options
    })
    // this.unsubs = []
  }

  toHTML() {
    return createTable(30, this.store.getState())
  }

  prepare() {
    this.selection = new TableSelection()
  }

  init() {
    super.init()

    this.selectCell(this.$root.find('[data-id="0:0"]'))

    this.$on('formula:input', value => {
      this.selection.current
          .attr('data-value', value)
          .text(parse(value))
      // this.selection.current.text(text)
      this.updateTextInStore(value)
    })
    // const unsub = this.emitter.subscribe('it is working', text => {
    //   this.selection.current.text(text)
    //   console.log('Table from Formula', text)
    // })
    // this.unsubs.push(unsub)

    this.$on('formula:done', () => {
      this.selection.current.focus()
    })

    // this.$subscribe(state => {
    //   console.log('Table State', state)
    // })

    // initResize(this.$root)

    this.$on('toolbar:applyStyle', value => {
      this.selection.applyStyle(value)
      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectedIds
      }))
    })
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('table:select', $cell)

    // console.log($cell.getStyles(Object.keys(defaultStyles)))
    const styles = $cell.getStyles(Object.keys(defaultStyles))
    // console.log('Styles to dispatch:', styles)
    this.$dispatch(actions.changeStyles(styles))
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandler(this.$root, event)
      this.$dispatch(actions.tableResize(data))
    } catch (e) {
      console.warn('Resize error', e.message)
    }
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event)
    } else if (isCell(event)) {
      const $target = $(event.target)

      if (event.shiftKey) {
        // group
        const $cells = matrix($target, this.selection.current)
            .map(id => this.$root.find(`[data-id="${id}"]`))
        this.selection.selectGroup($cells)
      } else {
        this.selectCell($target)
      }
    }
    // const id = event.target.dataset.id
    // if (id) {
    //   this.$root.find('.selected').removeClass('selected')
    //   const $cell = this.$root.find(`[data-id="${id}"]`)
    //   this.selection.select($cell)
    // }
  }

  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp'
    ]

    const {key} = event

    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault()
      const id = this.selection.current.id(true)
      const $next = this.$root.find(nextSelector(key, id))

      this.selectCell($next)
    }
    // const $current = this.selection.current
    // if (event.code === 'ArrowDown') {
    //   const currentId = $current.id(true)
    //   currentId.row = currentId.row + 1
    //   const $nextCell = this.$root
    //       .find(`[data-id="${currentId.row}:${currentId.col}"]`)
    //   this.selection.select($nextCell)
    // }
  }

  // destroy() {
  //   super.destroy()
  //   this.unsubs.forEach(unsub => unsub())
  // }

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value
    }))
  }

  onInput(event) {
    // this.$emit('table:input', $(event.target))
    this.updateTextInStore($(event.target).text())
  }
}

// вставка текста в ячейку и не отображение в формуле - пофиксить
