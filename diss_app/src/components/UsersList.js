

import Table from '@instructure/ui-elements/lib/components/Table'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import React from 'react'
import {arrayOf, string, object, func} from 'prop-types'
import UsersListRow from './UsersListRow'
import UsersListHeader from './UsersListHeader'

export default class UsersList extends React.Component {
  shouldComponentUpdate(nextProps) {
    let count = 0
    for (const prop in this.props) {
      ++count
      if (this.props[prop] !== nextProps[prop]) {
        // a change to searchFilter on it's own should not cause the list
        // to re-render
        if (prop !== 'searchFilter') {
          return true
        }
      }
    }
    return count !== Object.keys(nextProps).length
  }

  render() {
    return (
      <Table
        margin="small 0"
        caption={<ScreenReaderContent>{'Users'}</ScreenReaderContent>}
      >
        <thead>
          <tr>
            <UsersListHeader
              id="username"
              label={'Name'}
              tipDesc={'Click to sort by name ascending'}
              tipAsc={'Click to sort by name descending'}
              searchFilter={this.props.searchFilter}
              onUpdateFilters={this.props.onUpdateFilters}
            />
            <UsersListHeader
              id="email"
              label={'Email'}
              tipDesc={'Click to sort by email ascending'}
              tipAsc={'Click to sort by email descending'}
              searchFilter={this.props.searchFilter}
              onUpdateFilters={this.props.onUpdateFilters}
            />
            <UsersListHeader
              id="sis_id"
              label={'SIS ID'}
              tipDesc={'Click to sort by SIS ID ascending'}
              tipAsc={'Click to sort by SIS ID descending'}
              searchFilter={this.props.searchFilter}
              onUpdateFilters={this.props.onUpdateFilters}
            />
            <UsersListHeader
              id="last_login"
              label={'Last Login'}
              tipDesc={'Click to sort by last login ascending'}
              tipAsc={'Click to sort by last login descending'}
              searchFilter={this.props.searchFilter}
              onUpdateFilters={this.props.onUpdateFilters}
            />
            <th width="1" scope="col">
              <ScreenReaderContent>{'User option links'}</ScreenReaderContent>
            </th>
          </tr>
        </thead>
        <tbody data-automation="users list">
          {this.props.users.map(user => (
            <UsersListRow
              handleSubmitEditUserForm={this.props.handleSubmitEditUserForm}
              key={user.id}
              accountId={this.props.accountId}
              user={user}
              permissions={this.props.permissions}
            />
          ))}
        </tbody>
      </Table>
    )
  }
}

UsersList.propTypes = {
  accountId: string.isRequired,
  users: arrayOf(object).isRequired,
  permissions: object.isRequired,
  handleSubmitEditUserForm: func.isRequired,
  searchFilter: object.isRequired,
  onUpdateFilters: func.isRequired
}
