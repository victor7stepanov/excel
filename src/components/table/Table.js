import {ExcelComponent} from '@core/ExcelComponent'
import {$} from '@core/dom'
import {createTable} from '@/components/table/table.template'
import {resizeHandler} from '@/components/table/table.resize'
import {isCell, matrix, nextSelector, shouldResize} from './table.functions'
import {TableSelection} from '@/components/table/TableSelection'

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
    return createTable(30)
  }

  prepare() {
    this.selection = new TableSelection()
  }

  init() {
    super.init()

    this.selectCell(this.$root.find('[data-id="0:0"]'))

    this.$on('formula:input', text => {
      this.selection.current.text(text)
    })
    // const unsub = this.emitter.subscribe('it is working', text => {
    //   this.selection.current.text(text)
    //   console.log('Table from Formula', text)
    // })
    // this.unsubs.push(unsub)

    this.$on('formula:done', () => {
      this.selection.current.focus()
    })
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('table:select', $cell)
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(this.$root, event)
    } else if (isCell(event)) {
      const $target = $(event.target)

      this.selectCell($target)

      if (event.shiftKey) {
        // group
        const $cells = matrix($target, this.selection.current)
            .map(id => this.$root.find(`[data-id="${id}"]`))
        this.selection.selectGroup($cells)
      } else {
        this.selection.select($target)
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

  onInput(event) {
    this.$emit('table:input', $(event.target))
  }
}

