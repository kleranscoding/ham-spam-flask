import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';

//const createStoreWithMiddleware = applyMiddleware()(createStore);
//const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  , document.getElementById('root'));

serviceWorker.unregister();
