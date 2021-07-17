import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navigationRef } from './RootNavigation';
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CommitsScreen from "./src/screens/CommitsScreen";
import ProjectsScreen from "./src/screens/ProjectsScreen";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeNave = () => {
  return (
    <Drawer.Navigator drawerContent={props => {
      return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem label="Logout" onPress={() => {
            props.navigation.navigate("Login", {logout: true})
            }} />
        </DrawerContentScrollView>
      )
    }}>

      <Drawer.Screen name="Issues" component={HomeScreen} />
      <Drawer.Screen name="Commits" component={CommitsScreen} />
      <Drawer.Screen name="Projects" component={ProjectsScreen} />
    </Drawer.Navigator >
  )
}

const LoginNave = () => {
  return (
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
  )
}

function App() {
  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeNave} options={{ 
            headerShown: true, 
            headerLeft: null,
            headerTitleAlign: 'center',
            title: 'Estatísticas dos seus grupos',
            headerStyle: {
              backgroundColor: '#380075'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            }
             }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
