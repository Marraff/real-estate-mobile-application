import React from "react";
import {View, Text} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SignInScreen from '../screens/SignInScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import Home from '../screens/Home'
import DetailScreen from "../screens/Detail/DetailScreen";
import Houses from "../screens/Houses/Houses"
import Flats from "../screens/Flats/Flats";
import Profile from "../screens/Profile/Profile";
import AddProperty from "../screens/AddProperty/AddProperty";
import EditPost from "../screens/EditPost/EditPost";
import EditProperty from "../screens/EditProperty";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Dashboard() {
	return (
		<Tab.Navigator 
			screenOptions={({ route }) => ({
					headerShown: false,
					tabBarShowLabel: false,
					tabBarStyle: { backgroundColor: '#161615' }})}>
			<Tab.Screen 
				name="Home" 
				component={Home}
				options={{
					tabBarIcon: ({size, color}) => ( <Icon name={"home"} color={color} size={size * 1.5} />),
				}}
			/>
					
			<Tab.Screen name="Profile" component={Profile}/>
		</Tab.Navigator>
	);
}

function Login() {
	return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
			<Stack.Screen name="SignIn" component={SignInScreen}/>
			<Stack.Screen name="Register" component={RegisterScreen}/>
		</Stack.Navigator>
	);
}

function MainStack() {
	return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
        	<Stack.Screen name="Dashboard" component={Dashboard}/>
            <Stack.Screen name="DetailScreen" component={DetailScreen}/>
            <Stack.Screen name="Houses" component={Houses}/>
            <Stack.Screen name="Flats" component={Flats}/>
            <Stack.Screen name="AddProperty" component={AddProperty}/>
            <Stack.Screen name="EditPost" component={EditPost}/>
            <Stack.Screen name="EditProperty" component={EditProperty}/>
		</Stack.Navigator>
	);
}

const Navigation = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false, cardStyle: {backgroundColor: '#FFFFFF'}}}>
				<Stack.Screen name="Login" component={Login}/>
				<Stack.Screen name="MainStack" component={MainStack}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
