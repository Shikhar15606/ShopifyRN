import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import CartItem from '../../models/cart-item';
import { ADD_ORDER } from '../../store/actions/orders';

const initialState = {
  items: {},
  totalAmount: 0,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const productPrice = addedProduct.price;
      const productTitle = addedProduct.title;
      let updatedornewCartItem;
      if (state.items[addedProduct.id]) {
        updatedornewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[addedProduct.id].sum + productPrice
        );
      } else {
        updatedornewCartItem = new CartItem(
          1,
          productPrice,
          productTitle,
          productPrice
        );
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedornewCartItem },
        totalAmount: state.totalAmount + productPrice,
      };
    case REMOVE_FROM_CART:
      const removedProduct = state.items[action.productId];
      const currentQuantity = state.items[action.productId].quantity;
      let updatedCartItems;
      if (currentQuantity > 1) {
        let updatedCartItem = new CartItem(
          currentQuantity - 1,
          removedProduct.productPrice,
          removedProduct.productTitle,
          removedProduct.sum - removedProduct.productPrice
        );
        updatedCartItems = {
          ...state.items,
          [action.productId]: updatedCartItem,
        };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.productId];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - removedProduct.productPrice,
      };
    case ADD_ORDER:
      return initialState;
  }
  return state;
};
