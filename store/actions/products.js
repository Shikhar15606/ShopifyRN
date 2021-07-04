import Product from '../../models/product';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    // execute any async code here and then dispatch action
    const ownerId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://shopify15606-default-rtdb.firebaseio.com/products.json'
      );
      if (response.ok === false) {
        throw new Error('Something went wrong');
      }
      const resData = await response.json();
      let loadedProducts = [];
      for (let key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }
      dispatch({ type: SET_PRODUCTS, products: loadedProducts, ownerId });
    } catch (err) {
      // send analytis to your server
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://shopify15606-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: DELETE_PRODUCT,
      productId: productId,
    });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    // execute any async code here and then dispatch action
    const token = getState().auth.token;
    const ownerId = getState().auth.userId;
    const response = await fetch(
      `https://shopify15606-default-rtdb.firebaseio.com/products.json?auth=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();
    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://shopify15606-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: UPDATE_PRODUCT,
      id: id,
      productData: { title, description, imageUrl },
    });
  };
};
