

import {combineReducers} from 'redux'
import parseLinkHeader from 'parse-link-header'
import initialState from '../store/initialState'

const userListHandlers = {
  GOT_USERS(state, action) {
    return {
      ...state,
      users: action.payload.users,
      isLoading: false,
      links: parseLinkHeader(action.payload.xhr.getResponseHeader('Link'))
    }
  },
  GOT_USER_UPDATE(state, action) {
    return {
      ...state,
      users: state.users.map(user => (user.id === action.payload.id ? action.payload : user))
    }
  },
  UPDATE_SEARCH_FILTER(state, action) {
    return {
      ...state,
      errors: {
        search_term: ''
      },
      searchFilter: {
        ...state.searchFilter,
        ...action.payload
      }
    }
  },
  SEARCH_TERM_TOO_SHORT(state, action) {
    return {
      ...state,
      errors: {
        ...state.errors,
        search_term: action.errors.termTooShort
      }
    }
  },
  LOADING_USERS(state, _action) {
    return {
      ...state,
      isLoading: true
    }
  }
}

const makeReducer = handlerList => (state = initialState, action) => {
  const handler = handlerList[action.type]
  if (handler) return handler({...state}, action)
  return state
}

export default combineReducers({
  userList: makeReducer(userListHandlers)
})
