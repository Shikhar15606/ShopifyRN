import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Button,
} from 'react-native';
import { useSelector } from 'react-redux';

const ProductDetailsScreen = props => {
  const productId = props.navigation.getParam('productId');
  const product = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  );
  return (
    <View>
      <Text>{product.title}</Text>
    </View>
  );
};

ProductDetailsScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('productTitle'),
  };
};

const styles = StyleSheet.create({});

export default ProductDetailsScreen;
