export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAy1zzkC0JNyrxcUIVTJ-2BOd6umJtO3eU',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    if (!response.ok) {
      const resErrData = await response.json();
      const errorId = resErrData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'The email address is already in use by another account.';
      } else if (errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        message =
          'We have blocked all requests from this device due to unusual activity. Try again later.';
      }
      throw new Error(message);
    }
    const resData = await response.json();
    console.log(resData);
    dispatch({ type: SIGNUP });
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAy1zzkC0JNyrxcUIVTJ-2BOd6umJtO3eU',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    if (!response.ok) {
      const resErrData = await response.json();
      const errorId = resErrData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message =
          'There is no user record corresponding to this identifier. The user may have been deleted.';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'The password is invalid.';
      } else if (errorId === 'USER_DISABLED') {
        message = 'The user account has been disabled by an administrator.';
      }
      throw new Error(message);
    }
    const resData = await response.json();
    console.log(resData);
    dispatch({ type: LOGIN });
  };
};
