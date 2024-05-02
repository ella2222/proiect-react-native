import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './src/component/Login';
import { login, register } from './src/api/Api';
import { StackNavigationState } from '@react-navigation/native';
import Router from './src/router';
import { AuthContextProvider } from './src/hooks/authContext';

export default function App() {
  return (
    <AuthContextProvider>
      <Router/>
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b734eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
