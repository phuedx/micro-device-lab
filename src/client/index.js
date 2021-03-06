/* global IS_PROD */

import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import { refresh } from './actions'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './components'

injectTapEventPlugin()

let middleware = [thunk]

if (!IS_PROD) {
  middleware.push(createLogger())
}

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore)
const store = createStoreWithMiddleware(reducer)

store.dispatch(refresh())

import './index.css'

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
