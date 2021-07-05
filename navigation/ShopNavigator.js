import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
  createDrawerNavigator,
  DrawerNavigatorItems,
} from 'react-navigation-drawer';
import { createSwitchNavigator } from 'react-navigation';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import Colors from '../constants/Colors';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductsScreen from '../screens/user/EditProductsScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import { useDispatch } from 'react-redux';
import { logout } from '../store/actions/auth';

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
  },
  headerBackTitle: {
    fontFamily: 'open-sans',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: {
      screen: ProductsOverviewScreen,
    },
    ProductDetail: {
      screen: ProductDetailsScreen,
    },
    Cart: {
      screen: CartScreen,
    },
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: {
      screen: OrdersScreen,
    },
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: {
      screen: UserProductsScreen,
    },
    EditProduct: {
      screen: EditProductsScreen,
    },
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: props => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerNavigatorItems {...props} />
            <View style={{ padding: 20 }}>
              <Button
                title='Logout'
                color={Colors.primary}
                onPress={() => {
                  dispatch(logout());
                  // props.navigation.navigate('Auth');
                }}
              />
            </View>
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  { defaultNavigationOptions: defaultNavigationOptions }
);
const MainNavigator = createSwitchNavigator({
  Start: StartupScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator,
});
export default createAppContainer(MainNavigator);
