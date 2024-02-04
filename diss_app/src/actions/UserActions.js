
import UsersStore from '../store/UsersStore'

export default {
  gotUserList(users, xhr) {
    return {
      type: 'GOT_USERS',
      payload: {
        users,
        xhr
      }
    }
  },

  gotUserUpdate(user) {
    return {
      type: 'GOT_USER_UPDATE',
      payload: user
    }
  },

  updateSearchFilter(filter) {
    return {
      type: 'UPDATE_SEARCH_FILTER',
      payload: filter
    }
  },

  displaySearchTermTooShortError(minSearchLength) {
    return {
      type: 'SEARCH_TERM_TOO_SHORT',
      errors: {
        termTooShort: `Search term must be at least ${minSearchLength} characters`
      }
    }
  },

  loadingUsers() {
    return {
      type: 'LOADING_USERS'
    }
  },

  applySearchFilter(minSearchLength, store = UsersStore) {
    return (dispatch, getState) => {
      const searchFilter = getState().userList.searchFilter
      if (
        !searchFilter ||
        searchFilter.search_term.length >= minSearchLength ||
        searchFilter.search_term === ''
      ) {
        dispatch(this.loadingUsers())
        store.load(searchFilter).then((response, _, xhr) => {
          dispatch(this.gotUserList(response, xhr))
        })
      } else {
        dispatch(this.displaySearchTermTooShortError(minSearchLength))
      }
    }
  }
}
