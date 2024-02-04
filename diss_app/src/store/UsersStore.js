
import {pickBy as omitFalsyValues} from 'lodash'
import createStore from './createStore'

const USERS_TO_FETCH_PER_PAGE = 15
const defaultParms = {
  include: ['last_login', 'avatar_url', 'email', 'time_zone'],
  per_page: USERS_TO_FETCH_PER_PAGE,
  no_avatar_fallback: '1'
}

export default createStore({
  getUrl() {
    return `/api`
  },

  normalizeParams: params => omitFalsyValues({...defaultParms, ...params})
})
