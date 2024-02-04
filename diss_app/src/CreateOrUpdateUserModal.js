
import React from 'react'
import {bool, func, shape, string, element, oneOf} from 'prop-types'
import Avatar from '@instructure/ui-elements/lib/components/Avatar'
import Button from '@instructure/ui-buttons/lib/components/Button'
import Checkbox from '@instructure/ui-forms/lib/components/Checkbox'
import FormFieldGroup from '@instructure/ui-form-field/lib/components/FormFieldGroup'
import TextInput from '@instructure/ui-forms/lib/components/TextInput'
import update from 'immutability-helper'
import {get, isEmpty} from 'lodash'
import axios from 'axios'
import $ from 'jquery'

import {firstNameFirst, lastNameFirst, nameParts} from './user_utils'
import InstuiModal, {ModalBody, ModalFooter} from './InstuiModal'
import TimeZoneSelect from './components/TimeZoneSelect'

//
// Copyright (C) 2012 - present Instructure, Inc.
//
// This file is part of Canvas.
//
// Canvas is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free
// Software Foundation, version 3 of the License.
//
// Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
// A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License along
// with this program. If not, see <http://www.gnu.org/licenses/>.

import _ from 'underscore'

// turns {'foo[bar]': 1} into {foo: {bar: 1}}
function unflatten (obj) {
  return _(obj).reduce((newObj, val, key) => {
    let keys = key.split('][')
    let lastKey = keys.length - 1

    // If the first keys part contains [ and the last ends with ], then []
    // are correctly balanced.
    if (/\[/.test(keys[0]) && /\]$/.test(keys[lastKey])) {
      // Remove the trailing ] from the last keys part.
      keys[lastKey] = keys[lastKey].replace(/\]$/, '')

      // Split first keys part into two parts on the [ and add them back onto
      // the beginning of the keys array.
      keys = keys.shift().split('[').concat(keys)
      lastKey = keys.length - 1
    } else {
      // Basic 'foo' style key.
      lastKey = 0
    }

    if (lastKey) {
      // Complex key, build deep object structure based on a few rules:
      // * The 'cur' pointer starts at the object top-level.
      // * [] = array push (n is set to array length), [n] = array if n is
      //   numeric, otherwise object.
      // * If at the last keys part, set the value.
      // * For each keys part, if the current level is undefined create an
      //   object or array based on the type of the next keys part.
      // * Move the 'cur' pointer to the next level.
      // * Rinse & repeat.
      let i = 0
      let cur = newObj
      while (i <= lastKey) {
        key = keys[i] === '' ? cur.length : keys[i]

        cur = cur[key] = i < lastKey ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val
        i++
      }
    } else {
      // Simple key, even simpler rules, since only scalars and shallow
      // arrays are allowed.

      if (_.isArray(newObj[key])) {
        // val is already an array, so push on the next value.
        newObj[key].push(val)
      } else if (newObj[key] != null) {
        // val isn't an array, but since a second value has been specified,
        // convert val into an array.
        newObj[key] = [newObj[key], val]
      } else {
        // val is a scalar.
        newObj[key] = val
      }
    }

    return newObj
  }, {})
}

const trim = (str = '') => str.trim()

const initialState = {
  open: false,
  data: {
    user: {},
    pseudonym: {
      send_confirmation: true
    }
  },
  errors: {}
}

function preventDefault (fn) {
  return function (event) {
    if (event) event.preventDefault()
    return fn.apply(this, arguments)
  }
}

export default class CreateOrUpdateUserModal extends React.Component {
  static propTypes = {
    // whatever you pass as the child, when clicked, will open the dialog
    children: element.isRequired,
    createOrUpdate: oneOf(['create', 'update']).isRequired,
    url: string.isRequired,
    user: shape({
      name: string.isRequired,
      sortable_name: string,
      short_name: string,
      email: string,
      time_zone: string
    }),
    customized_login_handle_name: string,
    delegated_authentication: bool.isRequired,
    showSIS: bool.isRequired,
    afterSave: func.isRequired
  }

  static defaultProps = {
    customized_login_handle_name: window.ENV.customized_login_handle_name,
    delegated_authentication: window.ENV.delegated_authentication,
    showSIS: window.ENV.SHOW_SIS_ID_IN_NEW_USER_FORM
  }

  state = {...initialState}

  componentWillMount() {
    if (this.props.createOrUpdate === 'update') {
      // only get the attributes from the user that we are actually going to show in the <input>s
      // and send to the server. Because if we send the server extraneous attributes like user[id]
      // it throws 401 errors
      const userDataFromProps = this.getInputFields().reduce((memo, {name}) => {
        const key = name.match(/user\[(.*)\]/)[1] // extracts 'short_name' from 'user[short_name]'
        return {...memo, [key]: this.props.user[key]}
      }, {})
      this.setState(update(this.state, {data: {user: {$set: userDataFromProps}}}))
    }
  }

