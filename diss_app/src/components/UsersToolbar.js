
import React from 'react'
import {string, func, shape, arrayOf} from 'prop-types'
import IconGroupLine from '@instructure/ui-icons/lib/Line/IconGroup'
import IconMoreLine from '@instructure/ui-icons/lib/Line/IconMore'
import IconPlusLine from '@instructure/ui-icons/lib/Line/IconPlus'
import IconStudentViewLine from '@instructure/ui-icons/lib/Line/IconStudentView'

import Button from '@instructure/ui-buttons/lib/components/Button'
import FormFieldGroup from '@instructure/ui-form-field/lib/components/FormFieldGroup'
import {GridCol} from '@instructure/ui-layout/lib/components/Grid'
import Menu, {MenuItem} from '@instructure/ui-menu/lib/components/Menu'

import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'
import Select from '@instructure/ui-core/lib/components/Select'
import TextInput from '@instructure/ui-forms/lib/components/TextInput'

import CreateOrUpdateUserModal from '../CreateOrUpdateUserModal'

function preventDefault (fn) {
  return function (event) {
    if (event) event.preventDefault()
    return fn.apply(this, arguments)
  }
}

export default function UsersToolbar(props) {
  const placeholder = 'Search people...'
  return (
    <form onSubmit={preventDefault(props.onApplyFilters)}>
      <FormFieldGroup layout="columns" description="">
        <GridCol width="auto">
          <Select
            label={<ScreenReaderContent>{'Filter by user type'}</ScreenReaderContent>}
            value={props.role_filter_id}
            onChange={e => props.onUpdateFilters({role_filter_id: e.target.value})}
          >
            <option key="all" value="">
              {'All Roles'}
            </option>
            {props.roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </Select>
        </GridCol>

        <TextInput
          type="search"
          value={props.search_term}
          label={<ScreenReaderContent>{placeholder}</ScreenReaderContent>}
          placeholder={placeholder}
          onChange={e => props.onUpdateFilters({search_term: e.target.value})}
          onKeyUp={e => {
            if (e.key === 'Enter') {
              props.toggleSRMessage(true)
            } else {
              props.toggleSRMessage(false)
            }
          }}
          onBlur={() => props.toggleSRMessage(true)}
          onFocus={() => props.toggleSRMessage(false)}
          messages={!!props.errors.search_term && [{type: 'error', text: props.errors.search_term}]}
        />

        <GridCol width="auto">
          {window.ENV.PERMISSIONS.can_create_users && (
            <CreateOrUpdateUserModal
              createOrUpdate="create"
              url={`/accounts/${props.accountId}/users`}
              afterSave={props.onApplyFilters} // update displayed results in case new user should appear
            >
              <Button aria-label={'Add people'}>
                <IconPlusLine />
                {'People'}
              </Button>
            </CreateOrUpdateUserModal>
          )}{' '}
          {renderKabobMenu(props.accountId)}
        </GridCol>
      </FormFieldGroup>
    </form>
  )
}

function renderKabobMenu(accountId) {
  const showAvatarItem = window.ENV.PERMISSIONS.can_manage_admin_users // see accounts_controller#avatars
  const showGroupsItem = window.ENV.PERMISSIONS.can_manage_groups // see groups_controller#context_index
  if (showAvatarItem || showGroupsItem) {
    return (
      <Menu
        trigger={
          <Button theme={{iconPlusTextMargin: '0'}}>
            <IconMoreLine margin="0" title={'More People Options'} />
          </Button>
        }
      >
        {showAvatarItem && (
          <MenuItem onClick={() => (window.location = `/accounts/${accountId}/avatars`)}>
            <IconStudentViewLine /> {'Manage profile pictures'}
          </MenuItem>
        )}
        {showGroupsItem && (
          <MenuItem onClick={() => (window.location = `/accounts/${accountId}/groups`)}>
            <IconGroupLine /> {'View user groups'}
          </MenuItem>
        )}
      </Menu>
    )
  }
  return null
}

UsersToolbar.propTypes = {
  toggleSRMessage: func.isRequired,
  onUpdateFilters: func.isRequired,
  onApplyFilters: func.isRequired,
  search_term: string,
  role_filter_id: string,
  errors: shape({search_term: string}),
  accountId: string,
  roles: arrayOf(
    shape({
      id: string.isRequired,
      label: string.isRequired
    })
  ).isRequired
}

UsersToolbar.defaultProps = {
  search_term: '',
  role_filter_id: '',
  errors: {},
  accountId: '',
  handlers: {},
  roles: []
}
