
import React from 'react'
import {string, func, shape, bool} from 'prop-types'
import Button from '@instructure/ui-buttons/lib/components/Button'
import Tooltip from '@instructure/ui-overlays/lib/components/Tooltip'
import IconMasqueradeLine from '@instructure/ui-icons/lib/Line/IconMasquerade'
import IconMessageLine from '@instructure/ui-icons/lib/Line/IconMessage'
import IconEditLine from '@instructure/ui-icons/lib/Line/IconEdit'
import CreateOrUpdateUserModal from '../CreateOrUpdateUserModal'
import UserLink from './UserLink'

export default function UsersListRow({accountId, user, permissions, handleSubmitEditUserForm}) {
  return (
    <tr>
      <th scope="row">
        <UserLink
          href={`/accounts/${accountId}/users/${user.id}`}
          name={user.sortable_name}
          avatar_url={user.avatar_url}
          size="x-small"
        />
      </th>
      <td>{user.email}</td>
      <td>{user.sis_user_id}</td>
      <td>
        {user.last_login ? user.last_login.slice(0, 10) : ""}
      </td>
      <td style={{whiteSpace: 'nowrap'}}>
        {permissions.can_masquerade && (
          <Tooltip tip={`Act as ${user.name}`}>
            <Button variant="icon" size="small" disabled href={`/users/${user.id}/masquerade`}>
              <IconMasqueradeLine title={`Act as ${user.name}`} />
            </Button>
          </Tooltip>
        )}
        {permissions.can_message_users && (
          <Tooltip tip={`Send message to ${user.name}`}>
            <Button
              disabled
              variant="icon"
              size="small"
              href={`/conversations?user_name=${user.name}&user_id=${user.id}`}
            >
              <IconMessageLine title={`Send message to ${user.name}`} />
            </Button>
          </Tooltip>
        )}
        {permissions.can_edit_users && (
          <CreateOrUpdateUserModal
            createOrUpdate="update"
            url={`/accounts/${accountId}/users/${user.id}`}
            user={user}
            afterSave={handleSubmitEditUserForm}
          >
            <span>
              <Tooltip tip={`Edit ${user.name}`}>
                <Button variant="icon" size="small">
                  <IconEditLine title={`Edit ${user.name}`} />
                </Button>
              </Tooltip>
            </span>
          </CreateOrUpdateUserModal>
        )}
      </td>
    </tr>
  )
}

UsersListRow.propTypes = {
  accountId: string.isRequired,
  user: CreateOrUpdateUserModal.propTypes.user.isRequired,
  handleSubmitEditUserForm: func.isRequired,
  permissions: shape({
    can_masquerade: bool,
    can_message_users: bool,
    can_edit_users: bool
  }).isRequired
}
