import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import NewAreaScreen from './screens/NewAreaScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    <Text>Loading...</Text>
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userToken ? "Dashboard" : "Login"}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Tableau de bord' }}
        />
        <Stack.Screen
          name="Signup"
          component={SignUpScreen}
          options={{ title: 'Inscription' }}
        />
        <Stack.Screen
          name="NewArea"
          component={NewAreaScreen}
          options={{ title: 'Nouvelle AREA' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;