import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/ui/HeaderButton';

const EditProductsScreen = props => {
  return (
    <View>
      <Text>The Edit Products Screen</Text>
    </View>
  );
};

// EditProductsScreen.navigationOptions = navData => {
//     return{
//     headerTitle: 'Add Product',
//     headerLeft: (
//       <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
//         <Item
//           title='Cart'
//           iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
//           onPress={() => {
//             navData.navigation.toggleDrawer();
//           }}
//         />
//       </HeaderButtons>
//     ),
//     }
// }

const styles = StyleSheet.create({});

export default EditProductsScreen;
