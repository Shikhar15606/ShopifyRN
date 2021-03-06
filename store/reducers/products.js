import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  SET_PRODUCTS,
} from '../actions/products';
import Product from '../../models/product';
const initialState = {
  availableProducts: [],
  userProducts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.products.filter(
          product => product.ownerId === action.ownerId
        ),
      };
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.id,
        action.productData.ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };
    case UPDATE_PRODUCT:
      const userproductIndex = state.userProducts.findIndex(
        product => product.id === action.id
      );
      const availableproductIndex = state.availableProducts.findIndex(
        product => product.id === action.id
      );
      const updatedProduct = new Product(
        action.id,
        state.userProducts[userproductIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[userproductIndex].price
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[userproductIndex] = updatedProduct;

      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableproductIndex] = updatedProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          product => product.id !== action.productId
        ),
        availableProducts: state.availableProducts.filter(
          product => product.id !== action.productId
        ),
      };
  }
  return state;
};
