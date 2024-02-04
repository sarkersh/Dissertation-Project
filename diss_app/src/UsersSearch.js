

import React from 'react'
import {string, bool, shape} from 'prop-types'
import {stringify} from 'qs'
import UsersStore from './store/UsersStore'
import UsersPane from './components/UsersPane'

const stores = [ UsersStore ]

export default class UsersSearch extends React.Component {
  static propTypes = {
    accountId: string.isRequired,
    rootAccountId: string.isRequired,
    permissions: shape({
      analytics: bool.isRequired
    }).isRequired
  }

  updateQueryParams(params) {
    const query = stringify(params)
    window.history.replaceState(null, null, `?${query}`)
  }

  render() {
     return (
      <UsersPane
        {...{
          ...this.props,
          onUpdateQueryParams: this.updateQueryParams,
          queryParams: null
        }}
      />
    )
  }
}
