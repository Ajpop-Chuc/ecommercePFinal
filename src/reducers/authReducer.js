// src/reducers/authReducer.js
const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_REQUEST':
        return {
          ...state,
          loading: true,
          error: null
        };
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
          loading: false,
          error: null
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: action.payload
        };
      case 'LOGOUT':
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null
        };
      default:
        return state;
    }
  };