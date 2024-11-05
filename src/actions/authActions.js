export const login = (credentials) => async (dispatch) => {
    try {
      const response = await fetch('http://127.0.0.1:4000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: data.user
        });
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: data.message
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Error de conexión'
      });
    }
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    return { type: 'LOGOUT' };
  };