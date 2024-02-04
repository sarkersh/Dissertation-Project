
import React from 'react'
import {arrayOf, shape, string} from 'prop-types'
import Select from '@instructure/ui-core/lib/components/Select'

export default function TimeZoneSelect({
  label,
  timezones,
  priority_zones,
  ...otherPropsToPassOnToSelect
}) {
  return (
    <Select {...otherPropsToPassOnToSelect} label={label}>
      <option value="" />
      {[
        {label: 'Common Timezones', timezones: priority_zones},
        {label: 'All Timezones', timezones}
      ].map(({label, timezones}) => (
        <optgroup key={label} label={label}>
          {timezones.map(zone => (
            <option key={zone.name} value={zone.name}>
              {zone.localized_name}
            </option>
          ))}
        </optgroup>
      ))}
    </Select>
  )
}

const timezoneShape = shape({
  name: string.isRequired,
  localized_name: string.isRequired
}).isRequired

TimeZoneSelect.propTypes = {
  ...Select.propTypes, // this accepts any prop you'd pass to InstUI's Select. see it's docs for examples
  timezones: arrayOf(timezoneShape),
  priority_zones: arrayOf(timezoneShape)
}

let defaultsJSON
try {
  defaultsJSON = require(`./localized-timezone-lists/en.json`)
} catch (e) {
  // fall back to english if a user has a locale set that we don't have a list for
  defaultsJSON = require(`./localized-timezone-lists/en.json`)
}

TimeZoneSelect.defaultProps = {
  // TODO: change ENV.LOCALE to process.env.BUILD_LOCALE once we do locale-specific builds so we only pull in that one json file
  ...defaultsJSON,
  label: 'Time Zone'
}
