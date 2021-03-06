import {$} from '@core/dom'
// import {storage} from '@core/utils'

export function resizeHandler($root, event) {
  return new Promise(resolve => {
    // console.log(event.target)
    // console.log(event.target.getAttribute('data-resize'))
    // console.log(event.target.dataset)
    // if (event.target.dataset.resize) {
    //   console.log('Start resizing', event.target.dataset.resize)
    // }
    const $resizer = $(event.target)
    // const $parent = $resizer.$el.parentNode
    // const $parent = $resizer.$el.closest('.column')
    const $parent = $resizer.closest('[data-type="resizable"]')
    const coords = $parent.getCoords()
    // console.log($parent.data.col)
    const type = $resizer.data.resize
    const sideProp = type === 'col' ? 'bottom' : 'right'
    let value

    $resizer.css({
      opacity: '1',
      [sideProp]: '-5000px'
    })

    document.onmousemove = ev => {
      if (type === 'col') {
        const delta = ev.pageX - coords.right
        value = coords.width + delta
        $resizer.css({right: -delta + 'px'})
        // $parent.$el.style.width = value + 'px'
      } else {
        const delta = ev.pageY - coords.bottom
        value = coords.height + delta
        $resizer.css({bottom: -delta + 'px'})
        // $parent.$el.style.height = value + 'px'
      }
    }

    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null

      if (type === 'col') {
        $parent.css({width: value + 'px'})
        $root.findAll(`[data-col="${$parent.data.col}"]`)
            .forEach(el => el.style.width = value + 'px')
      } else {
        $parent.css({height: value + 'px'})
      }

      resolve({
        value,
        type,
        // id: type === 'col' ? $parent.data.col : $parent.data.row
        id: $parent.data[type]
      })

      $resizer.css({
        opacity: '0',
        bottom: '0',
        right: '0'
      })
    }
  })
}

// export function initResize($root) {
//   const state = storage('excel-state')
//   for (const [key, value] of Object.entries(state.colState)) {
//     $root.findAll(`[data-col="${key}"]`)
//         .forEach(el => el.style.width = value + 'px')
//   }
// }
