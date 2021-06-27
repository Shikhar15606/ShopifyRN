import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  StyleSheet,
  View,
  Button,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/ui/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import { fetchOrders } from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState();

  const loadOrders = useCallback(async () => {
    setError(null);
    setisLoading(true);
    try {
      await dispatch(fetchOrders());
    } catch (err) {
      setError(err.message);
    }
    setisLoading(false);
  }, [dispatch, setError, setisLoading]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      () => {
        loadOrders();
      },
      [loadOrders]
    );
    // cleanup fxn when component is destroyed or useEffect reruns
    return () => {
      willFocusSub.remove();
    };
  });

  const orders = useSelector(state => state.orders.orders);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An Error Occurred</Text>
        <Button title='Try Again' onPress={loadOrders} color={Colors.primary} />
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }
  if (!isLoading && orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Orders found. Order some Products</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Orders',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Cart'
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrdersScreen;
