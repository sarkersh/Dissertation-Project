

export default {
  userList: {
    users: [],
    isLoading: true,
    errors: {search_term: ''},
    links: undefined,
    searchFilter: {search_term: ''},
    permissions: window.ENV.PERMISSIONS,
    accountId: window.ENV.ACCOUNT_ID,
    rootAccountId: window.ENV.ROOT_ACCOUNT_ID
  }
}
