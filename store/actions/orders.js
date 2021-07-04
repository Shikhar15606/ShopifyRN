import Order from '../../models/order';
export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://shopify15606-default-rtdb.firebaseio.com/orders/${userId}.json`
      );
      if (response.ok === false) {
        throw new Error('Something went wrong');
      }
      const resData = await response.json();
      let loadedOrders = [];
      for (let key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }
      dispatch({
        type: SET_ORDERS,
        orders: loadedOrders,
      });
    } catch (err) {
      // send analytis to your server
      throw err;
    }
  };
};

export const addOrder = (items, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();
    const response = await fetch(
      `https://shopify15606-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();
    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: items,
        totalAmount: totalAmount,
        date: date,
      },
    });
  };
};
