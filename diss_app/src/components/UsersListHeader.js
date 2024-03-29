

import React from 'react'
import {string, func, shape} from 'prop-types'
import Tooltip from '@instructure/ui-overlays/lib/components/Tooltip'
import IconMiniArrowUp from '@instructure/ui-icons/lib/Solid/IconMiniArrowUp'
import IconMiniArrowDown from '@instructure/ui-icons/lib/Solid/IconMiniArrowDown'
import Button from '@instructure/ui-buttons/lib/components/Button'

function preventDefault (fn) {
  return function (event) {
    if (event) event.preventDefault()
    return fn.apply(this, arguments)
  }
}

export default function UsersListHeader(props) {
  const {id, tipAsc, tipDesc, label, onUpdateFilters} = props
  const {sort, order, search_term, role_filter_id} = props.searchFilter
  const newOrder = (sort === id && order === 'asc') || (!sort && id === 'username') ? 'desc' : 'asc'

  return (
    <th scope="col">
      <Tooltip tip={sort === id && order === 'asc' ? tipAsc : tipDesc}>
        <Button
          onClick={preventDefault(() => {
            onUpdateFilters({search_term, sort: id, order: newOrder, role_filter_id})
          })}
          variant="link"
          theme={{fontWeight: '700', mediumPadding: '0', mediumHeight: '1.5rem'}}
        >
          {label}
          {sort === id ? order === 'asc' ? <IconMiniArrowUp /> : <IconMiniArrowDown /> : ''}
        </Button>
      </Tooltip>
    </th>
  )
}

UsersListHeader.propTypes = {
  id: string.isRequired,
  tipAsc: string.isRequired,
  tipDesc: string.isRequired,
  label: string.isRequired,
  onUpdateFilters: func.isRequired,
  searchFilter: shape({
    sort: string,
    order: string,
    search_term: string,
    fole_filter_id: string
  }).isRequired
}
