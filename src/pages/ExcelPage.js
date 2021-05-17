import {Page} from '@core/page/Page'
import {createStore} from '@core/store/createStore'
import {rootReducer} from '@/redux/rootReducer'
import {normalizeInitialState} from '@/redux/initialState'
import {Excel} from '@/components/excel/Excel'
import {Header} from '@/components/header/Header'
import {Toolbar} from '@/components/toolbar/Toolbar'
import {Formula} from '@/components/formula/Formula'
import {Table} from '@/components/table/Table'
import {StateProcessor} from '@core/page/StateProcessor'
import {LocalStorageClient} from '@/shared/LocalStorageClient'

export class ExcelPage extends Page {
  constructor(param) {
    super(param)

    this.storeSub = null
    this.processor = new StateProcessor(
        new LocalStorageClient(this.params)
    )
  }

  async getRoot() {
    // console.log(this.params)
    // const params = this.params ? this.params : Date.now().toString()

    // console.log('Params', params)
    // console.log('Storage name', storageName(params))
    // const state = storage(storageName(params))
    const state = await this.processor.get()
    // console.log('State', state)
    // const store = createStore(rootReducer, initialState)
    const initialState = normalizeInitialState(state)
    // console.log('initialState', initialState)
    // const store = createStore(rootReducer, normalizeInitialState(state))
    const store = createStore(rootReducer, initialState)

    // const stateListener = debounce(state => {
    //   // console.log('App State:', state)
    //   // storage('excel-state', state)
    //   storage(storageName(params), state)
    // }, 300)

    // store.subscribe(stateListener)
    // this.storeSub = store.subscribe(stateListener)
    this.storeSub = store.subscribe(this.processor.listen)

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
    this.storeSub.unsubscribe()
  }
}
