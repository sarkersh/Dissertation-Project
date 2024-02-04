

import React from 'react'
import Avatar from '@instructure/ui-elements/lib/components/Avatar'
import Button from '@instructure/ui-buttons/lib/components/Button'

export default function UserLink({size, avatar_url, name, ...propsToPassOnToLink}) {
  return (
    <Button
      variant="link"
      theme={{mediumPadding: '0', mediumHeight: '1rem'}}
      {...propsToPassOnToLink}
    >
      <Avatar size={size} name={name} src={avatar_url} margin="0 x-small xxx-small 0" />
      {name}
    </Button>
  )
}

UserLink.propTypes = {
  size: Avatar.propTypes.size,
  href: Button.propTypes.href,
  name: Avatar.propTypes.name,
  avatar_url: Avatar.propTypes.src
}