  onChange = (field, value) => {
    this.setState(prevState => {
      let newState = update(prevState, {
        data: unflatten({[field]: {$set: value}}),
        errors: {$set: {}}
      })

      // set sensible defaults for sortable_name and short_name
      if (field === 'user[name]') {
        const u = prevState.data.user
        // shamelessly copypasted from user_sortable_name.js
        const sortableNameParts = nameParts(trim(u.sortable_name))
        if (!trim(u.sortable_name) || trim(firstNameFirst(sortableNameParts)) === trim(u.name)) {
          const newSortableName = lastNameFirst(nameParts(value, sortableNameParts[1]))
          newState = update(newState, {data: {user: {sortable_name: {$set: newSortableName}}}})
        }
        if (!trim(u.short_name) || trim(u.short_name) === trim(u.name)) {
          newState = update(newState, {data: {user: {short_name: {$set: value}}}})
        }
      }
      return newState
    })
  }

  close = () => this.setState({open: false})

  onSubmit = () => {
    if (!isEmpty(this.state.errors)) return
    const method = {create: 'POST', update: 'PUT'}[this.props.createOrUpdate]
    axios({url: this.props.url, method, data: this.state.data}).then(
      response => {
        const getUserObj = o => (o.user ? getUserObj(o.user) : o)
        const user = getUserObj(response.data)
        const userName = user.name
        const wrapper = `<a href='/users/${user.id}'>$1</a>`
        $.flashMessage(
          response.data.message_sent
            ? `*${userName}* saved successfully! They should receive an email confirmation shortly.` :
            `*${userName}* saved successfully!`
        )

        this.setState({...initialState})
        if (this.props.afterSave) this.props.afterSave(response)
      },
      ({response}) => {
        const errors = response.data.errors
        $.flashError('Something went wrong saving user details.')
        this.setState({errors})
      }
    )
  }

  getInputFields = () => {
    const showCustomizedLoginId =
      this.props.customized_login_handle_name || this.props.delegated_authentication
    return [
      {
        name: 'user[name]',
        label: 'Full Name',
        hint: 'This name will be used by teachers for grading.',
        required: 'Full name is required'
      },
      {
        name: 'user[short_name]',
        label: 'Display Name',
        hint: 'People will see this name in discussions, messages and comments.'
      },
      {
        name: 'user[sortable_name]',
        label: 'Sortable Name',
        hint: 'This name appears in sorted lists.'
      }
    ]
      .concat(
        this.props.createOrUpdate === 'create'
          ? [
              {
                name: 'pseudonym[unique_id]',
                label: this.props.customized_login_handle_name || 'Email',
                required: this.props.customized_login_handle_name
                  ? `${this.props.customized_login_handle_name} is required`
                  : 'Email is required'
              },
              showCustomizedLoginId && {
                name: 'pseudonym[path]',
                label: 'Email',
                required: 'Email is required'
              },
              this.props.showSIS && {
                name: 'pseudonym[sis_user_id]',
                label: 'SIS ID'
              },
              {
                name: 'pseudonym[send_confirmation]',
                label: 'Email the user about this account creation',
                Component: Checkbox
              }
            ]
          : [
              {
                name: 'user[email]',
                label: 'Default Email'
              },
              {
                name: 'user[time_zone]',
                label: 'Time Zone',
                Component: TimeZoneSelect
              }
            ]
      )
      .filter(Boolean)
  }

  render = () => (
    <span>
      <InstuiModal
        as="form"
        onSubmit={preventDefault(this.onSubmit)}
        open={this.state.open}
        onDismiss={this.close}
        size="small"
        label={
          this.props.createOrUpdate === 'create' ? (
            'Add a New User'
          ) : (
            <span>
              <Avatar
                size="small"
                name={this.state.data.user.name}
                src={this.props.user.avatar_url}
              />{' '}
              {'Edit User Details'}
            </span>
          )
        }
      >
        <ModalBody>
          <FormFieldGroup layout="stacked" rowSpacing="small" description="">
            {this.getInputFields().map(({name, label, hint, required, Component = TextInput}) => (
              <Component
                key={name}
                label={label}
                value={get(this.state.data, name)}
                checked={get(this.state.data, name)}
                onChange={e =>
                  this.onChange(
                    name,
                    e.target.type === 'checkbox' ? e.target.checked : e.target.value
                  )
                }
                required={!!required}
                layout="inline"
                messages={(this.state.errors[name] || [])
                  .map(errMsg => ({type: 'error', text: errMsg}))
                  .concat(hint && {type: 'hint', text: hint})
                  .filter(Boolean)}
              />
            ))}
          </FormFieldGroup>
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.close}>{'Cancel'}</Button> &nbsp;
          <Button type="submit" variant="primary">
            {this.props.createOrUpdate === 'create' ? 'Add User' : 'Save'}
          </Button>
        </ModalFooter>
      </InstuiModal>
      {React.Children.map(this.props.children, child =>
        // when you click whatever is the child element to this, open the modal
        React.cloneElement(child, {
          onClick: (...args) => {
            if (child.props.onClick) child.props.onClick(...args)
            this.setState({open: true})
          }
        })
      )}
    </span>
  )
}