export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

export const deleteProduct = productId => {
  return { type: DELETE_PRODUCT, productId: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async dispatch => {
    // execute any async code here and then dispatch action
    const response = await fetch(
      'https://shopify15606-default-rtdb.firebaseio.com/products.json',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
        }),
      }
    );
    const resData = await response.json();
    console.log(resData);
    dispatch({
      type: CREATE_PRODUCT,
      productData: { id: resData.name, title, description, imageUrl, price },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  // modern js syntax if the key and value name is same
  return {
    type: UPDATE_PRODUCT,
    id: id,
    productData: { title, description, imageUrl },
  };
};
