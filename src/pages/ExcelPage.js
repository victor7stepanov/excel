import {Page} from '@core/Page'
import {createStore} from '@core/store/createStore'
import {rootReducer} from '@/redux/rootReducer'
import {normalizeInitialState} from '@/redux/initialState'
import {debounce, storage} from '@core/utils'
import {Excel} from '@/components/excel/Excel'
import {Header} from '@/components/header/Header'
import {Toolbar} from '@/components/toolbar/Toolbar'
import {Formula} from '@/components/formula/Formula'
import {Table} from '@/components/table/Table'

function storageName(param) {
  return 'excel:' + param
}

export class ExcelPage extends Page {
  getRoot() {
    // console.log(this.params)
    const params = this.params ? this.params : Date.now().toString()

    // console.log('Params', params)
    // console.log('Storage name', storageName(params))
    const state = storage(storageName(params))
    // console.log('State', state)
    // const store = createStore(rootReducer, initialState)
    const initialState = normalizeInitialState(state)
    // console.log('initialState', initialState)
    // const store = createStore(rootReducer, normalizeInitialState(state))
    const store = createStore(rootReducer, initialState)

    const stateListener = debounce(state => {
      // console.log('App State:', state)
      // storage('excel-state', state)
      storage(storageName(params), state)
    }, 300)

    store.subscribe(stateListener)

    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store
    })

    return this.excel.getRoot()
  }

  afterRender() {
    // console.log('After render')
    this.excel.init()
  }

  destroy() {
    this.excel.destroy()
  }
}
