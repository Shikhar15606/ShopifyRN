import React, { useEffect, useCallback, useReducer } from 'react';
import { View, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import { createProduct, updateProduct } from '../../store/actions/products';
import Input from '../../components/ui/Input';

// putting outside component to avoid rebuilds
// can also be done by putting inside the component and using useCallback instead
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

// ======== reducer ==========
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedInputValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      ...state,
      inputValues: updatedInputValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid,
    };
  }
  return state;
};

const EditProductsScreen = props => {
  const productId = props.navigation.getParam('productId');
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(product => product.id === productId)
  );

  const dispatch = useDispatch();

  // ========== initial state =============
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      price: '',
      description: editedProduct ? editedProduct.description : '',
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      price: editedProduct ? true : false,
      description: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  // ============= action ===============
  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong Input', 'Please fill valid values in the form.', [
        { text: 'Okay' },
      ]);
      return;
    }
    if (editedProduct) {
      dispatch(
        updateProduct(
          productId,
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl
        )
      );
    } else {
      dispatch(
        createProduct(
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl,
          +formState.inputValues.price
        )
      );
    }
    props.navigation.goBack();
  }, [dispatch, productId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          id='title'
          label='Title'
          errorText='Enter a valid title'
          keyboardType='default'
          autoCapitalize='sentences'
          autoCorrect
          returnKeyType='next'
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.title : ''}
          initiallyValid={!!editedProduct}
          required
          minLength={3}
        />
        <Input
          id='imageUrl'
          label='Image Url'
          errorText='Enter a valid Image Url'
          keyboardType='default'
          returnKeyType='next'
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.imageUrl : ''}
          initiallyValid={!!editedProduct}
          required
        />
        {editedProduct ? null : (
          <Input
            id='price'
            label='Price'
            errorText='Enter a valid price'
            keyboardType='decimal-pad'
            returnKeyType='next'
            onInputChange={inputChangeHandler}
            required
            min={0.1}
          />
        )}
        <Input
          id='description'
          label='Description'
          errorText='Enter a valid description'
          keyboardType='default'
          autoCapitalize='sentences'
          autoCorrect
          multiline
          numberOfLines={3}
          returnKeyType='next'
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.description : ''}
          initiallyValid={!!editedProduct}
          required
          minLength={10}
        />
      </View>
    </ScrollView>
  );
};

EditProductsScreen.navigationOptions = navData => {
  const submitFxn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Edit Product'
      : 'Add Product',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Save'
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFxn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
});

export default EditProductsScreen;
