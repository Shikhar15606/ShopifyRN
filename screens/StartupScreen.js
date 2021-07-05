import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { authenticate } from '../store/actions/auth';
import { useDispatch } from 'react-redux';

const StartupScreen = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) {
          props.navigation.navigate('Auth');
          return;
        }
        const transformedData = JSON.parse(userData);
        const { token, userId, expiryTime } = transformedData;
        const expTime = new Date(expiryTime);
        if (expTime <= new Date() || !token || !userId) {
          props.navigation.navigate('Auth');
          return;
        }
        const remainingExpTime = expTime.getTime() - new Date().getTime();
        props.navigation.navigate('Shop');
        dispatch(authenticate(token, userId, remainingExpTime));
      } catch (e) {
        props.navigation.navigate('Auth');
        return;
      }
    };
    tryLogin();
  }, [dispatch]);
  return (
    <View style={styles.screen}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default StartupScreen;
