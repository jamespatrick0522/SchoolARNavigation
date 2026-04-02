import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {AppNavigator} from '../navigation/AppNavigator';
import {AppDataProvider, useAppData} from '../state/AppDataContext';
import {colors} from '../constants/theme';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

const AppBootstrap = () => {
  const {isLoading} = useAppData();
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading local calibration data...</Text>
      </View>
    );
  }
  return (
    <NavigationContainer theme={theme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export const AppRoot = () => (
  <AppDataProvider>
    <AppBootstrap />
  </AppDataProvider>
);

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  loadingText: {
    color: colors.text,
    fontWeight: '600',
  },
});
