export enum USER_STATES {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum USER_ROLES {
  IT_MANAGER = 'it_manager',
  MANAGER = 'manager',
  TECHNICAL = 'technical'
}

export enum LOGIN_STATES {
  USER_NOT_KNOWN = 0,
  LOADING = 1,
  SUCCESS = 2,
  MODAL_IS_OPEN = 3,
  ERROR = -1
}

export const USER_LOGIN_STATES = {
  NOT_LOGGED: null,
  NOT_KNOWN: undefined
}
