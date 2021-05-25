export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

export const deleteProduct = productId => {
  return { type: DELETE_PRODUCT, productId: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
  // modern js syntax if the key and value name is same
  return {
    type: CREATE_PRODUCT,
    productData: { title, description, imageUrl, price },
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
