import React from 'react';
import ReactDOM from 'react-dom';
import UsersSearch from './UsersSearch';
import configureStore from './store/configureStore'
import initialState from './store/initialState'
import './index.css'
import '@instructure/canvas-theme'

const store = configureStore(initialState)

const props = {
  permissions: window.ENV.PERMISSIONS,
  rootAccountId: window.ENV.ROOT_ACCOUNT_ID,
  accountId: window.ENV.ACCOUNT_ID,
  roles: window.ENV.ROLES,
  store
} 

ReactDOM.render(<UsersSearch {...props} />, document.getElementById('root'));

