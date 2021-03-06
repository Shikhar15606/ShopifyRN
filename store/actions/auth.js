import AsyncStorage from '@react-native-async-storage/async-storage';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
let timer;
export const authenticate = (token, userId, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, token: token, userId: userId });
  };
};

const storeData = async (token, userId, expiryTime) => {
  try {
    await AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        token: token,
        userId: userId,
        expiryTime: expiryTime.toISOString(),
      })
    );
  } catch (err) {
    console.log(err.message);
  }
};

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
    dispatch(
      authenticate(
        resData.idToken,
        resData.localId,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expiryTime = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    storeData(resData.idToken, resData.localId, expiryTime);
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
    dispatch(
      authenticate(
        resData.idToken,
        resData.localId,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expiryTime = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    storeData(resData.idToken, resData.localId, expiryTime);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};
