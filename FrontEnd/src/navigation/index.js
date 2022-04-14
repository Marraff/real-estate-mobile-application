import React from "react";
import {View, Text} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import Home from '../screens/Home'
import DetailScreen from "../screens/Detail/DetailScreen";
import Houses from "../screens/Houses/Houses"
import Flats from "../screens/Flats/Flats";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="SignIn" component={SignInScreen}/>
                <Stack.Screen name="Register" component={RegisterScreen}/>
                <Stack.Screen name="Home" component={Home}/>
                <Stack.Screen name="DetailScreen" component={DetailScreen}/>
                <Stack.Screen name="Houses" component={Houses}/>
                <Stack.Screen name="Flats" component={Flats}/>
                
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;